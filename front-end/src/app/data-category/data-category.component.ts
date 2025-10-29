import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { DataCategory } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';

@Component({
  selector: 'app-data-category',
  templateUrl: './data-category.component.html',
  styleUrls: ['./data-category.component.scss']
})
export class DataCategoryComponent implements OnInit {

  @Input() dataObj!: any;
  @Output() newItemEvent = new EventEmitter<Array<DataCategory>>();

  frmGroup = this.fb.group({
    groups: this.fb.array([])
  });

  groupList = new Array<DataCategory>();
  outpuList = new Array<DataCategory>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptions: Array<{groupIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{groupIndex: number, headerList: Array<Header>}> = [];

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    if (this.dataObj.length > 0) {
      this.groupList = this.dataObj;

      for (var i = 0; i < this.groupList.length; i++) {
      
        if (this.groupList[i].head.length > 0) {
          this.changeHeaderData(i, this.groupList[i].head);
        }
  
        if (this.groupList[i].desc.length > 0) {
          this.changeDescriptionData(i, this.groupList[i].desc);
        }
      }
    }
    if (this.groupList.length == 0) {
      this.addGroup();
    } else {
      this.groupList.forEach(data => {
        const groupForm = this.fb.group({
          name: [data.name, Validators.required]
        })
        this.groups.push(groupForm);
      });
    }
    this.onChanges();
  }

  onChanges(): void {
    this.groups.valueChanges.subscribe(val => {
      this.outpuList = new Array<DataCategory>();

      for (var i = 0; i < val.length; i++) {
        var data = new DataCategory();
        data.name = val[i].name;
        
        var desc = this.descriptions.find(d => d.groupIndex == i); 
        if (desc) {
          data.desc = desc.descriptionList;
        }

        var head = this.headers.find(h => h.groupIndex == i); 
        if (head) {
          data.head = head.headerList;
        }

        this.outpuList.push(data); 
      }
      this.newItemEvent.emit(this.outpuList);
    });
  }

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.groupIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.groupIndex !== index);
    }
    var newHeadElement = {
      groupIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.groupIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.groupIndex !== index);
    }
    var newDescrElement = {
      groupIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
  }

  get groups() {
    return this.frmGroup.controls["groups"] as FormArray;
  }

  addGroup() {
    const purposeForm = this.fb.group({
        name: ["", Validators.required]
    });
    this.groups.push(purposeForm);
  }

  deleteGroup(groupIndex: number) {
    this.updateData();
    this.groups.removeAt(groupIndex);
    this.groupList.splice(groupIndex, 1);
    this.outpuList.slice(groupIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.groupIndex !== groupIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].groupIndex > groupIndex) {
        this.descriptions[i].groupIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.groupIndex !== groupIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].groupIndex > groupIndex) {
        this.headers[i].groupIndex -= 1; 
      }
    }
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.groups.value.length; i++) {
      if (this.groups.value[i].name == "") {
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

  updateData() {
    this.groupList = [];
    for (var i = 0; i < this.groups.controls.length; i++) {
      var pData: DataCategory = {... new DataCategory(), ...this.groups.controls[i].value};
      if (this.descriptions.find(d => d.groupIndex == i)) { 
        pData.desc = this.descriptions.find(d => d.groupIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.groupIndex == i)) {    
        pData.head = this.headers.find(h => h.groupIndex == i)?.headerList ?? new Array<Header>();   
      }
      this.groupList.push(pData);
    }
  }

  addDescription(descriptionList: Array<Description>, index: number) {
    this.changeDescriptionData(index, descriptionList);
    this.outpuList[index].desc = descriptionList;
    this.newItemEvent.emit(this.outpuList);
  }

  addHeader(headerList: Array<Header>, index: number) {
    this.changeHeaderData(index, headerList);
    this.outpuList[index].head = headerList;
    this.newItemEvent.emit(this.outpuList);
  }

  getDescription(index: number): Array<Description> {
    this.updateData();
    if(this.groupList[index]) {
      return this.groupList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    this.updateData();
    if(this.groupList[index]) {
      return this.groupList[index].head;
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
    var descriptions = this.descriptions.find(d => d.groupIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == '') {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.groups.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.groupIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {     
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == '') {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.groups.controls[i])) return false;
    return true;
  }

}
