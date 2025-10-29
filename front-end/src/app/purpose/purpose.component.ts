import { Component, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Purposes } from '../enums/purposes';
import { InfoComponent } from '../info/info.component';
import { AutomatedDecisionMaking, Data, DataRecipient, LegalBasis, PrivacyModel, PseudonymizationMethod, Purpose, PurposeHierarchyElement, Retention } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { ToastrCreatorService } from '../service/toastr-creator.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { LayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';

@Component({
  selector: 'app-purpose',
  templateUrl: './purpose.component.html',
  styleUrls: ['./purpose.component.scss']
})
export class PurposeComponent implements OnInit {

  @ViewChild('matSelect')
  matSelect!: { close: () => void; };

  defaultLanguage = '';
  
  frmPurpose = this.fb.group({
    purposes: this.fb.array([])
  });

  // pList = [
  //   {value: Purposes[Purposes.CommercialInterest], viewValue: "Commercial interest"},
  //   {value: Purposes[Purposes.LegalCompliance], viewValue: "Legal compliance"},
  //   {value: Purposes[Purposes.ResearchAndDevelopment], viewValue: "Research and development"},
  //   {value: Purposes[Purposes.Security], viewValue: "Security"},
  //   {value: Purposes[Purposes.ServiceOptimization], viewValue: "Service optimization"},
  //   {value: Purposes[Purposes.ServicePersonalization], viewValue: "Service personalization"},
  //   {value: Purposes[Purposes.ServiceProvision], viewValue: "Service provision"}
  // ];

  // purposesName = [
  //   {value: "--", viewValue: "--"}
  // ];

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  purposeHierarchy = new Array<PurposeHierarchyElement>();

  selectedPurpose = new Array<string>();

  purposeList = new Array<Purpose>();
  inputList = new Array<Purpose>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptions: Array<{purposeIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{purposeIndex: number, headerList: Array<Header>}> = [];

  edited = false;

  legalBasisList: Array<{purposeIndex: number, legalBasisList: Array<LegalBasis>}> = [];
  dataRecipientList: Array<{purposeIndex: number, dataRecipientList: Array<DataRecipient>}> = [];
  dataList: Array<{purposeIndex: number, dataList: Array<Data>}> = [];
  privacyModelList: Array<{purposeIndex: number, privacyModelList: Array<PrivacyModel>}> = [];
  pseudonymizationMethodList: Array<{purposeIndex: number, pseudonymizationMethodList: Array<PseudonymizationMethod>}> = [];
  retention: Array<{purposeIndex: number, retention: Retention}> = [];
  automatedDecisionMakingList: Array<{purposeIndex: number, automatedDecisionMakingList: Array<AutomatedDecisionMaking>}> = [];

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      private toastrCreator: ToastrCreatorService,
      public dialogRef: MatDialogRef<PurposeComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: LayeredPrivacyPolicy, defaultLanguage: string, languageList: any[]}) {

    this.purposeList = data.data.purposeList.map(x => Object.assign(new Purpose(), x));
    this.inputList = data.data.purposeList.map(x => Object.assign(new Purpose(), x));
    this.defaultLanguage = data.defaultLanguage;
    
    if (this.inputList.length == 0) {
      this.inputList.push(new Purpose());
    }

    for (var i = 0; i < this.purposeList.length; i++) {
      
      // if (this.purposeList[i].name) {
      //   var item = {value: this.purposeList[i].name, viewValue: this.purposeList[i].name};
      //   this.pList.push(item);
      // }

      if (this.purposeList[i].head.length > 0) {
        this.changeHeaderData(i, this.purposeList[i].head);
        // this.headerIsClicked.push(i);
      }

      if (this.purposeList[i].desc.length > 0) {
        this.changeDescriptionData(i, this.purposeList[i].desc);
        // this.descriptionIsClicked.push(i);
      }

      var legalBases = {
        purposeIndex: i,
        legalBasisList: this.purposeList[i].legalBasisList
      }
      this.legalBasisList.push(legalBases);

      var dataRecipient = {
        purposeIndex: i,
        dataRecipientList: this.purposeList[i].dataRecipientList
      }
      this.dataRecipientList.push(dataRecipient);

      var dataL = {
        purposeIndex: i,
        dataList: this.purposeList[i].dataList
      }
      this.dataList.push(dataL);

      var privacyModel = {
        purposeIndex: i,
        privacyModelList: this.purposeList[i].privacyModelList
      }
      this.privacyModelList.push(privacyModel);

      var pseudonymizationMethod = {
        purposeIndex: i,
        pseudonymizationMethodList: this.purposeList[i].pseudonymizationMethodList
      }
      this.pseudonymizationMethodList.push(pseudonymizationMethod);

      var retention = {
        purposeIndex: i,
        retention: this.purposeList[i].retention
      }
      this.retention.push(retention);

      var automatedDecisionMaking = {
        purposeIndex: i,
        automatedDecisionMakingList: this.purposeList[i].automatedDecisionMakingList
      }
      this.automatedDecisionMakingList.push(automatedDecisionMaking);
    }

    if (this.purposeList.length == 0) {
      this.addPurpose();
    } else {
      this.purposeList.forEach(data => {
        const purposeForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.pattern(/\S/)]],
          required: [data.required],
          optOut: [data.optOut]
        })
      this.purposes.push(purposeForm);
      });
    }
    this.purposes.valueChanges.subscribe(_ => {this.updateData();});
    this.headerIsClicked.push(i);
    this.descriptionIsClicked.push(i);
    this.fill(this.purposes, "El");
    // this.fillPurposesName();
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmPurpose.markAllAsTouched();
  }

  isEdited() {
    var res = false;
    if (this.purposeList.length == this.inputList.length) {
      for (let index = 0; index < this.purposeList.length; index++) {
        res = res || !this.purposeList[index].isEqual(new Purpose(this.inputList[index]));
      }
      this.edited = res;
    } else {
      this.edited = true;
    }
  }
  
  close() {
    if (this.edited) {
      const message = "Save changes before closing?";
      const dialogData = new ConfirmDialogModel("Close ",message);
      var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        maxHeight: "200px",
        data: dialogData,
        disableClose: true
      });
      confirmRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === 1) {
          this.save();
        } else if (dialogResult === -1) {
          return;
        } else {
          this.dialogRef.close({ event: 'cancel'});     
        }
      });
    } else {
      this.dialogRef.close({ event: 'cancel'});
    }
  }

  cancel(): void {
    this.dialogRef.close({ event: 'cancel'});
  }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
          this.close();
      }
    });
  }

  fill(data: any, label: string) {
    var toShow = true;
    if (data.length > 1 && this.isDataComplete()) {
      toShow = false;
    }
    for (var t = 0; t < data.length; t++) {
      var tab = {t: t, show: toShow};
      this.elv.find(e => e.header == label)?.show.push(tab);
      if (this.show('El', t) && t < data.length-1) {
        this.viewList('El', t);
      }else{
        this.headerIsClicked.push(t);
        this.descriptionIsClicked.push(t);
      }
    }
  }

  viewList(tab: any, t: number) {
    let currentTab = this.elv.find(t => t.header == tab)!;
    currentTab.show.find(s => s.t == t)!.show = !currentTab.show.find(s => s.t == t)!.show;
    this.headerIsClicked.push(t);
    this.descriptionIsClicked.push(t);
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  isOptionDisabled(value: string, index: number): boolean {
    const dFormArray = this.frmPurpose.value.purposes.map((p: { name: any; }) => p.name) as readonly string[];
    const foundIndex = dFormArray.findIndex(e => e === value);
    return foundIndex !== -1 && foundIndex !== index;
  }

  isParentDisabled(value: string, index: number): boolean {
    const name = this.frmPurpose.value.purposes[index].name;
    return value === name;
  }

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.purposeIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.purposeIndex !== index);
    }
    var newHeadElement = {
      purposeIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.purposeIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.purposeIndex !== index);
    }
    var newDescrElement = {
      purposeIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
  }

  get purposes() {
    return this.frmPurpose.controls["purposes"] as FormArray;
  }

  addPurpose() {
    const purposeForm = this.fb.group({
        name: ["", [Validators.required, Validators.pattern(/\S/)]],
        required: [false],
        optOut: [false],
        customInput: [""],
        parent: [""]
    });
    this.purposes.push(purposeForm);
    // this.fillPurposesName();
    this.fill(this.purposes, "El");
    this.updateData();
  }

  deletePurpose(purposeIndex: number) {
    const message = "Are you sure you want to delete the following Purpose?<br><br><b>" + this.getBoxText(purposeIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Purpose\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeletePurpose(purposeIndex);
      }
    });
  }

  actuallyDeletePurpose(purposeIndex: number) {
    this.updateData();
    this.purposes.removeAt(purposeIndex);
    this.purposeList.splice(purposeIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.purposeIndex !== purposeIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].purposeIndex > purposeIndex) {
        this.descriptions[i].purposeIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.purposeIndex !== purposeIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].purposeIndex > purposeIndex) {
        this.headers[i].purposeIndex -= 1; 
      }
    }

    this.legalBasisList = this.legalBasisList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.legalBasisList, purposeIndex);

    this.dataRecipientList = this.dataRecipientList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.dataRecipientList, purposeIndex);

    this.dataList = this.dataList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.dataList, purposeIndex);

    this.privacyModelList = this.privacyModelList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.privacyModelList, purposeIndex);

    this.pseudonymizationMethodList = this.pseudonymizationMethodList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.pseudonymizationMethodList, purposeIndex);

    this.retention = this.retention.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.retention, purposeIndex);

    this.automatedDecisionMakingList = this.automatedDecisionMakingList.filter(e => e.purposeIndex !== purposeIndex);
    this.shiftIt(this.automatedDecisionMakingList, purposeIndex);

    this.updateData();

    const length = this.purposes.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.purposeList.length == 0) {
      this.addPurpose();
    }
  }

  shiftIt(list: Array<any>, index: number) {
    for (var i = 0; i < list.length; i++) {
      if (list[i].purposeIndex > index) {
        list[i].purposeIndex -= 1; 
      }
    }
  }

  isDataComplete(): boolean {
    var complete = true;
    this.purposeList.forEach((p: Purpose) =>{
      complete = complete && p.isComponentComplete();
    });
    return complete;
  }

  isPurposeComplete(i: number): boolean {
    return this.purposeList[i].isComponentComplete();
  }

  getSupport() {
    var data = new Array<string>();

    for (var i = 0; i < this.purposeList.length; i++) {
      var element = new Array<string>();
      element.push('<b>' + this.getBoxText(i) + ':</b>');

      var name = !StaticValidatorService.stringNotEmpty(this.purposeList[i].name);
      
      if(name) {
        element.push("<i>Basic Information:</i>");
      }

      if (name) {
        element.push('- purpose name (unique)');
      }

      var head = !this.isHeaderReady(i);
      var desc = !this.isDescriptionReady(i)

      if(head || desc) {
        element.push("<i>UI-Representation:</i>");
      }

      if (head) {
        element.push('- titles');
      }

      if (desc) {
        element.push('- descriptions');
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }

    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  // fillPurposesName() {
  //   this.updateData();
  //   var names = this.purposeList.map(p => p.name);
  //   for (var i = 0; i < names.length; i++) {
  //     if (this.purposesName.find(p => p.value === names[i])) {
  //       this.purposesName = this.purposesName.filter(p => p.value !== names[i]);
  //     }
  //     var item = {value: names[i], viewValue: this.pList.find(p => p.value == names[i])?.viewValue!};
  //     if (item.value !== "") {
  //       this.purposesName.push(item);
  //     }
  //   }
  // }

  updateData() {
    this.purposeList = [];
    for (var i = 0; i < this.purposes.controls.length; i++) {
      var pData = new Purpose();
      Object.assign(pData, this.purposes.controls[i].value);

      if (this.descriptions.find(d => d.purposeIndex == i)) { 
        pData.desc = this.descriptions.find(d => d.purposeIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.purposeIndex == i)) {    
        pData.head = this.headers.find(h => h.purposeIndex == i)?.headerList ?? new Array<Header>();   
      }

      var lb = this.legalBasisList.find(e => e.purposeIndex == i);
      if (lb) pData.legalBasisList = lb.legalBasisList;

      var dRl = this.dataRecipientList.find(e => e.purposeIndex == i);
      if (dRl) pData.dataRecipientList = dRl.dataRecipientList;

      var dL = this.dataList.find(e => e.purposeIndex == i);
      if (dL) pData.dataList = dL.dataList;

      var pM = this.privacyModelList.find(e => e.purposeIndex == i);
      if (pM) pData.privacyModelList = pM.privacyModelList;
      
      var pNm = this.pseudonymizationMethodList.find(e => e.purposeIndex == i);
      if (pNm) pData.pseudonymizationMethodList = pNm.pseudonymizationMethodList;

      var ret = this.retention.find(e => e.purposeIndex == i);
      if (ret) pData.retention = ret.retention;

      var aDm = this.automatedDecisionMakingList.find(e => e.purposeIndex == i);
      if (aDm) pData.automatedDecisionMakingList = aDm.automatedDecisionMakingList;

      this.purposeList.push(pData);
    }
    this.isEdited();
  }

  save(): void {
    var names = this.purposeList.map(p => p.name);
    let duplicates = this.checkForDuplicates(names);
    if (duplicates) {
      this.toastrCreator.showErrorMessage('Multiple purposes with the same name are not allowed', 'Saving is not possible');
    } else {
      var ret = this.purposeList;
      if (ret.length == 0 || ret.every((p: Purpose) => p.isEmpty())) {
        ret = new Array<Purpose>();
      }
      this.dialogRef.close({ event: 'close', data: ret});
    }
  }

  checkForDuplicates(array: Array<string>): boolean {
    return new Set(array).size !== array.length
  }

  addDescription(descriptionList: Array<Description>, purposeIndex: number) {
    this.changeDescriptionData(purposeIndex, descriptionList);
    this.updateData();
  }

  addHeader(headerList: Array<Header>, purposeIndex: number) {
    this.changeHeaderData(purposeIndex, headerList);
    this.updateData();
  }

  getDescription(index: number): Array<Description> {
    this.updateData();
    if(this.purposeList[index]) {
      return this.purposeList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    this.updateData();
    if(this.purposeList[index]) {
      return this.purposeList[index].head;
    } else {
      return new Array<Header>();
    }
  }

  clickDescription(index: number): void {
    if (this.descriptionIsClicked.includes(index)) {
      this.descriptionIsClicked.splice(this.descriptionIsClicked.indexOf(index), 1)
    } else {
      this.descriptionIsClicked.push(index);
    }
  }

  clickHeader(index: number): void {
    if (this.headerIsClicked.includes(index)) {
      this.headerIsClicked.splice(this.headerIsClicked.indexOf(index), 1)
    } else {
      this.headerIsClicked.push(index);
    }
  }

  isDescriptionReady(i: number): boolean {
    var descriptions = this.descriptions.find(d => d.purposeIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(descriptions.descriptionList[k].value)) {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.purposes.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.purposeIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {     
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == ''
        || !StaticValidatorService.stringNotEmpty(headers.headerList[k].value)) {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.purposes.controls[i])) return false;
    return true;
  }

  // addCategory(i: number, input: any) {
  //   // var item = {value: input, viewValue: input};
  //   // this.pList.push(item);
    
  //   const myForm = (<FormArray>this.frmPurpose.get("purposes")).at(i);
  //   myForm.patchValue({
  //     customInput: ""
  //   });
  //   // this.fillPurposesName();
  // }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Purpose(s)"),
      infoText: textCreator.getText("purpose")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  getHeaderTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit titles";
    } else {
      return "Click to hide titles";
    }
  }

  getDescTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit descriptions";
    } else {
      return "Click to hide descriptions";
    }
  }

  getBoxText(i: number): string {
    const name = this.frmPurpose.value.purposes.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return (name == ""? "Purpose " + (i + 1) : name);;
    } else return "Purpose " + (i + 1);
  }
}