import { Component, HostListener, Injectable, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ControllerComponent } from '../controller-component/controller.component';
import { DataProtectionOfficerComponent } from '../data-protection-officer/data-protection-officer.component';
import { DataSubjectRightComponent } from '../data-subject-right/data-subject-right.component';
import { LayeredPrivacyPolicy, UnderlyingLayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';
import { Step } from '../model/step';
import { PolicyInfoComponent } from '../policy-info/policy-info.component';
import { ExportService } from '../service/export.service';
import { Controller, Data, DataGroup, DataProtectionOfficer, DataRecipient, LegalBasis, LodgeComplaint, Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { ValidatorService } from '../service/validator.service';
import { LodgeComplaintComponent } from '../lodge-complaint/lodge-complaint.component';
import { PurposeComponent } from '../purpose/purpose.component';
import { PurposeHierarchyComponent } from '../purpose-hierarchy/purpose-hierarchy.component';
import { InfoComponent } from '../info/info.component';
import { InfoText } from '../resources/info-text';
import { LegalBasisComponent } from '../legal-basis/legal-basis.component';
import { DataRecipientListComponent } from '../data-recipient-list/data-recipient-list.component';
import { DataListComponent } from '../data-list/data-list.component';
import { RetentionComponent } from '../retention/retention.component';
import { PrivacyModelListComponent } from '../privacy-model-list/privacy-model-list.component';
import { AutomatedDecisionMakingListComponent } from '../automated-decision-making-list/automated-decision-making-list.component';
import { PseudonymizationMethodListComponent } from '../pseudonymization-method-list/pseudonymization-method-list.component';
import { ToastrCreatorService } from '../service/toastr-creator.service';
import { FlatTreeControl } from '@angular/cdk/tree';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { TreeNode} from '../model/node/node';
import { FlatNode} from '../model/node/flatNode';
import { CardsControlService } from '../service/cards-control.service';
import { SelectedDataComponent } from '../selected-data/selected-data.component';
import { IconService } from '../service/icon-service.service';
import { finalize } from 'rxjs/operators';
import { WarnMessageComponent } from '../warn-message/warn-message.component';
import { PolicyPreviewComponent } from '../policy-preview/policy-preview.component';
import { PrologResponseComponent } from '../prolog-response/prolog-response.component';
import { SelectedDataRecipientComponent } from '../selected-data-recipient/selected-data-recipient.component';
import { ActivatedRouteSnapshot, CanDeactivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { Description, Header } from '../model/lpl/ui-element';

@Component({
  selector: 'app-cards',
  templateUrl: './cards.component.html',
  styleUrls: ['./cards.component.scss']
})

@Injectable({
  providedIn:'root'
})
export class CardsComponent implements OnInit, CanDeactivate<CardsComponent> {

@HostListener('window:beforeunload', ['$event'])
beforeunloadHandler(_event: any) {
    return false;
}

  loading = false;
  lastFile = "";
  compliant = false;
  checked = false;
  currentId = 0;
  currentLpp = new LayeredPrivacyPolicy();
  lastId = 0;
  allLppList = new Array<LayeredPrivacyPolicy>();
  currentPurposesList = new Array<Purpose>();

  dataList = new Array<Data>();
  dataRecipientList = new Array<DataRecipient>();

  groupsList = new Array<DataGroup>();

  public nodeCounter: number = 0;

  private _transformer = (node: TreeNode, level: number) => {
    return {
      expandable: !!node.children && node.children.length > 0,
      name: node.name,
      id: node.id,
      level: level,
    };
  }

  treeControl = new FlatTreeControl<FlatNode>(
    node => node.level, node => node.expandable);

  treeFlattener = new MatTreeFlattener(
    this._transformer, node => node.level, node => node.expandable, node => node.children);

  dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);

  mobile = false;

  countryList = new Array<any>();
  languageList = new Array<any>();

  purposeIsClicked: Array<number> = [];
  purposeIsComplete: Array<number> = [];
  purposeHasChildren: Array<number> = [];
  purposeIsSubPurpose: Array<number> = [];
  purposesComplete = false;
  cardIsComplete: Array<string> = [];
  mainComplete = false;

  constructor(private iconService: IconService,
            public matDialog: MatDialog, 
            private exportService: ExportService,
            private toastrCreator: ToastrCreatorService,
            private validator: ValidatorService,
            private cardsControl: CardsControlService) {}

  canDeactivate(component: CardsComponent, currentRoute: ActivatedRouteSnapshot, currentState: RouterStateSnapshot, nextState?: RouterStateSnapshot | undefined): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return confirm('Leaving the editor will cause data loss.\n Would you like to close the editor now?');
  }

  hasChild = (_: number, node: FlatNode) => node.expandable;

  steps = new Array<Step>(
    {name: "Essential Information", description: "essential privacy policy information", label: "info", component: PolicyInfoComponent, filled: false, ready: false, req: true, icon: "loading"},
    // {name: "Privacy Icons", description: "Privacy policy graphical representation", label: "policyIcons", component: IconComponent, filled: false, ready: false, req: false, icon: "loading"},
    {name: "Data Controller(s)", description: "specify the data controller(s)", label: "controllerList", component: ControllerComponent, filled: false, ready: false, req: true, icon: "controller"},
    {name: "Data Protection Officer(s)", description: "specify data protection officer(s)", label: "dataProtectionOfficer", component: DataProtectionOfficerComponent, filled: false, ready: false, req: false, icon: "supervisoryAuthority"},
    {name: "Data Subject Rights", description: "select data subject rights", label: "dataSubjectRight", component: DataSubjectRightComponent, filled: false, ready: false, req: true, icon: "dsRights"},
    {name: "Supervisory Authority", description: "specify the competent supervisory authority", label: "lodgeComplaint", component: LodgeComplaintComponent, filled: false, ready: false, req: true, icon: "lodgeComplaint"},
    {name: "Data", description: "specify the data to be collected/stored/processed", label: "dataList", component: DataListComponent, filled: false, ready: false, req: true, icon: "data"},
    {name: "Data Recipient(s)", description: "specify data recipients", label: "dataRecipientList", component: DataRecipientListComponent, filled: false, ready: false, req: true, icon: "loading"},
    {name: "Purpose(s)", description: "define purposes for which data is collected/stored/processed", label: "purpose", component: PurposeComponent, filled: false, ready: false, req: true, icon: "processing"},
    {name: "Purpose Hierarchy", description: "hierarchical organization of purposes", label: "purposeHierarchy", component: PurposeHierarchyComponent, filled: false, ready: false, req: true, icon: "processing"}
    );

  purposeItems = new Array<Step>(
    {name: "Data", description: "select the data collected/stored/processed for this purpose", label: "dataList", component: SelectedDataComponent, filled: false, ready: false, req: true, icon: "data"},
    {name: "Data Recipient(s)", description: "select the data recipients of this purpose", label: "dataRecipient", component: SelectedDataRecipientComponent, filled: false, ready: false, req: false, icon: "loading"},
    {name: "Retention", description: "define how long the data will be stored", label: "retention", component: RetentionComponent, filled: false, ready: false, req: true, icon: "loading"},
    {name: "Legal Bases", description: "select legal bases for the purpose", label: "legalBasisList", component: LegalBasisComponent, filled: false, ready: false, req: true, icon: "legalBasis"},
    {name: "Privacy Model(s)", description: "add a privacy model to the purpose", label: "privacyModelList", component: PrivacyModelListComponent, filled: false, ready: false, req: false, icon: "loading"},
    {name: "Automated Decision-making", description: "describe automated decision-making processes", label: "automatedDecisionMakingList", component: AutomatedDecisionMakingListComponent, filled: false, ready: false, req: false, icon: "automatedDecision"},
    {name: "Pseudonymization Method(s)", description: "describe pseudonymization methods of this purpose", label: "pseudonymizationMethodList", component: PseudonymizationMethodListComponent, filled: false, ready: false, req: false, icon: "pseudonymization"}
    );

  ngOnInit(): void {
    this.iconService.registerIcons();

    this.currentLpp = this.fillOutIds(new LayeredPrivacyPolicy(), 0, null);
    this.allLppList.push(this.currentLpp);

    this.exportService.getCountryList().subscribe(async (res) => {
      const test = Object.entries(res);
      for (var i = 0; i < test.length; i++) {
        var item = {value: test[i][0], viewValue: test[i][1]};
        this.countryList.push(item);
      }
    });

    this.exportService.getLanguageList().subscribe(async (res) => {
      const test = Object.entries(res);
      for (var i = 0; i < test.length; i++) {
        var item = {value: test[i][0], viewValue: test[i][1]};
        this.languageList.push(item);
      }
    });

    if (window.screen.width < 1060) {
      this.mobile = true;
    }
  }

  // addUnderlyingPolicy(parentIndex: number): void {
  //   this.lastId = this.lastId + 1;
  //   var underlyingLpp = new UnderlyingLayeredPrivacyPolicy();
  //   underlyingLpp.layeredPrivacyPolicy.id = this.lastId;
  //   underlyingLpp.layeredPrivacyPolicy.parentId = parentIndex;
  //   this.currentLpp = underlyingLpp.layeredPrivacyPolicy;
  //   this.currentId = this.currentLpp.id!;
  //   this.allLppList.push(this.currentLpp);
  //   for(var step of this.steps) {
  //     step.ready = false;
  //   }
  //   this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
  //   this.save();

  //   this.fillAuxLists();
  //   this.steps.forEach(step => {
  //     step.ready = this.validator.isComponentReady(step.label, this.currentLpp, this.dataList);
  //   });
  // }

  upload(inputId: string): void {
    document.getElementById(inputId)?.click()
  }

  // handleUploadingUP(e: any, parentIndex: number) {
  //   this.loading = true;
  //   var underlyingLpp = new LayeredPrivacyPolicy();
  //   let fileReader = new FileReader();
  //   var file = e.target.files[0];
  //   if (file.type !== "text/xml") {
  //     this.loading = false;
  //     this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file');
  //   } else {
  //     fileReader.readAsText(file);
  //     fileReader.onload = (e) => {
  //       this.exportService.upload(fileReader.result)
  //       .pipe(
  //         finalize(() => this.loading = false)
  //       ).subscribe(res => { 
  //         this.lastId = this.lastId + 1;
  //         var newId = this.lastId;
  //         underlyingLpp = this.fillOutIds(this.cardsControl.fillOutLpp(res), this.lastId, this.currentId);
  //         var flatUnderLpl = this.cardsControl.createAllList(underlyingLpp);
  //         for(var i = 0; i < flatUnderLpl.length; i++) {
  //           this.allLppList.push(flatUnderLpl[i]);
  //         }  
  //         this.currentLpp = this.allLppList.find(p => p.id === newId)!;
  //         this.currentId = newId;
  //         this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
          
  //         this.fillAuxLists();

  //         this.steps.forEach(step => {
  //           step.ready = this.validator.isComponentReady(step.label, underlyingLpp, this.dataList);
  //           step.filled = step.ready;
  //           if (!step.filled) {
  //             step.filled = this.validator.isComponentFilled(step.label, underlyingLpp, this.dataList);
  //           }
  //         });
  //         this.save();

  //         this.toastrCreator.showSuccessMessage('Underlying policy uploaded successfully', 'POLICY UPLOADED');      
        
  //       },
  //       error => this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file')
  //       );
  //     }
  //   } 
  // }

  fillAuxLists() {
    var lists = this.currentLpp.purposeList.map(p => p.dataList);
      for(var i = 0; i < lists.length; i++) {
        for(var j = 0; j < lists[i].length; j++) {
          var names = this.dataList.map(d => d.name);
          if (!names.includes(lists[i][j].name)) {
            this.dataList.push(lists[i][j]);
          }
        }
      }

      var gList = new Array<DataGroup>();
      for (var g = 0; g < lists.length; g++) {
         for (var b = 0; b < lists[g].length; b++) {
           for (var q = 0; q < lists[g][b].dataGroupList.length; q++) {
            gList.push(lists[g][b].dataGroupList[q]);
           }
         }
      }

      for(var m = 0; m < gList.length; m++) {
        var groupsName = this.groupsList.map(d => d.name);
        if (!groupsName.includes(gList[m].name)) {
          this.groupsList.push(gList[m]);
        }
      }
  }

  fillOutIds(lpp: LayeredPrivacyPolicy, id: number, parentId: number | null): LayeredPrivacyPolicy {
    lpp.id = id;
    lpp.parentId = parentId;
    lpp.underlyingLayeredPrivacyPolicy = this.nestIds(lpp.underlyingLayeredPrivacyPolicy, id);
    return lpp;
  }

  nestIds(children: Array<UnderlyingLayeredPrivacyPolicy>, parentId: number): Array<UnderlyingLayeredPrivacyPolicy> {
    return children
    .map(child => { 
      if(child.layeredPrivacyPolicy) {
        this.lastId = this.lastId + 1;
        child.layeredPrivacyPolicy.id = this.lastId;
        child.layeredPrivacyPolicy.parentId = parentId;
        child.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy = 
            this.nestIds(child.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy, child.layeredPrivacyPolicy.id);  
      }
      return child;
  });
  }

  edit(step: Step): void {
    var lpp = this.allLppList.find(p => p.id == this.currentId);
    if (lpp) {
      this.currentLpp = lpp;
    }
    var dialogRef;
    if (step.label == "dataList") {
      var data = {dataList: this.dataList, groupsList: this.groupsList, defaultLanguage: this.currentLpp.lang, languageList: this.languageList};
      dialogRef = this.matDialog.open(step.component, {data: data, disableClose: true});
    } else if (step.label == "info") {
      var infoData = {currentLpp: this.currentLpp, lppNames: this.allLppList.map(lpp => lpp.name), languageList: this.languageList};
      dialogRef = this.matDialog.open(step.component, {data: infoData, disableClose: true});
    } else if (step.label === "dataRecipientList") {
      var dataDR = {drList: this.dataRecipientList, countyCodes: this.countryList, defaultLanguage:  this.currentLpp.lang, languageList: this.languageList};
      dialogRef = this.matDialog.open(step.component, {data: dataDR, disableClose: true});
    } else {
      var dataLPP = {data: this.currentLpp, defaultLanguage: this.currentLpp.lang, languageList: this.languageList}
      dialogRef = this.matDialog.open(step.component, {data: dataLPP, disableClose: true});
    }
        dialogRef.afterClosed().subscribe(result => {
      if (result) {
          if (result.event === "close") {
            // step.filled = step.filled || true;
          switch (step.label) {
            case 'controllerList':
              this.allLppList.find(p => p.id == this.currentId)!.controllerList = result.data;
              step.filled = result.data.length > 0;  
              break;
            case 'info':
              var empty = true;
              console.log(result.data);
              this.allLppList.find(p => p.id == this.currentId)!.desc = result.data.desc;
              empty = empty && result.data.desc.length == 0;
              this.allLppList.find(p => p.id == this.currentId)!.head = result.data.head;
              empty = empty && result.data.head.length == 0;
              this.allLppList.find(p => p.id == this.currentId)!.name = result.data.genInfo.name;
              empty = empty && result.data.genInfo.name == "";
              this.allLppList.find(p => p.id == this.currentId)!.privacyPolicyUri = result.data.genInfo.uri;
              empty = empty && result.data.genInfo.uri == "";
              this.allLppList.find(p => p.id == this.currentId)!.lang = !result.data.genInfo.lang? "" : result.data.genInfo.lang;
              step.filled = !empty;
              break;  
            case 'dataList':
              this.dataList = result.data.dataList;
              this.groupsList = result.data.groupsList;
              this.currentLpp.completeDataList = result.data.dataList;
              this.currentLpp.completeDataGroupList = result.data.groupsList;
              this.updateDataLists();
              step.filled = result.data.dataList.length > 0 || result.data.groupsList.length > 0;
              break;
            case 'dataProtectionOfficer':
              this.allLppList.find(p => p.id == this.currentId)!.dataProtectionOfficerList = result.data;
              step.filled = result.data.length > 0;
              break;
            // case 'policyIcons':
            //   this.allLppList.find(p => p.id == this.currentId)!.iconList = result.data;
            //   break;  
            case 'dataSubjectRight':
              this.allLppList.find(p => p.id == this.currentId)!.dataSubjectRightList = result.data;
              step.filled = result.data.length > 0;
              break;  
            case 'lodgeComplaint':
              this.allLppList.find(p => p.id == this.currentId)!.lodgeComplaint = result.data;
              step.filled = !result.data.isEmpty();
              break;
            case 'dataRecipientList':
              this.dataRecipientList = result.data;
              this.currentLpp.completeDataRecipientList = result.data;
              this.updateDataRecipientLists();
              step.filled = result.data.length > 0;
              break;
            case 'purpose':
              this.allLppList.find(p => p.id == this.currentId)!.purposeList = result.data;
              this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
              // this.allLppList.find(p => p.id == this.currentId)!.purposeHierarchy = new Array<PurposeHierarchyElement>();
              step.filled = result.data.length > 0;
              break;
            case 'purposeHierarchy':
              this.allLppList.find(p => p.id == this.currentId)!.purposeHierarchy = result.data;
              step.filled = result.data.length > 0;
              this.purposeHasChildren = [];
              this.purposeIsSubPurpose = [];
              result.data.forEach((element: PurposeHierarchyElement ) => {
                var index = this.allLppList.find(p => p.id == this.currentId)!.purposeList.findIndex(purpose => purpose.name == element.superPurpose);
                 if (index > -1) {
                    this.purposeHasChildren.push(index);
                    this.purposeIsSubPurpose.push(this.allLppList.find(p => p.id == this.currentId)!.purposeList.findIndex(purpose => purpose.name == element.subPurpose));
                 }
              });
              break;
            default:
              break;
          } 
          step.ready = this.validator.isComponentReady(step.label, this.currentLpp, this.dataList);
          if (step.ready) {
            if (!this.cardIsComplete.includes(step.label)) {
              this.cardIsComplete.push(step.label);
            }
          } else {
            if (this.cardIsComplete.includes(step.label)) {
              this.cardIsComplete.splice(this.cardIsComplete.findIndex(s => s == step.label),1);
            }
          }
        }
        this.mainComplete = this.cardIsComplete.length == this.steps.length;
        this.checkPurposes();
        this.save();
        this.compliant = false;
        this.checked = false;
      }
    });
  }

  updateDataLists(): void {
    for (let index = 0; index < this.currentLpp.purposeList.length; index++) {
      const purpose = this.currentLpp.purposeList[index];
      var dtList = new Array<Data>();
      purpose.dataList.forEach(dt => {
        var ndt = this.dataList.find(d => d.id == dt.id);
        if (ndt) {
          dtList.push(ndt);
        }
      });
      purpose.dataList = dtList;
    }
  }

  updateDataRecipientLists(): void {
    for (let index = 0; index < this.currentLpp.purposeList.length; index++) {
      const purpose = this.currentLpp.purposeList[index];
      var dtrList = new Array<DataRecipient>();
      purpose.dataRecipientList.forEach(dtr => {
        var ndtr = this.dataRecipientList.find(d => d.id == dtr.id);
        if (ndtr) {
          dtrList.push(ndtr);
        }
      });
      purpose.dataRecipientList = dtrList;
    }
  }

  readyToDownload(): boolean {
    return this.validator.isLppReady(this.cardsControl.createTree(this.allLppList));
  }

  lppFilled() {
    return this.steps.filter(s => s.req === true && s.ready === false).length === 0 &&
      this.readyToDownload();
  }

  async export() {
    this.loading = true;
    if (!this.lppFilled()) {
      this.toastrCreator.showWarningMessage('The generated policy does not contain all the required information.', 'POLICY INCOMPLETE');
    }
    var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    
    this.exportService.download(this.cardsControl.mapLpp(this.cardsControl.createTree(lpp))).pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      const a = document.createElement('a');
      
      const objectUrl = URL.createObjectURL
        (new Blob([res], 
          {
          type: "text/plain;charset=utf-8"
          }
        ));
      a.href = objectUrl
      a.download = (this.lastFile != "" ? this.lastFile.slice(0,this.lastFile.length-4) : this.currentLpp.name == "" ? "UnnamedPolicy" : this.currentLpp.name) + ".xml";
      a.click();
      URL.revokeObjectURL(objectUrl);  
    });
  }

  async exportJSON() {
    this.loading = true;
    if (!this.lppFilled()) {
      this.toastrCreator.showWarningMessage('The generated policy does not contain all the required information.', 'POLICY INCOMPLETE');
    }
    var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    
    this.exportService.downloadAsJSON(this.cardsControl.mapLpp(this.cardsControl.createTree(lpp))).pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      const a = document.createElement('a');
      
      const objectUrl = URL.createObjectURL
        (new Blob([res], 
          {
          type: "text/plain;charset=utf-8"
          }
        ));
      a.href = objectUrl
      a.download = (this.lastFile != "" ? this.lastFile.slice(0,this.lastFile.length-4) : this.currentLpp.name == "" ? "UnnamedPolicy" : this.currentLpp.name) + ".json";
      a.click();
      URL.revokeObjectURL(objectUrl);  
    });
  }

  async exportProlog() {
    this.loading = true;
    if (!this.lppFilled()) {
      this.toastrCreator.showWarningMessage('The generated policy does not contain all the required information.', 'POLICY INCOMPLETE');
    }
    // var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    // this.exportService.downloadAsProlog(this.cardsControl.mapLppProlog(lpp, this.cardsControl.getALlData(lpp)))
    this.exportService.downloadAsProlog(this.currentLpp)
    .pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL
        (new Blob([res], 
          {
          type: "text/plain;charset=utf-8"
          }
        ));
      a.href = objectUrl
      a.download = (this.lastFile != "" ? this.lastFile.slice(0,this.lastFile.length-4) : this.currentLpp.name == "" ? "UnnamedPolicy" : this.currentLpp.name) + ".pl";
      a.click();
      URL.revokeObjectURL(objectUrl);  
    });
  }

  async exportText() {
    this.loading = true;
    if (!this.lppFilled()) {
      this.toastrCreator.showWarningMessage('The generated policy does not contain all the required information.', 'POLICY INCOMPLETE');
    }
    var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    this.exportService.downloadAsText(this.cardsControl.mapLppProlog(lpp, this.cardsControl.getALlData(lpp)))
    .pipe(
      finalize(() => this.loading = false)
    ).subscribe(res => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL
        (new Blob([res], 
          {
          type: "text/plain;charset=utf-8"
          }
        ));
      a.href = objectUrl
      a.download = (this.lastFile != "" ? this.lastFile.slice(0,this.lastFile.length-4) : this.currentLpp.name == "" ? "UnnamedPolicy" : this.currentLpp.name) + ".txt";
      a.click();
      URL.revokeObjectURL(objectUrl);  
    });
  }

  async prologResponse() {
    this.loading = true;
    if (!this.lppFilled()) {
      this.toastrCreator.showWarningMessage('The generated policy does not contain all the required information.', 'POLICY INCOMPLETE');
    }
    // var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    // this.exportService.downloadPrologResponse(this.cardsControl.mapLppProlog(lpp, this.cardsControl.getALlData(lpp)))
    this.exportService.downloadPrologResponse(this.currentLpp)
    .pipe(
      finalize(() => this.loading = false)
    ).subscribe((res: Array<string>) => {
      var dialogRef;
      this.checked = true;
      if (res.includes("No compliance issues detected.")) {
        this.compliant = true;
      }
      dialogRef = this.matDialog.open(PrologResponseComponent, {data: res});
    });
  }

  reset(): void {
    const message = "Unsaved changes will be deleted. \n Do you wish to continue?";
    const dialogData = new ConfirmDialogModel("Reset ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "250px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.resetAll();
      }
    });
  }

  getComplianceTooltip(): string {
    return this.lppFilled() ? "Click to check for GDPR-compliance." : "Policy is incomplete. Complete the policy before checking GDPR-compliance.";
  }

  resetAll(): void {
      this.steps.forEach(s => {s.ready = false; s.filled = false;});
      this.toastrCreator.showSuccessMessage('Generated policy has been reset successfully', 'RESET SUCCESSFUL');
      this.dataSource.data = [];
      this.allLppList = [];
      this.currentId = 0;
      this.currentPurposesList = new Array<Purpose>();
      this.dataList = new Array<Data>();
      this.groupsList = new Array<DataGroup>();
      this.dataRecipientList = new Array<DataRecipient>();

      this.compliant = false;
      this.checked = false;

      this.purposeIsClicked = [];
      this.purposeIsComplete = [];
      this.purposesComplete = false;
      this.cardIsComplete = [];
      this.mainComplete = false;

      var lpp = new LayeredPrivacyPolicy();
      lpp = this.fillOutIds(lpp, 0, null);
      this.currentLpp = lpp;
      this.allLppList.push(this.currentLpp);

      this.lastFile = "";
      this.purposeHasChildren = [];
      this.purposeIsSubPurpose = [];

      if (window.screen.width < 1060) {
        this.mobile = true;
      }
  }

  handle(e:any): void {
    const message = "Unsaved changes will be deleted when loading an existing policy. \n Do you wish to continue?";
    const dialogData = new ConfirmDialogModel("Load Policy ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "250px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        if (e.target.id == "mainPP") {
          this.handleUpload(e);
        } else {
          this.handleDFD(e);
        }
      }
    });
  }

  handleUpload(e: any){
    this.resetAll();
    this.loading = true;
    var lpp = new LayeredPrivacyPolicy();
    let fileReader = new FileReader();
    var file = e.target.files[0];
    if (file.type !== "text/xml") {
      this.loading = false;
      this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file');
    } else {
      this.lastFile = file.name;
      fileReader.readAsText(file);
      fileReader.onload = (e) => {
        this.exportService.upload(fileReader.result).pipe(
          finalize(() => this.loading = false)
        ).subscribe(res => {
          lpp = this.fillOutIds(this.cardsControl.fillOutLpp(res), 0, null);
          
          this.currentLpp = lpp;
          this.loadPolicy(lpp);
          this.save(lpp);
          this.allLppList = this.cardsControl.createAllList(lpp);
          this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
          // this.fillAuxLists();
          this.steps.forEach(step => {
            step.ready = this.validator.isComponentReady(step.label, lpp, this.dataList);
            step.filled = step.ready;
            if (!step.filled) {
              step.filled = this.validator.isComponentFilled(step.label, lpp, this.dataList);
            }
            if (step.ready) {
              if (!this.cardIsComplete.includes(step.label)) {
                this.cardIsComplete.push(step.label);
              }
            } else {
              if (this.cardIsComplete.includes(step.label)) {
                this.cardIsComplete.splice(this.cardIsComplete.findIndex(s => s == step.label),1);
              }
            }
          });
          this.mainComplete = this.cardIsComplete.length == this.steps.length;
          this.checkPurposes();
          this.toastrCreator.showSuccessMessage('Policy uploaded successfully', 'POLICY UPLOADED'); 
        },
        error => this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file')
        )  
      } 
    } 
  }

  handleDFD(e: any){
    this.resetAll();
    this.loading = true;
    var lpp = new LayeredPrivacyPolicy();
    let fileReader = new FileReader();
    var file = e.target.files[0];
    if (!file.name.includes(".dataflow")) {
      this.loading = false;
      this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file');
    } else {
      fileReader.readAsText(file);
      fileReader.onload = (e) => {
        this.exportService.uploadDFD(fileReader.result).pipe(
          finalize(() => this.loading = false)
        ).subscribe(res => {
          lpp = this.fillOutIds(this.cardsControl.fillOutLpp(res), 0, null);
          this.currentLpp = lpp;
          this.loadPolicy(lpp);
          this.save(lpp);
          this.allLppList = this.cardsControl.createAllList(lpp);
          this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
          this.steps.forEach(step => {
            step.ready = this.validator.isComponentReady(step.label, lpp, this.dataList);
            step.filled = step.ready;
            if (!step.filled) {
              step.filled = this.validator.isComponentFilled(step.label, lpp, this.dataList);
            }
            if (step.ready) {
              if (!this.cardIsComplete.includes(step.label)) {
                this.cardIsComplete.push(step.label);
              }
            } else {
              if (this.cardIsComplete.includes(step.label)) {
                this.cardIsComplete.splice(this.cardIsComplete.findIndex(s => s == step.label),1);
              }
            }
          });
          this.mainComplete = this.cardIsComplete.length == this.steps.length;
          this.checkPurposes();
          this.toastrCreator.showSuccessMessage('DFD imported successfully', 'DFD IMPORTED'); 
        },
        error => this.toastrCreator.showErrorMessage('The selected file format might not be supported', 'Error loading the file')
        )  
      } 
    } 
  }

  checkPurposes() {
    for (let index = 0; index < this.currentPurposesList.length; index++) {
      const purpose = this.currentPurposesList[index];
      if (purpose.isPurposeCardComplete()) {
        if (!this.purposeIsComplete.includes(index)) {
          this.purposeIsComplete.push(index);
        }
      } else {
        if (this.purposeIsComplete.includes(index)) {
          this.purposeIsComplete.splice(this.purposeIsComplete.indexOf(index), 1);
        }
      }
    }
    this.purposeHasChildren = [];
    this.purposeIsSubPurpose = [];
    this.allLppList.find(p => p.id == this.currentId)!.purposeHierarchy.forEach((element: PurposeHierarchyElement ) => {
                var index = this.allLppList.find(p => p.id == this.currentId)!.purposeList.findIndex(purpose => purpose.name == element.superPurpose);
                 if (index > -1) {
                    this.purposeHasChildren.push(index);
                    this.purposeIsSubPurpose.push(this.allLppList.find(p => p.id == this.currentId)!.purposeList.findIndex(purpose => purpose.name == element.subPurpose));
                 }
              });
    this.purposesComplete = this.purposeIsComplete.length == this.allLppList.find(p => p.id == this.currentId)!.purposeList.length && this.allLppList.find(p => p.id == this.currentId)!.purposeList.length > 0;
  }

  loadPolicy(lpp: LayeredPrivacyPolicy) {
    var controllers = lpp.controllerList;
    this.currentLpp.controllerList = [];
    controllers.forEach(c => {
      this.currentLpp.controllerList.push(new Controller(c));
    });
    var dpos = lpp.dataProtectionOfficerList;
    this.currentLpp.dataProtectionOfficerList = [];
    dpos.forEach(d => {
      this.currentLpp.dataProtectionOfficerList.push(new DataProtectionOfficer(d));
    });
    this.currentLpp.lodgeComplaint = new LodgeComplaint(lpp.lodgeComplaint);
    var data = lpp.completeDataList;
    this.dataList = new Array<Data>();
    data.forEach(d => {
      this.dataList.push(new Data(d));
    });
    this.currentLpp.completeDataList = this.dataList;
    var groups = lpp.completeDataGroupList;
    this.groupsList = [];
    groups.forEach(g => {
      this.groupsList.push(new DataGroup(g));
    });
    this.currentLpp.completeDataGroupList = this.groupsList;
    var drs = lpp.completeDataRecipientList;
    this.dataRecipientList = [];
    drs.forEach(dr => {
      this.dataRecipientList.push(new DataRecipient(dr));
    });
    this.currentLpp.completeDataRecipientList = this.dataRecipientList;
    var purposes = lpp.purposeList;
    this.currentLpp.purposeList = [];
    purposes.forEach(p => {
      this.currentLpp.purposeList.push(new Purpose(p));
    });
    var head = lpp.head;
    this.currentLpp.head = [];
    head.forEach(h => {
      this.currentLpp.head.push(new Header(h));
    });
    var desc = lpp.desc;
    this.currentLpp.desc = [];
    desc.forEach(d => {
      this.currentLpp.desc.push(new Description(d));
    });
  }

  isFilled(step: any): boolean {
    return this.steps.filter(f => f.label == step.label)[0].filled;
  }

  isComplete(step: any): boolean {
    return this.steps.filter(f => f.label == step.label)[0].ready;
  }

  isPurposeFilled(purpose: Purpose): boolean {
    return purpose.dataRecipientList.length > 0 &&
      purpose.dataList.length > 0 &&
      purpose.legalBasisList.length > 0 &&
      purpose.privacyModelList.length > 0 &&
      purpose.pseudonymizationMethodList .length > 0 &&
      purpose.automatedDecisionMakingList.length > 0 &&
      purpose.retention.type != ""
  }

  getInfo(step: any, label: string) {
    var textCreator = new InfoText();
    if (step.label === 'dataList' && label === 'p') {
      var data = {
        title: this.cardsControl.titleCase(step.name),
        infoText: textCreator.getText('datum')
      }
    } else {
      var data = {
        title: this.cardsControl.titleCase(step.name),
        infoText: textCreator.getText(step.label)
      }
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  addPurposeItem(index: number, step: Step): void {
    var lpp = this.allLppList.find(p => p.id == this.currentId)!;
    var dialogRef;
    if (step.label === "dataList") {
      var data = {allData: this.dataList, lppData: lpp.purposeList[index].dataList, name: lpp.purposeList[index].name, purposeHierarchy: lpp.purposeHierarchy, hasSubData: this.purposeHasChildren.includes(index), lpp: lpp}
      dialogRef = this.matDialog.open(step.component, {data: data, disableClose: true});
    } else if (step.label === "dataRecipient") {
      var dataDR = {selDR: lpp.purposeList[index].dataRecipientList, allDR: this.dataRecipientList, name: lpp.purposeList[index].name, purposeHierarchy: lpp.purposeHierarchy, hasSubDataRecipients: this.purposeHasChildren.includes(index), lpp: lpp};
      dialogRef = this.matDialog.open(step.component, {data: dataDR, disableClose: true});
    } else {
      var dataLPP = {data: lpp.purposeList[index], defaultLanguage:  this.currentLpp.lang, languageList: this.languageList, name: lpp.purposeList[index].name, purposeHierarchy: lpp.purposeHierarchy, hasSub: this.purposeHasChildren.includes(index), lpp: lpp}
      dialogRef = this.matDialog.open(step.component, {data: dataLPP, disableClose: true});
    }
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (result.event === "close") {
          switch (step.label) {
            case 'dataRecipient':
              lpp.purposeList[index].dataRecipientList = result.data;
              if (this.purposeIsSubPurpose.includes(index)) {
                var superDataRecipients = lpp.purposeList.find(p => p.name === lpp.purposeHierarchy.find(element => element.subPurpose === lpp.purposeList[index].name)?.superPurpose)?.dataRecipientList;
                result.data.forEach((dataRec: DataRecipient) => {
                  if (superDataRecipients!.findIndex(d => d.name === dataRec.name) < 0) {
                    superDataRecipients!.push(dataRec);
                  }
                });
              }
              break;
            case 'dataList':
              lpp.purposeList[index].dataList = result.data;
              if (this.purposeIsSubPurpose.includes(index)) {
                var superData = lpp.purposeList.find(p => p.name === lpp.purposeHierarchy.find(element => element.subPurpose === lpp.purposeList[index].name)?.superPurpose)?.dataList;
                result.data.forEach((data: Data) => {
                  if (superData!.findIndex(d => d.name === data.name) < 0) {
                    superData!.push(data);
                  }
                });
              }
              break; 
            case 'retention':
              lpp.purposeList[index].retention = result.data;
              break; 
            case 'privacyModelList':
              lpp.purposeList[index].privacyModelList = result.data;
              break;  
            case 'legalBasisList':
              lpp.purposeList[index].legalBasisList = result.data;
              if (this.purposeIsSubPurpose.includes(index)) {
                var superLegalBases = lpp.purposeList.find(p => p.name === lpp.purposeHierarchy.find(element => element.subPurpose === lpp.purposeList[index].name)?.superPurpose)?.legalBasisList;
                result.data.forEach((legalBasis: LegalBasis) => {
                  if (superLegalBases!.findIndex(d => d.lbCategory === legalBasis.lbCategory) < 0) {
                    superLegalBases!.push(legalBasis);
                  }
                });
              }
              break; 
            case 'automatedDecisionMakingList':
              lpp.purposeList[index].automatedDecisionMakingList = result.data;
              break;
            case 'pseudonymizationMethodList':
              lpp.purposeList[index].pseudonymizationMethodList = result.data;
              break;             
            default:
              break;
          }
          if (lpp.purposeList[index].isPurposeCardComplete()) {
            if (!this.purposeIsComplete.includes(index)) {
              this.purposeIsComplete.push(index);
            }
          } else {
            if (this.purposeIsComplete.includes(index)) {
              this.purposeIsComplete.splice(this.purposeIsComplete.indexOf(index), 1);
            }
          }
        }
        this.purposesComplete = this.purposeIsComplete.length == lpp.purposeList.length;
        this.save();
        this.compliant = false;
        this.checked = false;
      }
    });
  }

  isPurposeItemFilled(purpose: any, method: string): boolean {
    return !this.validator.isPurposeComponentEmpty(purpose, method);
  }

  isPurposeItemComplete(purpose: any, method: string): boolean {
    return this.validator.isPurposeComponentReady(purpose, method);
  }

  // deleteUnderlyingPolicy(id: number): void {
  //   var policyToDelete = this.allLppList.find(p => p.id == id); 
  //   var parentId = policyToDelete?.parentId!; 
    
  //   if (this.currentId == id) {
  //     var lpp = this.allLppList.find(p => p.id == parentId);
  //     if (lpp) {
  //       this.currentLpp = lpp;
  //       this.currentId = parentId;
  //     }
  //   }

  //   if (this.currentId !== id && this.currentLpp.parentId == id) {
  //     var lpp = this.allLppList.find(p => p.id == parentId);
  //     if (lpp) {
  //       this.currentLpp = lpp;
  //       this.currentId = lpp.id!;
  //     }
  //   }

  //   this.allLppList = this.allLppList.filter(p => p.id !== id);

  //   this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;

  //   this.fillAuxLists();

  //   this.steps.forEach(step => {
  //     step.ready = this.validator.isComponentReady(step.label, this.currentLpp, this.dataList);
  //   });

  //   this.save();
  // }

  save(lpp?: LayeredPrivacyPolicy): void {
    var tree;
    if (lpp) {
      tree = lpp;
    } else {
      tree = this.cardsControl.createTree(this.allLppList);
    }
    var treeData: TreeNode[] = this.createNodeTree(tree);
    this.dataSource.data = treeData;
    this.treeControl.expandAll();
  }

  createNodeTree(lpp: LayeredPrivacyPolicy): Array<TreeNode> {
    var tree: Array<TreeNode> = [
      {
        name: lpp.name,
        id: lpp.id!,
      }
    ];
    var children = this.nestNode(lpp.underlyingLayeredPrivacyPolicy);
    tree[0].children = children;
    return tree;
  }

  nestNode(items: Array<UnderlyingLayeredPrivacyPolicy>): Array<TreeNode> {
    return items
      .map(item => { 
        var TREE_DATA: TreeNode = 
          {
            name: item.layeredPrivacyPolicy.name,
            id: item.layeredPrivacyPolicy.id!,
          };
        TREE_DATA.children = this.nestNode(item.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy);
        return TREE_DATA;
    });
  }

  getPolicyName(name: string): string {
    if (name.length > 10) return name.substring(0, 9) + " ...";
    return name !== '' ? name : "new policy" 
  }

  isSelected(id: number): boolean {
    return id == this.currentId;
  }

  selectPP(id: number): void {
    this.currentId = id;
    this.currentLpp = this.allLppList.find(p => p.id == id)!;
    this.fillAuxLists();
    this.steps.forEach(step => {
      step.ready = this.validator.isComponentReady(step.label, this.allLppList.find(p => p.id == id)!, this.dataList);
    });
    this.currentPurposesList = this.allLppList.find(p => p.id == this.currentId)!.purposeList;
  }

  // isStepRequired(step: Step): boolean {
  //   return step.req;
  // }

  // getPurpName(name: string): string {
  //   var pList = [
  //     {value: Purposes[Purposes.CommercialInterest], viewValue: "Commercial interest"},
  //     {value: Purposes[Purposes.LegalCompliance], viewValue: "Legal compliance"},
  //     {value: Purposes[Purposes.ResearchAndDevelopment], viewValue: "Research and development"},
  //     {value: Purposes[Purposes.Security], viewValue: "Security"},
  //     {value: Purposes[Purposes.ServiceOptimization], viewValue: "Service optimization"},
  //     {value: Purposes[Purposes.ServicePersonalization], viewValue: "Service personalization"},
  //     {value: Purposes[Purposes.ServiceProvision], viewValue: "Service provision"}
  //   ];
  //   return pList.find(p => p.value === name)?.viewValue!;
  // }

  uppExists(id: number): boolean {
    return this.allLppList.find(p => p.parentId == id) !== undefined;
  }

  getWarnMessage() {
    var dialogRef;
      dialogRef = this.matDialog.open(WarnMessageComponent, {data: this.validator.buildWarnMessage(this.allLppList)});
  }

  getRawPolicy() {
    var lpp = this.cardsControl.makeDeepCopy(this.allLppList);
    var dialogRef;
    dialogRef = this.matDialog.open(PolicyPreviewComponent, {data: lpp}); 
  }

  getEditText(step: Step, i: number): string {
    if (step.label === "purpose" && this.currentLpp.purposeList.length === 0) {
      return "ADD";
    }
    if (step.label === "dataList") {
      if (i === -1 && this.dataList.length === 0) {
        return "ADD";
      }
      if (i >= 0 && this.currentPurposesList[i].dataList.length === 0) {
        return "ADD"; 
      }
    }
    if (step.label === "controllerList" && this.currentLpp.controllerList.length === 0) {
      return "ADD";
    }
    if (step.label === "dataProtectionOfficer" && this.currentLpp.dataProtectionOfficerList.length === 0) {
      return "ADD";
    }
    if (step.label === "dataRecipientList") {
      if (i === -1 && this.dataRecipientList.length === 0) {
        return "ADD";
      }
      if (i >= 0 && this.currentPurposesList[i].dataRecipientList.length === 0) {
        return "ADD"; 
      }
    }
    if (step.label ==="privacyModelList" && this.currentPurposesList[i].privacyModelList.length === 0) {
      return "ADD";
    }
    if (step.label === "automatedDecisionMakingList" && this.currentPurposesList[i].automatedDecisionMakingList.length === 0) {
      return "ADD";
    }
    if (step.label === "pseudonymizationMethodList" && this.currentPurposesList[i].pseudonymizationMethodList.length === 0) {
      return "ADD";
    }
    return "EDIT";
  }

  clickPurpose(index: number): void {
    if (this.purposeIsClicked.includes(index)) {
      this.purposeIsClicked.splice(this.purposeIsClicked.indexOf(index), 1)
    } else {
      this.purposeIsClicked.push(index);
    }
  }

}