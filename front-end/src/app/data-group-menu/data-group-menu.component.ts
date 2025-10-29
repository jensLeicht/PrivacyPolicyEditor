import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataGroup } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { ToastrCreatorService } from '../service/toastr-creator.service';
import { StaticValidatorService } from '../service/static-validator.service';

@Component({
  selector: 'app-data-group-menu',
  templateUrl: './data-group-menu.component.html',
  styleUrls: ['./data-group-menu.component.scss']
})
export class DataGroupMenuComponent implements OnInit {

  @Input() inputObj!: any;
  @Input() language!: any;
  @Output() newItemEvent = new EventEmitter<Array<DataGroup>>();
  @Output() toggleItemEvent = new EventEmitter<Array<DataGroup>> ();

  dgData = new Array<DataGroup>();

  selectedData = new Array<DataGroup>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptionIsFilled = Array<number>();
  headerIsFilled = Array<number>();

  groupName = "";

  head = new Array<Header>();
  desc = new Array<Description>();
  action = "";
  isSelected = false;

  constructor(private toastrCreator: ToastrCreatorService) {}

  ngOnInit(): void {
    this.dgData = this.inputObj.allGroups;
    this.selectedData = this.inputObj.selectedGroups;
    
    if(this.dgData) {
      for (var i = 0; i < this.dgData.length; i++) {
        if (this.dgData[i].desc) {
          this.checkIfListIsFilled(this.dgData[i].desc, "description", i);
        }
        if (this.dgData[i].head) {
          this.checkIfListIsFilled(this.dgData[i].head, "header", i);
        }
      }
    }
  }

  checkIfListIsFilled(list: Array<any>, label: string, i: number): void {
    var isFilledOut = list.length != 0 && list.every(elem => StaticValidatorService.stringNotEmpty(elem.lang) && StaticValidatorService.stringNotEmpty(elem.value));
    if (isFilledOut) {
      if (label == "description") {
        this.descriptionIsFilled.push(i);
      } else {
        this.headerIsFilled.push(i);
      }
    } else {
      if (label == "description") {
        if (this.descriptionIsFilled.includes(i)) this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== i)
      } else {
        if (this.headerIsFilled.includes(i)) this.headerIsFilled = this.headerIsFilled.filter(h => h !== i);
      }
    }
  }

  checked(groupName: any): boolean {
    for(var i = 0; i < this.selectedData.length; i++) {
      if (this.selectedData[i].name === groupName) {
        return true;
      }
    }
    return false;
  }

  toggle(event: any, name: any, i: number): void {
    var ic = this.dgData.find(data => data.name == name)!;
    this.checkIfListIsFilled(ic.desc, "description", i);
    this.checkIfListIsFilled(ic.head, "header", i);
    if (event.checked) {
      this.selectedData.push(ic);
      this.toggleItemEvent.emit(this.createGroup());
    } else {
      const removeIndex = this.selectedData.findIndex( item => item.name === name );
      this.selectedData.splice(removeIndex, 1);
      this.toggleItemEvent.emit(this.createGroup());
    }
  }

  addDescription(descriptionList: Array<Description>, icon: any, i: number) {
    this.dgData.filter(data => data.name == icon)[0].desc = descriptionList;
    this.checkIfListIsFilled(descriptionList, "description", i);
    this.newItemEvent.emit(this.createGroup());
  }

  addHeader(headerList: Array<Header>, icon: any, i: number) {
    this.dgData.filter(data => data.name == icon)[0].head = headerList;
    this.checkIfListIsFilled(headerList, "header", i);
    this.newItemEvent.emit(this.createGroup());
  }

  createGroup(): any {
    return {selectedData: this.selectedData, allData: this.dgData};
  }

  getDescription(icon: any): Array<Description> {
    var desc = this.dgData.filter(data => data.name == icon)[0].desc;
    return desc;
  }

  getHeader(icon: any): Array<Header> {
    var head = this.dgData.filter(data => data.name == icon)[0].head;
    return head;
  }

  clickDescription(index: number): void {
    if (this.descriptionIsClicked.includes(index)) {
      this.descriptionIsClicked = this.descriptionIsClicked.filter(d => d !== index);
    } else {
      this.descriptionIsClicked.push(index);
    }
  }

  clickHeader(index: number): void {
    if (this.headerIsClicked.includes(index)) {
      this.headerIsClicked = this.headerIsClicked.filter(h => h !== index);
    } else {
      this.headerIsClicked.push(index);
    }
  }

  addOrUpdateGroup(input: any) {
    var group = new DataGroup();
    group.name = input;
    if (this.action === "edit") {
      this.action = "";
      group.head = this.head;
      group.desc = this.desc;
      if (this.dgData.find(g => g.name === group.name)) {
        this.toastrCreator.showErrorMessage('Data group with the same name already exists', 'DATA GROUP NOT UPDATED');
      } else {
        this.dgData.push(group);
        if (this.isSelected) {
          this.selectedData.push(group);
          this.isSelected = false;
        }
        this.newItemEvent.emit(this.createGroup());
        this.groupName = "";
        this.toastrCreator.showSuccessMessage('Data group updated successfully', 'DATA GROUP UPDATED');
      }

    } else { 
      group.head = new Array<Header>();
      group.desc = new Array<Description>();
      if (this.dgData.find(g => g.name === group.name)) {
        this.toastrCreator.showErrorMessage('Data group with the same name already exists', 'DATA GROUP NOT ADDED');
      } else {
        this.dgData.push(group);
        this.groupName = "";
      }
    }   
    this.newItemEvent.emit(this.createGroup());
  }

  delete(name: string) {
    this.dgData = this.dgData.filter(g => g.name !== name);
    this.selectedData = this.selectedData.filter(g => g.name !== name);
    this.newItemEvent.emit(this.createGroup());
    this.toastrCreator.showSuccessMessage('Data group deleted successfully', 'DATA GROUP DELETED');
  }

  edit(name: string) {
    this.action = "edit";
    this.groupName = name;

    var group = this.dgData.find(g => g.name === name)!;
    this.head = group.head;
    this.desc = group.desc;

    var selected = this.selectedData.find(g => g.name === name);
    
    this.dgData = this.dgData.filter(g => g.name !== name);
    
    if (selected) {
      this.selectedData = this.selectedData.filter(g => g.name !== name);
      this.isSelected = true;
    }
  }

  getHeaderTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit header data";
    } else {
      return "Click to hide header data";
    }
  }

  getDescTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit description data";
    } else {
      return "Click to hide description data";
    }
  }

}
