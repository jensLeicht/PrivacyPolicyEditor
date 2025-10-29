import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DataType } from '../enums/dataType';
import { PGroup } from '../enums/pGroup';
import { InfoComponent } from '../info/info.component';
import { AnonymizationMethod, AnonymizationMethodAttribute, Data, DataCategory, DataGroup, HierarchyEntity } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { ToastrCreatorService } from '../service/toastr-creator.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-list',
  templateUrl: './data-list.component.html',
  styleUrls: ['./data-list.component.scss']
})
export class DataListComponent implements OnInit {

  frmData = this.fb.group({
    list: this.fb.array([])
  });

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  dataTypeList = [
    {value: DataType[DataType.Boolean], viewValue: "Boolean", tip: "true/false, 1/0"},
    {value: DataType[DataType.Date], viewValue: "Date", tip:"e.g., 2023-06-14"},
    {value: DataType[DataType.Number], viewValue: "Number", tip: "e.g., 4096"},
    {value: DataType[DataType.Text], viewValue: "Text", tip: "e.g., \"some string\""},
    {value: DataType[DataType["Value Set"]], viewValue: "Value Set", tip: "e.g., an enumeration with a fixed set of possible values"},
    {value: DataType[DataType.Other], viewValue: "Other", tip: "anything not covered by the other options"}
  ];

  pGroupList = [
    {value: PGroup[PGroup.EI], viewValue: "explicit", tip: "data that can be directly linked to the data subject"},
    {value: PGroup[PGroup.QID], viewValue: "QID", tip: "data that can be combined with further information to identify the data subject"},
    {value: PGroup[PGroup.SD], viewValue: "sensitive", tip: "sensitive information about the data subject that cannot easily be linked to the data subject"},
    {value: PGroup[PGroup.NSD], viewValue: "non-sensitive", tip: "any non-sensitive information about the data subject that cannot easily be linked to the data subject"}
  ];

  groupIsClicked: Array<number> = [];
 
  selectedDataCategories: Array<{i: number, selected: Array<DataCategory>}> = [];

  dataList = new Array<Data>();
  inputList = new Array<Data>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptions: Array<{dataIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{dataIndex: number, headerList: Array<Header>}> = [];

  dataCategoryIsClicked: Array<number> = [];
  dataCategories: Array<{index: number, groups: Array<DataCategory>}> = [];

  selectedDataGroups: Array<{i: number, selected: Array<DataGroup>}> = [];
  dataGroupIsClicked: Array<number> = [];
  groupsList = new Array<DataGroup>();
  inputGroups = new Array<DataGroup>();

  amIsClicked: Array<number> = [];
  am: Array<{index: number, am: AnonymizationMethod}> = [];

  defaultLanguage = '';

  nextID = 0;

  edited = false;

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      private toastrCreator: ToastrCreatorService,
      public dialogRef: MatDialogRef<DataListComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {dataList: Array<Data>, groupsList: Array<DataGroup>, defaultLanguage: string, languageList: Array<any>}) {

      this.dataList = data.dataList.map(x => Object.assign(new Data(), x));
      this.inputList = data.dataList.map(x => Object.assign(new Data(), x));

      if (this.inputList.length == 0) {
        this.inputList.push(new Data());
      }

      this.defaultLanguage = data.defaultLanguage;
      
      this.groupsList = this.makeDeepCopy(data.groupsList);
      this.inputGroups = this.makeDeepCopy(data.groupsList);

      for (var i = 0; i < data.dataList.length; i++) {
        var selected = new Array<DataCategory>();
        data.dataList[i].dataCategoryList.forEach((dc: DataCategory | undefined) => selected.push(new DataCategory(dc)));
        this.selectedDataCategories.push({i: i, selected: selected});

        var selectedGroup = new Array<DataGroup>();
        data.dataList[i].dataGroupList.forEach((dg: DataGroup | undefined) => selectedGroup.push(new DataGroup(dg)));
        this.selectedDataGroups.push({i: i, selected: selectedGroup});
      } 

    this.createAm(data.dataList);

    for (var i = 0; i < this.dataList.length; i++) {
      
      if (this.dataList[i].head.length > 0) {
        this.changeHeaderData(i, this.dataList[i].head);
      }

      if (this.dataList[i].desc.length > 0) {
        this.changeDescriptionData(i, this.dataList[i].desc);
      }
    }

    if (this.dataList.length == 0) {
      this.addData();
    } else {
      this.nextID = this.dataList[this.dataList.length-1].id+1;
      for (var i = 0; i < this.dataList.length; i++) {
        const dataForm = this.fb.group({
          id: [this.dataList[i].id],
          name: [this.dataList[i].name, [Validators.required, Validators.pattern(/\S/)]],
          required: [this.dataList[i].required],
          dataType: [this.dataList[i].dataType, Validators.required],
          privacyGroup: [this.dataList[i].privacyGroup, Validators.required],
        })
      this.list.push(dataForm);
      }
    }
    this.list.valueChanges.subscribe(_ => {this.updateData();});
    this.fill(this.list, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmData.markAllAsTouched();
  }

  makeDeepCopy(source: Array<DataGroup>): Array<DataGroup> {
    return source.map(x => Object.assign(new DataGroup(), x));
  }

  isEdited() {
    var res = false;
    if (this.dataList.length == this.inputList.length) {
      for (let index = 0; index < this.dataList.length; index++) {
        res = res || !this.dataList[index].isEqual(this.inputList[index]);
      }
    } else {
      this.edited = true;
      return;
    }
    if (this.groupsList.length == this.inputGroups.length) {
      for (let index = 0; index < this.groupsList.length; index++) {
        res = res || !this.groupsList[index].isEqual(this.inputGroups[index]);
      }
    } else {
      this.edited = true;
      return;
    }
    this.edited = res;
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
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.dataIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.dataIndex !== index);
    }
    var newHeadElement = {
      dataIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.dataIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.dataIndex !== index);
    }
    var newDescrElement = {
      dataIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
  }

  get list() {
    return this.frmData.controls["list"] as FormArray;
  }

  addData() {
    var dat = new Data();
    dat.id = this.nextID;
    const dataForm = this.fb.group({
        id: [dat.id],
        name: [dat.name, [Validators.required, Validators.pattern(/\S/)]],
        required: [dat.required],
        dataType: [dat.dataType, Validators.required],
        privacyGroup: [dat.privacyGroup, Validators.required]
    });
    this.list.push(dataForm);
    // this.dataList.push(dat);
    this.fill(this.list, "El");
    this.nextID++;
    this.frmData.markAllAsTouched();
    this.updateData();
  }

  deleteData(dataIndex: number) {
    const message = "Are you sure you want to delete the following Data element?<br><br><b>" + this.getBoxText(dataIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Data\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteData(dataIndex);
      }
    });
  }

  actuallyDeleteData(dataIndex: number) {
    this.list.removeAt(dataIndex);
    this.dataList.splice(dataIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.dataIndex !== dataIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].dataIndex > dataIndex) {
        this.descriptions[i].dataIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.dataIndex !== dataIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].dataIndex > dataIndex) {
        this.headers[i].dataIndex -= 1; 
      }
    }

    // this.dataCategories = this.dataCategories.filter(e => e.index !== dataIndex);
    // for (var i = 0; i < this.dataCategories.length; i++) {
    //   if (this.dataCategories[i].index > dataIndex) {
    //     this.dataCategories[i].index -= 1; 
    //   }
    // }

    this.selectedDataGroups = this.selectedDataGroups.filter(e => e.i !== dataIndex);
    this.selectedDataCategories = this.selectedDataCategories.filter(e => e.i !== dataIndex);
    this.dataGroupIsClicked = this.dataGroupIsClicked.filter(e => e !== dataIndex);

    this.am = this.am.filter(e => e.index !== dataIndex);
    for (var i = 0; i < this.am.length; i++) {
      if (this.am[i].index > dataIndex) {
        this.am[i].index -= 1; 
      }
    }
    this.updateData();
    const length = this.list.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.dataList.length == 0) {
      this.addData();
    }
  }

  isDataComplete(): boolean {
    var res = true;
    for (let index = 0; index < this.dataList.length; index++) {
      res = res && this.dataList[index].isComplete();
    }
    return res;
  }

  isDataElemComplete(i: number): boolean {
    return this.dataList[i].isComplete();
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.dataList.length; i++) {
      var element = new Array<string>();
      element.push('<b>' + this.getBoxText(i) + ':</b>');

      var name = !StaticValidatorService.stringNotEmpty(this.dataList[i].name);
      var dc = !this.categoryIsFilled(i);
      var dt = this.dataList[i].dataType == '';
      var ds = this.dataList[i].privacyGroup == '';
      var am = !this.amValid(i);

      if(name || dc || dt || ds || am) {
        element.push("<i>Basic Information:</i>");
      }

      if (name) {
          element.push('- name');
      }

      if (dc) {
        element.push('- data categories (at least one must be selected)');
      }

      if (dt) {
        element.push('- data type');
      }

      if (ds) {
        element.push('- data sensitivity');
      }
      
      if (am) {
        element.push('- anonymization method');
      }

      var head = this.isHeaderReady(i);
      var desc = this.isDescriptionReady(i);
      var dg = this.dataGroupIsFilled(i);

      if(!head || !desc || !dg) {
        element.push("<i>UI-Representation:</i>");
      }
      
      if (!head) {
        element.push('- titles');
      }
      if (!desc) {
        element.push('- descriptions');
      }

      if (!dg) {
        element.push('- data groups');
      }
      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  dataCategoryIsFilled(i: number): boolean {
    var res = true;
    if (this.selectedDataCategories.find(g => g.i === i)?.selected.length === 0) res = false;
    return res;
  }

/*   dataGroupIsFilled(i: number): boolean {
    if (this.selectedDataGroups.length === 0) return false;
    var res = true;
    if (this.selectedDataGroups.find(g => g.i === i)?.selected.length === 0) res = false;
    return res;
  } */

  amValid(i: number): boolean {
    if (this.am.filter(e => e.index == i)[0]) {
      var am = this.am.filter(e => e.index == i)[0].am;

      if ((am.name === undefined || am.name === "") &&
        (am.desc.length === undefined || am.desc.length === 0) &&
        (am.head.length === undefined || am.head.length === 0) &&
        (am.hierarchyEntityList.length === undefined || am.hierarchyEntityList.length === 0) &&
        (am.anonymizationMethodAttributeList.length === undefined || am.anonymizationMethodAttributeList.length === 0)) {
          return true;
      } else {
        return this.amIsFilled(i);
      }
    }
    return true;
  }

  checkHierarchyEntityListIsValid(hierarchyEntityList: Array<HierarchyEntity>): boolean {
    var res = true;
    if (hierarchyEntityList.length == 0) return false;
    for (var i = 0; i < hierarchyEntityList.length; i++) {
      if (!StaticValidatorService.stringNotEmpty(hierarchyEntityList[i].value)) {
        res = false;
        break;
      }
    }
    return res;
  }

  checkAttributeIsValid(attributeList: Array<AnonymizationMethodAttribute>): boolean {
    var res = true;
    if (attributeList.length == 0) return false;
    for (var i = 0; i < attributeList.length; i++) {
      if (!StaticValidatorService.stringNotEmpty(attributeList[i].key) ||
        !StaticValidatorService.stringNotEmpty(attributeList[i].value)) {
        res = false;
        break;
      }
    }
    return res;
  }

  amIsEmpty(i: number): boolean {
    if (this.am.filter(e => e.index == i)[0]) {
      var am = new AnonymizationMethod(this.am.filter(e => e.index == i)[0].am);
      return am.isEmpty();
    }
    return true;
  }

  amIsFilled(i: number): boolean {
    var res = true;
    if (this.am.filter(e => e.index == i)[0]) {
      var am = new AnonymizationMethod(this.am.filter(e => e.index == i)[0].am);
      res = res && (am.isComplete() || am.isEmpty());
    }
    return res;
  }

  checkHierarchyEntityListIsFilled(hierarchyEntityList: Array<HierarchyEntity>): boolean {
    var res = true;
    if (hierarchyEntityList.length == 0) return false;
    for (var i = 0; i < hierarchyEntityList.length; i++) {
      if (hierarchyEntityList[i].value == '' || !StaticValidatorService.stringNotEmpty(hierarchyEntityList[i].value)) {
        res = false;
        break;
      }
    }
    return res;
  }

  checkAttributeIsFilled(attributeList: Array<AnonymizationMethodAttribute>): boolean {
    var res = true;
    if (attributeList.length == 0) return false;
    for (var i = 0; i < attributeList.length; i++) {
      if (attributeList[i].key == '' ||
        attributeList[i].value == '' ||
        !StaticValidatorService.stringNotEmpty(attributeList[i].key) ||
        !StaticValidatorService.stringNotEmpty(attributeList[i].value)) {
        res = false;
        break;
      }
    }
    return res;
  }

  checkIfListIsFilled(list: Array<any>, label: string): boolean {
    if (list.length === 0) return false;
    var res = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].lang == '' || list[i].value == '' || !StaticValidatorService.stringNotEmpty(list[i].value)) {
        return false;
      }
    }
    return res;
  }

  updateData() {
    this.dataList = new Array<Data>();
    for (var i = 0; i < this.list.controls.length; i++) {
      var dData = new Data();
      Object.assign(dData,this.list.controls[i].value);

      var dataCategoryList = this.selectedDataCategories.find(g => g.i === i)?.selected;
      if (!dataCategoryList) dataCategoryList = new Array<DataCategory>();
      dData.dataCategoryList = dataCategoryList;

      var dataGroups = this.selectedDataGroups.find(g => g.i == i)?.selected;
      if (!dataGroups) dataGroups = new Array<DataGroup>();
      dData.dataGroupList = this.makeDeepCopy(dataGroups);

      if (this.descriptions.find(d => d.dataIndex == i)) { 
        dData.desc = this.descriptions.find(d => d.dataIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.dataIndex == i)) {    
        dData.head = this.headers.find(h => h.dataIndex == i)?.headerList ?? new Array<Header>();   
      }

      if (this.am.length > 0) {
        if (this.am.filter(s => s.index == i)[0]) {
          dData.anonymizationMethod = this.am.filter(s => s.index == i)[0].am;
        }
      }
      this.dataList.push(dData);
    }
    this.isEdited();
  }

  save(): void {
    var data = this.dataList;
    if(data.length == 0 || data.every((d: Data) => d.isEmpty())) {
      data = new Array<Data>();
    }
    var res = {dataList: data, groupsList: this.groupsList};
    var names = res.dataList.map(d => d.name);
    let duplicates = this.checkForDuplicates(names);
    if (duplicates) {
      this.toastrCreator.showErrorMessage('Multiple data with the same name are not allowed', 'Saving is not possible');
    } else {
      this.groupsList = new Array<DataGroup>();
      this.selectedDataGroups = [];
      this.dialogRef.close({ event: 'close', data: res });
    }
  }

  checkForDuplicates(array: Array<string>): boolean {
    return new Set(array).size !== array.length
  }

  addDescription(descriptionList: Array<Description>, dataIndex: number) {
    this.changeDescriptionData(dataIndex, descriptionList);
    this.updateData();
  }

  addHeader(headerList: Array<Header>, dataIndex: number) {
    this.changeHeaderData(dataIndex, headerList);
    this.updateData();
  }

  getDescription(index: number): Array<Description> {
    if(this.dataList[index]) {
      return this.dataList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    if(this.dataList[index]) {
      return this.dataList[index].head;
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
    var descriptions = this.descriptions.find(d => d.dataIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(descriptions.descriptionList[k].value)) {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.list.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.dataIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {   
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == ''
          || !StaticValidatorService.stringNotEmpty(headers.headerList[k].value)) {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.list.controls[i])) return false;
    return true;
  }

  createDataCategories(data: Array<Data>) {
    for (var index = 0; index < data.length; index++) {
      var e = this.dataCategories.find(e => e.index == index);
      if (e) {
        this.dataCategories.splice(this.dataCategories.indexOf(e), 1);
      }
      var groups = data[index].dataCategoryList;
      var newElement = {
        index,
        groups
      }
      this.dataCategories.push(newElement);
    }
  }

  createAm(data: Array<Data>) {
    for (var index = 0; index < data.length; index++) {
      var e = this.am.find(e => e.index == index);
      if (e) {
        this.am.splice(this.am.indexOf(e), 1);
      }
      var am = new AnonymizationMethod(data[index].anonymizationMethod);
      var newElement = {
        index,
        am
      }
      this.am.push(newElement);
    }
  }

  addAm(newItem: AnonymizationMethod, index: number) {
    var e = this.am.find(e => e.index == index);
    if (e) {
      this.am.splice(this.am.indexOf(e), 1);
    }
    var newElement = {
      index: index,
      am: new AnonymizationMethod(newItem),
    }
    this.am.push(newElement);
    this.updateData();
  }

  getDataObj(i: number) {
    if (this.dataList[i]) {
      return this.dataList[i];
    } else {
      var data = new Data();
      data.desc = new Array<Description>();
      data.head = new Array<Header>();
      return data;
    }
  }

  clickDataCategories(index: number): void {
    if (this.dataCategoryIsClicked.includes(index)) {
      this.dataCategoryIsClicked.splice(this.dataCategoryIsClicked.indexOf(index), 1)
    } else {
      this.dataCategoryIsClicked.push(index);
    }
  }

  clickDataGroup(index: number): void {
    if (this.dataGroupIsClicked.includes(index)) {
      this.dataGroupIsClicked.splice(this.dataGroupIsClicked.indexOf(index), 1)
    } else {
      this.dataGroupIsClicked.push(index);
    }
  }

  clickAm(index: number): void {
    if (this.amIsClicked.includes(index)) {
      this.amIsClicked.splice(this.amIsClicked.indexOf(index), 1)
    } else {
      this.amIsClicked.push(index);
    }
  }

  addDataCategories(event: any, i: number) {
    var e = this.selectedDataCategories.find(e => e.i === i);
    if (e) {
      this.selectedDataCategories.splice(this.selectedDataCategories.indexOf(e), 1);
    }
    var newElement = {
      i: i,
      selected: event
    }
    this.selectedDataCategories.push(newElement);
    this.updateData();
  }

  addDataGroups(event: any, i: number) {  
    this.groupsList = event.allData;
    this.updateData();
  }

  toggleDataGroup(event: any, i: number) {
    var e = this.selectedDataGroups.find(e => e.i === i);
    if (e) {
      this.selectedDataGroups.splice(this.selectedDataGroups.indexOf(e), 1);
    }
    var newElement = {
      i: i,
      selected: event.selectedData
    }
    this.selectedDataGroups.push(newElement);        
    this.groupsList = event.allData;
    this.updateData();
  }

  getDataCategories(i: number) {
    if (this.dataList[i]) {
      return this.dataList[i].dataCategoryList;
    } else {
      return new Array<DataCategory>();
    }  
  }

  getDataGroups(i: number) {
    return {allGroups: this.groupsList, selectedGroups: this.makeDeepCopy(this.dataList[i].dataGroupList)};
  }

  clickCategory(index: number): void {
    if (this.groupIsClicked.includes(index)) {
      this.groupIsClicked.splice(this.groupIsClicked.indexOf(index), 1)
    } else {
      this.groupIsClicked.push(index);
    }
  }

  categoryIsFilled(i: number): boolean {
    var valid = false;
    if (this.selectedDataCategories.find(g => g.i === i)) {
      var list = this.selectedDataCategories.find(g => g.i === i)?.selected;
      if (list)
      valid = list.length > 0;
    }
    return valid;
  }

  dataGroupIsFilled(i: number): boolean {
    var valid = true;
    if (this.selectedDataGroups.find(g => g.i === i)) {
      for (var j = 0; j < this.selectedDataGroups.find(g => g.i === i)!.selected.length; j++) {
        var gr = new DataGroup(this.selectedDataGroups.find(g => g.i === i)!.selected[j]);
        valid = valid && (gr.isComplete() || gr.isEmpty());
      }
    }
    return valid;
  }

  dataGroupIsSelected(i: number): boolean {
    return this.selectedDataGroups.find(g => g.i === i) !== undefined;
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data"),
      infoText: textCreator.getText("dataList")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  getAmInfo(event: { stopPropagation: () => void; }) {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Anonymization Method"),
      infoText: textCreator.getText("anonymizationMethod")
    }
    event.stopPropagation();
    this.matDialog.open(InfoComponent, {data: data});
  }

  getDGInfo(event: { stopPropagation: () => void; }) {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data Groups"),
      infoText: textCreator.getText("dataGroups")
    }
    event.stopPropagation();
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

  getDataCategorieTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit data categories";
    } else {
      return "Click to hide data categories";
    }
  }

  getDataGroupsTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit data groups";
    } else {
      return "Click to hide data groups";
    }
  }

  getAMTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit anonymization method";
    } else {
      return "Click to hide anonymization method";
    }
  }

  getBoxText(i: number): string {
    const name = this.frmData.value.list.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return (name == ""? "Data " + (i + 1) : name);;
    } else return "Data " + (i + 1);
  }

}