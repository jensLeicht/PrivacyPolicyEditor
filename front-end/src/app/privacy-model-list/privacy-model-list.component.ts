import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PrivacyModels } from '../enums/privacyModels';
import { InfoComponent } from '../info/info.component';
import { Data, NameOfData, PrivacyModel, PrivacyModelAttribute, Purpose } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-privacy-model-list',
  templateUrl: './privacy-model-list.component.html',
  styleUrls: ['./privacy-model-list.component.scss']
})
export class PrivacyModelListComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  frmModel = this.fb.group({
    models: this.fb.array([])
  });

  modelList = new Array<PrivacyModel>();
  inputList = new Array<PrivacyModel>();

  dataList = new Array<Data>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];
  attributeIsClicked: Array<number> = [];

  descriptions: Array<{lbIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{lbIndex: number, headerList: Array<Header>}> = [];
  attribute: Array<{lbIndex: number, attribute: Array<PrivacyModelAttribute>}> = [];
  nameOfData: Array<{lbIndex: number, nameOfData: Array<NameOfData>}> = [];

  defaultLanguage = '';
  name = "";

  edited = false;

  privacyModels = new Array<String>();

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      public dialogRef: MatDialogRef<PrivacyModelListComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: Purpose, defaultLanguage:  string, languageList: any[], name: string}) {

    this.privacyModels.push(PrivacyModels.kAnonymity, PrivacyModels.lDiversity);    
        
    this.modelList = data.data.privacyModelList.map(x => Object.assign(new PrivacyModel(), x));
    this.inputList = data.data.privacyModelList.map(x => Object.assign(new PrivacyModel(), x));
    
    this.dataList = data.data.dataList.map(x => Object.assign(new Data(), x));;

    if (this.inputList.length == 0) {
      this.inputList.push(new PrivacyModel());
    }

    this.defaultLanguage = data.defaultLanguage;
    this.name = data.name;

    for (var i = 0; i < this.modelList.length; i++) {
      if (!this.privacyModels.includes(this.modelList[i].name)) {
        this.privacyModels.push(this.modelList[i].name);
      }

      if (this.modelList[i].head.length > 0) {
        this.changeHeaderData(i, this.modelList[i].head);
      }

      if (this.modelList[i].desc.length > 0) {
        this.changeDescriptionData(i, this.modelList[i].desc);
      }

      if (this.modelList[i].privacyModelAttributeList.length > 0) {
        this.changeAttribute(i, this.modelList[i].privacyModelAttributeList);
      }

      if (this.modelList[i].nameOfDataList.length > 0) {
        this.changeNameOfData(i, this.modelList[i].nameOfDataList);
      }
    }

    if (this.modelList.length == 0) {
      this.addModel();
    } else {
      this.modelList.forEach(data => {
        const modelForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.pattern(/\S/)]],
          customInput: [""],
        })
      this.models.push(modelForm);
      });
    }
    this.models.valueChanges.subscribe(_ => {this.updateData();});
    this.fill(this.models, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmModel.markAllAsTouched();
  }

  isEdited() {
    var res = false;
    if (this.modelList.length == this.inputList.length) {
      for (let index = 0; index < this.modelList.length; index++) {
        res = res || !this.modelList[index].isEqual(this.inputList[index]);
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

  changeAttribute(index: number, attribute: Array<PrivacyModelAttribute>) {
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

  get models() {
    return this.frmModel.controls["models"] as FormArray;
  }

  addModel() {
    const modelForm = this.fb.group({
        name: ["", [Validators.required, Validators.pattern(/\S/)]],
        customInput: [""]
    });
    this.models.push(modelForm);
    this.fill(this.models, "El");
    this.frmModel.markAllAsTouched();
    this.updateData();
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
  
  deleteModel(modelIndex: number) {
    const message = "Are you sure you want to delete the following Privacy Model?<br><br><b>" + this.getBoxText(modelIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Privacy Model\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteModel(modelIndex);
      }
    });
  }
  
  actuallyDeleteModel(modelIndex: number) {
    this.models.removeAt(modelIndex);
    this.modelList.splice(modelIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.lbIndex !== modelIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].lbIndex > modelIndex) {
        this.descriptions[i].lbIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.lbIndex !== modelIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].lbIndex > modelIndex) {
        this.headers[i].lbIndex -= 1; 
      }
    }

    this.attribute = this.attribute.filter(e => e.lbIndex !== modelIndex);
    for (var i = 0; i < this.attribute.length; i++) {
      if (this.attribute[i].lbIndex > modelIndex) {
        this.attribute[i].lbIndex -= 1; 
      }
    }

    this.nameOfData = this.nameOfData.filter(e => e.lbIndex !== modelIndex);
    for (var i = 0; i < this.nameOfData.length; i++) {
      if (this.nameOfData[i].lbIndex > modelIndex) {
        this.nameOfData[i].lbIndex -= 1; 
      }
    }
    this.updateData();
    const length = this.models.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.modelList.length == 0) {
      this.addModel();
    }
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.models.value.length; i++) {
      if (this.models.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.models.value[i].name)) {
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
    return this.modelList[i].isComplete();
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.models.value.length; i++) {
      var element = new Array<string>();
      element.push('<b>' + this.getBoxText(i) + ':</b>');

      var name = this.models.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.models.value[i].name);
      var nod = !this.isNameOfDataReady(i);
      var attr = !this.isAttributeReady(i);

      if(name || nod || attr) {
        element.push("<i>Model Information:</i>");
      }
      
      if (name) {
        element.push('- name');
      } 

      if (nod) {
        element.push('- at least one datum should be selected');
      }

      if (attr) {
        element.push('- privacy model attributes');
      }

      var head = !this.isHeaderReady(i);
      var desc = !this.isDescriptionReady(i);

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

  updateData() {
    this.modelList = [];
    for (var i = 0; i < this.models.controls.length; i++) {
      var pData = new PrivacyModel();
      Object.assign(pData,this.models.controls[i].value);
      
      if (this.descriptions.find(d => d.lbIndex == i)) { 
        pData.desc = this.descriptions.find(d => d.lbIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.lbIndex == i)) {    
        pData.head = this.headers.find(h => h.lbIndex == i)?.headerList ?? new Array<Header>();   
      }
      if (this.attribute.find(h => h.lbIndex == i)) {    
        pData.privacyModelAttributeList = this.attribute.find(h => h.lbIndex == i)?.attribute ?? new Array<PrivacyModelAttribute>();   
      }
      if (this.nameOfData.find(h => h.lbIndex == i)) {
        pData.nameOfDataList = this.nameOfData.find(h => h.lbIndex == i)?.nameOfData ?? new Array<NameOfData>();   
      }

      this.modelList.push(pData);
    }
    this.isEdited();
  }

  save(): void {
    var res = this.modelList;
    if (this.modelList.length == 0 || this.modelList.every((p: PrivacyModel) => p.isEmpty())) {
      res = new Array<PrivacyModel>();
    }
    this.dialogRef.close({ event: 'close', data: res });
  }

  addNameOfData(nameOfData: Array<NameOfData>, purposeIndex: number) {
    this.changeNameOfData(purposeIndex, nameOfData);
    this.updateData();
  }

  addDescription(descriptionList: Array<Description>, purposeIndex: number) {
    this.changeDescriptionData(purposeIndex, descriptionList);
    this.updateData();
  }

  addHeader(headerList: Array<Header>, purposeIndex: number) {
    this.changeHeaderData(purposeIndex, headerList);
    this.updateData();
  }

  addAttribute(attribute: Array<PrivacyModelAttribute>, purposeIndex: number) {
    this.changeAttribute(purposeIndex, attribute);
    this.updateData();
  }

  getNameOfData(index: number): any {
    if(this.modelList[index]) {
      var res = {nameOfDataList: this.modelList[index].nameOfDataList, dataList: this.dataList};
      return res;
    } else {
      var res = {nameOfDataList: new Array<NameOfData>(), dataList: this.dataList};
      return res;
    }
  }

  getDescription(index: number): Array<Description> {
    if(this.modelList[index]) {
      return this.modelList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    if(this.modelList[index]) {
      return this.modelList[index].head;
    } else {
      return new Array<Header>();
    }
  }

  getAttribute(index: number): Array<PrivacyModelAttribute> {
    if(this.modelList[index]) {
      return this.modelList[index].privacyModelAttributeList;
    } else {
      return new Array<PrivacyModelAttribute>();
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

  isNameOfDataReady(i: number): boolean {
    var nameOfData = this.nameOfData.find(h => h.lbIndex == i);
    if (nameOfData) {
      if (nameOfData.nameOfData.length == 0) {
        return false;
      }
      for (var k = 0; k < nameOfData.nameOfData.length; k++) {     
        if (nameOfData.nameOfData[k].name == '' || !StaticValidatorService.stringNotEmpty(nameOfData.nameOfData[k].name)) {
          return false;
        }
      }
    }
    if (this.nameOfData.length == 0 || (!nameOfData && this.models.controls[i])) return false;
    return true;
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
    if (this.descriptions.length == 0 || (!descriptions && this.models.controls[i])) return false;
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
    if (this.headers.length == 0 || (!headers && this.models.controls[i])) return false;
    return true;
  }

  isAttributeEmpty(i: number): boolean {
    var attribute = this.attribute.find(h => h.lbIndex == i);
    if (attribute) {
      return attribute.attribute.every(a => a.isEmpty());
    }
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

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Privacy Model(s)"),
      infoText: textCreator.getText("privacyModelList")
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

  getNameOfDataTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit data list";
    } else {
      return "Click to hide data list";
    }
  }

  getAttrTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit privacy model attribute(s)";
    } else {
      return "Click to hide privacy model attribute(s)";
    }
  }

  addNewModel(i: number, input: any) {
    const myForm = (<FormArray>this.frmModel.get("models")).at(i);
    myForm.patchValue({
      customInput: ""
    });
    this.privacyModels.push(input);
  }

  getModelName(i: number) {
    return this.models.controls[i].value.name;
  }

  getBoxText(i: number): string {
    const name = this.frmModel.value.models.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return (name == ""? "Privacy Models " + (i + 1) : name);;
    } else return "Privacy Model " + (i + 1);
  }
  
  // onModelChange(event: any, i: number) {
  //   // // this.attribute[i].attribute[0].privacyModelAttribute.key = "Test";
  //   // this.modelList[i].privacyModelAttributeList[0].key = "Testing";
  //   // console.log(event);
  // }

}
