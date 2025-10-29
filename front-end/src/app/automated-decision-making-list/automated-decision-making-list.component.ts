import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { AutomatedDecisionMaking, Purpose } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-automated-decision-making-list',
  templateUrl: './automated-decision-making-list.component.html',
  styleUrls: ['./automated-decision-making-list.component.scss']
})
export class AutomatedDecisionMakingListComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  frmAdm = this.fb.group({
    adms: this.fb.array([])
  });

  admList = new Array<AutomatedDecisionMaking>();
  inputList = new Array<AutomatedDecisionMaking>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptions: Array<{admIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{admIndex: number, headerList: Array<Header>}> = [];

  defaultLanguage = '';
  name = "";
  edited = false;

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      public dialogRef: MatDialogRef<AutomatedDecisionMakingListComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: Purpose, defaultLanguage:  string, languageList: any[], name: string}) {
        
    this.admList = data.data.automatedDecisionMakingList.map(x => Object.assign(new AutomatedDecisionMaking(), x));
    this.inputList = data.data.automatedDecisionMakingList.map(x => Object.assign(new AutomatedDecisionMaking(), x));

    if (this.inputList.length == 0) {
      this.inputList.push(new AutomatedDecisionMaking());
    }

    this.defaultLanguage = data.defaultLanguage;
    this.name = data.name;

    for (var i = 0; i < this.admList.length; i++) {
      
      if (this.admList[i].head.length > 0) {
        this.changeHeaderData(i, this.admList[i].head);
      }

      if (this.admList[i].desc.length > 0) {
        this.changeDescriptionData(i, this.admList[i].desc);
      }
    }

    if (this.admList.length == 0) {
      this.addAdm();
    } else {
      this.admList.forEach(data => {
        const admForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.pattern(/\S/)]]
        })
      this.adms.push(admForm);
      });
    }
    this.adms.valueChanges.subscribe(_ => {this.updateData()});
    this.fill(this.adms, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmAdm.markAllAsTouched();
  }

  isEdited() {
    var res = false;
    if (this.admList.length == this.inputList.length) {
      for (let index = 0; index < this.admList.length; index++) {
        res = res || !this.admList[index].isEqual(this.inputList[index]);
      }
      this.edited = res
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

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.admIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.admIndex !== index);
    }
    var newHeadElement = {
      admIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.admIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.admIndex !== index);
    }
    var newDescrElement = {
      admIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
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
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  get adms() {
    return this.frmAdm.controls["adms"] as FormArray;
  }

  addAdm() {
    const admForm = this.fb.group({
        name: ["", [Validators.required, Validators.pattern(/\S/)]]
    });
    this.adms.push(admForm);
    this.fill(this.adms, "El");
    this.frmAdm.markAllAsTouched();
    this.updateData();
  }

  deleteAdm(admIndex: number) {
    const message = "Are you sure you want to delete the following Automated Decision-Making?<br><br><b>" + this.getBoxText(admIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Automated Decision-Making\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "290px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteAdm(admIndex);
      }
    });
  }

  actuallyDeleteAdm(admIndex: number) {
    this.adms.removeAt(admIndex);
    this.admList.splice(admIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.admIndex !== admIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].admIndex > admIndex) {
        this.descriptions[i].admIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.admIndex !== admIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].admIndex > admIndex) {
        this.headers[i].admIndex -= 1; 
      }
    }
    this.updateData();
    const length = this.adms.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.admList.length == 0) {
      this.addAdm();
    }
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.adms.value.length; i++) {
      if (this.adms.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.adms.value[i].name)) {
        return false;
      }

      if (!this.isHeaderReady(i)) {
        return false;
      }

      if (!this.isDescriptionReady(i)) {
        return false;
      }
    }
    return true;
  }

  isADMComplete(i: number): boolean {    
    return this.admList[i].isComplete();
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.adms.value.length; i++) {
      var element = new Array<string>();
      element.push("<b>" + this.getBoxText(i) + ':</b>');

      var name = this.adms.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.adms.value[i].name);
      
      if (name) {
        element.push('- name');
      }

      var head = !this.isHeaderReady(i);
      var desc = !this.isDescriptionReady(i);

      if(head || desc) {
        element.push("<i>UI-Representation:</i>");
      }
  
      if(head) {
        element.push("- titles");
      }
  
      if(desc) {
        element.push("- descriptions");
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  updateData() {
    this.admList = [];
    for (var i = 0; i < this.adms.controls.length; i++) {
      var pData = new AutomatedDecisionMaking();
      Object.assign(pData,this.adms.controls[i].value);
      
      if (this.descriptions.find(d => d.admIndex == i)) { 
        pData.desc = this.descriptions.find(d => d.admIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.admIndex == i)) {    
        pData.head = this.headers.find(h => h.admIndex == i)?.headerList ?? new Array<Header>();   
      }
      this.admList.push(pData);
    }
    this.isEdited();
  }

  save(): void {
    var res = this.admList;
    if (res.length == 0 || res.every((a: AutomatedDecisionMaking) => {a.isEmpty()})) {
      res = new Array<AutomatedDecisionMaking>();
    }
    this.dialogRef.close({ event: 'close', data: res });
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
    if(this.admList[index]) {
      return this.admList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    if(this.admList[index]) {
      return this.admList[index].head;
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
    var descriptions = this.descriptions.find(d => d.admIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(descriptions.descriptionList[k].value)) {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.adms.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.admIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {     
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == ''
        || !StaticValidatorService.stringNotEmpty(headers.headerList[k].value)) {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.adms.controls[i])) return false;
    return true;
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Automated Decision-making"),
      infoText: textCreator.getText("automatedDecisionMakingList")
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
    const name = this.frmAdm.value.adms.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return (name == ""? "Automated Decision-making " + (i + 1) : name);
    } else return "Automated Decision-making " + (i + 1);
  }
}
