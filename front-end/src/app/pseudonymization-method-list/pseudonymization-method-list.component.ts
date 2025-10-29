import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { Data, NameOfData, PseudonymizationMethod, PseudonymizationMethodAttribute, Purpose } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pseudonymization-method-list',
  templateUrl: './pseudonymization-method-list.component.html',
  styleUrls: ['./pseudonymization-method-list.component.scss']
})
export class PseudonymizationMethodListComponent implements OnInit {

  frmPm = this.fb.group({
    pms: this.fb.array([])
  });

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  pmList = new Array<PseudonymizationMethod>();
  inputList = new Array<PseudonymizationMethod>();
  
  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];
  attributeIsClicked: Array<number> = [];
  nameOfDataIsClicked: Array<number> = [];

  descriptions: Array<{lbIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{lbIndex: number, headerList: Array<Header>}> = [];
  attribute: Array<{lbIndex: number, attribute: Array<PseudonymizationMethodAttribute>}> = [];
  nameOfData: Array<{lbIndex: number, nameOfData: Array<NameOfData>}> = [];

  dataList = new Array<Data>();

  defaultLanguage = '';
  name = "";
  edited = false;

  constructor (public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      public dialogRef: MatDialogRef<PseudonymizationMethodListComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: Purpose, defaultLanguage:  string, languageList: any[], name: string}) {
        
    this.pmList = data.data.pseudonymizationMethodList.map(x => Object.assign(new PseudonymizationMethod(), x));
    this.inputList = data.data.pseudonymizationMethodList.map(x => Object.assign(new PseudonymizationMethod(), x));

    if (this.inputList.length == 0) {
      this.inputList.push(new PseudonymizationMethod());
    }

    this.dataList = data.data.dataList.map(x => Object.assign(new Data(), x));

    this.defaultLanguage = data.defaultLanguage;
    this.name = data.name;

    for (var i = 0; i < this.pmList.length; i++) {
      
      if (this.pmList[i].head.length > 0) {
        this.changeHeaderData(i, this.pmList[i].head);
      }

      if (this.pmList[i].desc.length > 0) {
        this.changeDescriptionData(i, this.pmList[i].desc);
      }

      if (this.pmList[i].pseudonymizationMethodAttributeList.length > 0) {
        this.changeAttribute(i, this.pmList[i].pseudonymizationMethodAttributeList);
      }

      if (this.pmList[i].nameOfDataList.length > 0) {
        this.changeNameOfData(i, this.pmList[i].nameOfDataList);
      }
    }

    if (this.pmList.length == 0) {
      this.addPm();
    } else {
      this.pmList.forEach(data => {
        const pmForm = this.fb.group({
          name: [data.name, Validators.required],
          attrName: [data.attrName, Validators.required]
        })
      this.pms.push(pmForm);
      });
    }
    this.pms.valueChanges.subscribe(_ => {this.updateData()});
    this.fill(this.pms, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmPm.markAllAsTouched();
  }

  isEdited() {
    var res = false;
    if (this.pmList.length == this.inputList.length) {
      for (let index = 0; index < this.pmList.length; index++) {
        res = res || !this.pmList[index].isEqual(this.inputList[index]);
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
        // this.attributeIsClicked.push(t);
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

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.lbIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.lbIndex !== index);
    }
    var newHeadElement = {
      lbIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.lbIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.lbIndex !== index);
    }
    var newDescrElement = {
      lbIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
  }

  changeAttribute(index: number, attribute: Array<PseudonymizationMethodAttribute>) {
    var d = this.attribute.find(e => e.lbIndex == index);
    if (d) {
      this.attribute = this.attribute.filter(d => d.lbIndex !== index);
    }
    var newElement = {
      lbIndex: index,
      attribute: attribute
    }
    this.attribute.push(newElement);
  }

  changeNameOfData(index: number, nameOfData: Array<NameOfData>) {
    var d = this.nameOfData.find(e => e.lbIndex == index);
    if (d) {
      this.nameOfData = this.nameOfData.filter(d => d.lbIndex !== index);
    }
    var newElement = {
      lbIndex: index,
      nameOfData: nameOfData
    }
    this.nameOfData.push(newElement);
  }

  get pms() {
    return this.frmPm.controls["pms"] as FormArray;
  }

  addPm() {
    const pmForm = this.fb.group({
        name: ["", Validators.required],
        attrName: ["", Validators.required]
    });
    this.pms.push(pmForm);
    this.fill(this.pms, "El");
    this.frmPm.markAllAsTouched();
    this.updateData();
  }

  deletePm(pmIndex: number) {
    const message = "Are you sure you want to delete the following Pseudonymization Method?<br><br><b>" + this.getBoxText(pmIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Pseudonymization Method\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "290px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeletePm(pmIndex);
      }
    });
  }

  actuallyDeletePm (pmIndex: number) {
    this.pms.removeAt(pmIndex);
    this.pmList.splice(pmIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.lbIndex !== pmIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].lbIndex > pmIndex) {
        this.descriptions[i].lbIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.lbIndex !== pmIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].lbIndex > pmIndex) {
        this.headers[i].lbIndex -= 1; 
      }
    }

    this.attribute = this.attribute.filter(e => e.lbIndex !== pmIndex);
    for (var i = 0; i < this.attribute.length; i++) {
      if (this.attribute[i].lbIndex > pmIndex) {
        this.attribute[i].lbIndex -= 1; 
      }
    }

    this.nameOfData = this.nameOfData.filter(e => e.lbIndex !== pmIndex);
    for (var i = 0; i < this.nameOfData.length; i++) {
      if (this.nameOfData[i].lbIndex > pmIndex) {
        this.nameOfData[i].lbIndex -= 1; 
      }
    }
    this.updateData();
    const length = this.pms.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.pmList.length == 0) {
      this.addPm();
    }
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.pms.value.length; i++) {
      if (this.pms.value[i].name == "" || this.pms.value[i].attrName == ""
        || !StaticValidatorService.stringNotEmpty(this.pms.value[i].name)
        || !StaticValidatorService.stringNotEmpty(this.pms.value[i].attrName)) {
        return false;
      } 

      if (!this.isHeaderReady(i)) {
        return false;
      }

      if (!this.isDescriptionReady(i)) {
        return false;
      }

      if (!this.isAttributeReady(i)) {
        return false;
      }

      if (!this.isNameOfDataReady(i)) {
        return false;
      }
    }
    return true;
  }

  isPMComplete(i: number): boolean {
    return this.pmList[i].isComplete();
  }

  getSupport() {
    var data = new Array<string>();
    this.updateData();
    
    for (var i = 0; i < this.pms.value.length; i++) {
      var element = new Array<string>();
      element.push("<b>" + this.getBoxText(i) + ':</b>');

      var name = this.pms.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.pms.value[i].name);
      var res = this.pms.value[i].attrName == "" || !StaticValidatorService.stringNotEmpty(this.pms.value[i].attrName);
      var dat = !this.isNameOfDataReady(i);
      var attr = !this.isAttributeReady(i);

      if(name || res || dat || attr) {
        element.push("<i>Pseudonymization Information:</i>");
      }
      
      if (name) {
          element.push('- name');
      } 

      if (res) {
          element.push('- resulting attribute');
      } 

      if (dat) {
        element.push('- at least one data element should be selected');
      }

      if (attr) {
        element.push('- pseudonymization method attribute');
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
    this.pmList = [];
    for (var i = 0; i < this.pms.controls.length; i++) {
      var pData = new PseudonymizationMethod();
      Object.assign(pData,this.pms.controls[i].value);
      
      if (this.descriptions.find(d => d.lbIndex == i)) { 
        pData.desc = this.descriptions.find(d => d.lbIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.lbIndex == i)) {    
        pData.head = this.headers.find(h => h.lbIndex == i)?.headerList ?? new Array<Header>();   
      }
      if (this.attribute.find(h => h.lbIndex == i)) {    
        pData.pseudonymizationMethodAttributeList = this.attribute.find(h => h.lbIndex == i)?.attribute ?? new Array<PseudonymizationMethodAttribute>();   
      }
      if (this.nameOfData.find(h => h.lbIndex == i)) {
        pData.nameOfDataList = this.nameOfData.find(h => h.lbIndex == i)?.nameOfData ?? new Array<NameOfData>();   
      }
      this.pmList.push(pData);
    }
    this.isEdited();
  }

  save(): void {
    var res = this.pmList;
    if (res.length == 0 || res.every((p: PseudonymizationMethod) => {p.isEmpty()})) {
      res = new Array<PseudonymizationMethod>();
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

  addAttribute(attribute: Array<PseudonymizationMethodAttribute>, purposeIndex: number) {
    this.changeAttribute(purposeIndex, attribute);
    this.updateData();
  }

  addNameOfData(nameOfData: Array<NameOfData>, purposeIndex: number) {
    this.changeNameOfData(purposeIndex, nameOfData);
    this.updateData();
  }

  getDescription(index: number): Array<Description> {
    if(this.pmList[index]) {
      return this.pmList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    if(this.pmList[index]) {
      return this.pmList[index].head;
    } else {
      return new Array<Header>();
    }
  }

  getAttribute(index: number): Array<PseudonymizationMethodAttribute> {
    if(this.pmList[index]) {
      return this.pmList[index].pseudonymizationMethodAttributeList;
    } else {
      return new Array<PseudonymizationMethodAttribute>();
    }
  }

  getNameOfData(index: number): any {
    if(this.pmList[index]) {
      var res = {nameOfDataList: this.pmList[index].nameOfDataList, dataList: this.dataList};
      return res;
    } else {
      var res = {nameOfDataList: new Array<NameOfData>(), dataList: this.dataList};
      return res;
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

  clickAttribute(index: number): void {
    if (this.attributeIsClicked.includes(index)) {
      this.attributeIsClicked.splice(this.attributeIsClicked.indexOf(index), 1)
    } else {
      this.attributeIsClicked.push(index);
    }
  }

  clickNameOfData(index: number): void {
    if (this.nameOfDataIsClicked.includes(index)) {
      this.nameOfDataIsClicked.splice(this.nameOfDataIsClicked.indexOf(index), 1)
    } else {
      this.nameOfDataIsClicked.push(index);
    }
  }

  isDescriptionReady(i: number): boolean {
    var descriptions = this.descriptions.find(d => d.lbIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(descriptions.descriptionList[k].value)) {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.pms.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.lbIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {     
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(headers.headerList[k].value)) {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.pms.controls[i])) return false;
    return true;
  }

  isAttributeReady(i: number): boolean {
    var attribute = this.attribute.find(h => h.lbIndex == i);
    var res = true;
    if (attribute) {
      attribute.attribute.forEach(a => {
        res = res && a.isComplete();
      });
    }
    return res || this.isAttributeEmpty(i);
  }

  isAttributeEmpty(i: number): boolean {
    var attribute = this.attribute.find(h => h.lbIndex == i);
    if (attribute) {
      return attribute.attribute.every(a => a.isEmpty());
    }
    return true;
  }

  isNameOfDataReady(i: number): boolean {
    var nameOfData = this.nameOfData.find(h => h.lbIndex == i);
    if (nameOfData) {
      if (nameOfData.nameOfData.length == 0) {
        return false;
      }
      for (var k = 0; k < nameOfData.nameOfData.length; k++) {     
        if (nameOfData.nameOfData[k].name == '') {
          return false;
        }
      }
    }
    if (this.nameOfData.length == 0 || (!nameOfData && this.pms.controls[i])) return false;
    return true;
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Pseudonymization Method(s)"),
      infoText: textCreator.getText("pseudonymizationMethodList")
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

  getNODTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit data list";
    } else {
      return "Click to hide data list";
    }
  }

  getPMATooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit pseudonymization method attribute(s)";
    } else {
      return "Click to hide pseudonymization method attribute(s)";
    }
  }

  getBoxText(i: number): string {
    const name = this.frmPm.value.pms.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return (name == ""? "Pseudonymization Method " + (i + 1) : name);;
    } else return "Pseudonymization Method " + (i + 1);
  }

}
