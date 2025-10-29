import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { Safeguard } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { StaticValidatorService } from '../service/static-validator.service';

@Component({
  selector: 'app-safeguard',
  templateUrl: './safeguard.component.html',
  styleUrls: ['./safeguard.component.scss']
})
export class SafeguardComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  @Input() dataRecipientObj!: any;
  @Input() language!: any;
  @Output() newItemEvent = new EventEmitter<Array<Safeguard>>();

  frmSafeguard = this.fb.group({
    safeguards: this.fb.array([])
  });

  sList = new Array<Safeguard>();
  outpuSafeguardList = new Array<Safeguard>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptions: Array<{safeguardIndex: number, descriptionList: Array<Description>}> = [];
  headers: Array<{safeguardIndex: number, headerList: Array<Header>}> = [];

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    if (this.dataRecipientObj.safeguardList.length > 0) {
      this.sList = this.dataRecipientObj.safeguardList;

      for (var i = 0; i < this.sList.length; i++) {
      
        if (this.sList[i].head.length > 0) {
          this.changeHeaderData(i, this.sList[i].head);
        }
  
        if (this.sList[i].desc.length > 0) {
          this.changeDescriptionData(i, this.sList[i].desc);
        }
      }
    }
    if (this.sList.length == 0) {
      this.addSafeguard();
      this.headerIsClicked.push(0);
      this.descriptionIsClicked.push(0);
    } else {
      this.sList.forEach(data => {
        const safeguardForm = this.fb.group({
          name: [data.name, [Validators.required, Validators.pattern(/\S/)]]
        })
        this.safeguards.push(safeguardForm);
      });
    }
    this.fill(this.safeguards, "El");
    this.onChanges();
    this.safeguards.markAllAsTouched;

    this.outpuSafeguardList = new Array<Safeguard>();
    var val = this.safeguards.value;
      for (var i = 0; i < val.length; i++) {
        var safeguard = new Safeguard();
        safeguard.name = val[i].name;
        
        var desc = this.descriptions.find(d => d.safeguardIndex == i); 
        if (desc) {
          safeguard.desc = desc.descriptionList;
        }

        var head = this.headers.find(h => h.safeguardIndex == i); 
        if (head) {
          safeguard.head = head.headerList;
        }

        this.outpuSafeguardList.push(safeguard); 
      }
      this.newItemEvent.emit(this.outpuSafeguardList);
  }

  fill(data: any, label: string) {
    for (var t = 0; t < data.length; t++) {
      var tab = {t: t, show: false};
      this.elv.find(e => e.header == label)?.show.push(tab);
    }
  }

  viewList(tab: any, t: number) {
    let currentTab = this.elv.find(t => t.header == tab)!;
    currentTab.show.find(s => s.t == t)!.show = !currentTab.show.find(s => s.t == t)!.show;
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  onChanges(): void {
    this.safeguards.valueChanges.subscribe(val => {
      this.outpuSafeguardList = new Array<Safeguard>();

      for (var i = 0; i < val.length; i++) {
        var safeguard = new Safeguard();
        safeguard.name = val[i].name;
        
        var desc = this.descriptions.find(d => d.safeguardIndex == i); 
        if (desc) {
          safeguard.desc = desc.descriptionList;
        }

        var head = this.headers.find(h => h.safeguardIndex == i); 
        if (head) {
          safeguard.head = head.headerList;
        }

        this.outpuSafeguardList.push(safeguard); 
      }
      this.newItemEvent.emit(this.outpuSafeguardList);
    });
  }

  changeHeaderData(index: number, header: Array<Header>) {
    var h = this.headers.find(e => e.safeguardIndex == index);
    if (h) {
      this.headers = this.headers.filter(h => h.safeguardIndex !== index);
    }
    var newHeadElement = {
      safeguardIndex: index,
      headerList: header
    }
    this.headers.push(newHeadElement); 
  }

  changeDescriptionData(index: number, description: Array<Description>) {
    var d = this.descriptions.find(e => e.safeguardIndex == index);
    if (d) {
      this.descriptions = this.descriptions.filter(d => d.safeguardIndex !== index);
    }
    var newDescrElement = {
      safeguardIndex: index,
      descriptionList: description
    }
    this.descriptions.push(newDescrElement);
  }

  get safeguards() {
    return this.frmSafeguard.controls["safeguards"] as FormArray;
  }

  addSafeguard() {
    const safeguardForm = this.fb.group({
        name: ["", [Validators.required, Validators.pattern(/\S/)]]
    });
    this.safeguards.push(safeguardForm);
    this.fill(this.safeguards, "El");
  }

  deleteSafeguard(safeguardIndex: number) {
    this.updateData();
    this.safeguards.removeAt(safeguardIndex);
    this.sList.splice(safeguardIndex, 1);
    this.outpuSafeguardList.slice(safeguardIndex, 1);

    this.descriptions = this.descriptions.filter(e => e.safeguardIndex !== safeguardIndex);
    for (var i = 0; i < this.descriptions.length; i++) {
      if (this.descriptions[i].safeguardIndex > safeguardIndex) {
        this.descriptions[i].safeguardIndex -= 1; 
      }
    }

    this.headers = this.headers.filter(e => e.safeguardIndex !== safeguardIndex);
    for (var i = 0; i < this.headers.length; i++) {
      if (this.headers[i].safeguardIndex > safeguardIndex) {
        this.headers[i].safeguardIndex -= 1; 
      }
    }
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.safeguards.value.length; i++) {
      if (this.safeguards.value[i].name == "" || !StaticValidatorService.stringNotEmpty(this.safeguards.value[i].name)) {
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
    this.sList = [];
    for (var i = 0; i < this.safeguards.controls.length; i++) {
      var safeguard: Safeguard = {... new Safeguard(), ...this.safeguards.controls[i].value};
      if (this.descriptions.find(d => d.safeguardIndex == i)) { 
        safeguard.desc = this.descriptions.find(d => d.safeguardIndex == i)?.descriptionList ?? new Array<Description>();    
      }
      if (this.headers.find(h => h.safeguardIndex == i)) {    
        safeguard.head = this.headers.find(h => h.safeguardIndex == i)?.headerList ?? new Array<Header>();   
      }
      this.sList.push(safeguard);
    }
  }

  addDescription(descriptionList: Array<Description>, safeguardIndex: number) {
    this.changeDescriptionData(safeguardIndex, descriptionList);
    this.outpuSafeguardList[safeguardIndex].desc = descriptionList;
    this.newItemEvent.emit(this.outpuSafeguardList);
  }

  addHeader(headerList: Array<Header>, safeguardIndex: number) {
    this.changeHeaderData(safeguardIndex, headerList);
    this.outpuSafeguardList[safeguardIndex].head = headerList;
    this.newItemEvent.emit(this.outpuSafeguardList);
  }

  getDescription(index: number): Array<Description> {
    this.updateData();
    if(this.sList[index]) {
      return this.sList[index].desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(index: number): Array<Header> {
    this.updateData();
    if(this.sList[index]) {
      return this.sList[index].head;
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
    var descriptions = this.descriptions.find(d => d.safeguardIndex == i);
    if (descriptions) {
      for (var k = 0; k < descriptions.descriptionList.length; k++) {
        if (descriptions.descriptionList[k].lang == '' || descriptions.descriptionList[k].value == ''
        || !StaticValidatorService.stringNotEmpty(descriptions.descriptionList[k].value)) {
          return false;
        }
      }
    }
    if (this.descriptions.length == 0 || (!descriptions && this.safeguards.controls[i])) return false;
    return true;
  }

  isHeaderReady(i: number): boolean {
    var headers = this.headers.find(h => h.safeguardIndex == i);
    if (headers) {
      for (var k = 0; k < headers.headerList.length; k++) {     
        if (headers.headerList[k].lang == '' || headers.headerList[k].value == ''
        || !StaticValidatorService.stringNotEmpty(headers.headerList[k].value)) {
          return false;
        }
      }
    }
    if (this.headers.length == 0 || (!headers && this.safeguards.controls[i])) return false;
    return true;
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

  getBoxText(i: number): string {
    const name = this.frmSafeguard.value.safeguards.map((d: { name: any; }) => d.name)[i];
    if (name) {
      return name;
    } else return "Safeguard " + (i + 1);
  }
}