import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityType } from '../enums/entityType';
import { InfoComponent } from '../info/info.component';
import { Entity } from '../model/lpl/entity';
import { DataRecipient, Safeguard } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-recipient-list',
  templateUrl: './data-recipient-list.component.html',
  styleUrls: ['./data-recipient-list.component.scss']
})
export class DataRecipientListComponent implements OnInit {

  frmDataRecipient = this.fb.group({
    dataRecipientList: this.fb.array([])
  });

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  countryList = new Array<any>();

  drList = new Array<DataRecipient>();
  inputList = new Array<DataRecipient>();

  safeguardIsClicked: Array<number> = [];
  safeguards: Array<{index: number, safeguards: Array<Safeguard>}> = [];

  entityIsClicked: Array<number> = [];
  entity: Array<{index: number, entity: Entity}> = [];
  defaultLanguage = '';

  edited = false;

  nextID = 0;

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder, 
      public dialogRef: MatDialogRef<DataRecipientListComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {drList: Array<DataRecipient>, countyCodes: any[], defaultLanguage: string, languageList: any[]}) {

    this.drList = data.drList.map(x => Object.assign(new DataRecipient(), x));
    this.inputList = data.drList.map(x => Object.assign(new DataRecipient(), x));
    this.createEntity(data.drList);
    this.createSafeguards(data.drList);

    if (this.inputList.length == 0) {
      this.inputList.push(new DataRecipient());
    }

    this.countryList = data.countyCodes;

    this.defaultLanguage = data.defaultLanguage;

    if (this.drList.length == 0) {
      this.addDataRecipient();
    } else {
      this.nextID = this.drList[this.drList.length-1].id+1;
      for (var i = 0; i < this.drList.length; i++) {
        const dataRecipientForm = this.fb.group({
          id: [this.drList[i].id],
          required: [this.drList[i].required],
          thirdCountryTransfer: [this.drList[i].thirdCountryTransfer],
          country: [this.drList[i].country],
          adequacyDecision: [this.drList[i].adequacyDecision]
        });
      this.dataRecipientList.push(dataRecipientForm);
      }
    }
    
    this.fill(this.dataRecipientList, "El");
    // this.onChanges();
    this.dataRecipientList.valueChanges.subscribe(_ => {this.updateData()});
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmDataRecipient.markAllAsTouched();
  }

  isEdited() {
    var res = false;
    if (this.drList.length == this.inputList.length) {
      for (let index = 0; index < this.drList.length; index++) {
        res = res || !this.drList[index].isEqual(new DataRecipient(this.inputList[index]));
      }
    } else {
      // if (this.drList.length < this.data.drList.length) {
      //   return true;
      // } else {
      //   for (let index = 0; index < this.drList.length; index++) {
      //     const element = new DataRecipient(this.drList[index]);
      //     if (!element.isEmpty()) {
      //       res = res || !element.isEqual(new DataRecipient(this.data.drList[index]));
      //     }
      //   }
      // }
      res = true;
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

  onChanges(): void {
    // this.frmDataRecipient.valueChanges.subscribe(val => {
    //   for (var i = 0; i < val.dataRecipientList.length; i++) {
    //     if(val.dataRecipientList[i].thirdCountryTransfer === false && val.dataRecipientList[i].country !== '') {

    //       const myForm = (<FormArray>this.frmDataRecipient.get("dataRecipientList")).at(i);
    //       myForm.patchValue({
    //         country: "",
    //         adequacyDecision: false
    //       })
    //     }
    //   }
    // });
  }

  get dataRecipientList() {
    return this.frmDataRecipient.controls["dataRecipientList"] as FormArray;
  }

  addDataRecipient() {
    var dr = new DataRecipient();
    dr.id = this.nextID;
    const dataRecipientForm = this.fb.group({
        id: [dr.id],
        required: [false],
        thirdCountryTransfer: [false],
        country: [""],
        adequacyDecision: [false]
    });
    this.dataRecipientList.push(dataRecipientForm);
    this.fill(this.dataRecipientList, "El");
    this.nextID++;
    this.frmDataRecipient.markAllAsTouched();
    this.updateData();
  }

  fill(data: any, label: string) {
    var toShow = true;
    if (data.length > 1 && this.entityIsFilled(data.length-1)) {
      toShow = false;
    }
    for (var t = 0; t < data.length; t++) {
      var tab = {t: t, show: toShow};
      this.elv.find(e => e.header == label)?.show.push(tab);
      if (this.show('El', t) && t < data.length-1) {
        this.viewList('El', t);
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

  deleteDataRecipient(dataRecipientIndex: number) {
    const message = "Are you sure you want to delete the following Data Recipient?<br><br><b>" + this.getBoxText(dataRecipientIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Data Recipient\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteDataRecipient(dataRecipientIndex);
      }
    });
  }

  actuallyDeleteDataRecipient(dataRecipientIndex: number) {
    this.dataRecipientList.removeAt(dataRecipientIndex);
    this.drList.splice(dataRecipientIndex, 1);
    this.entity = this.entity.filter(e => e.index !== dataRecipientIndex);
    for (var i = 0; i < this.entity.length; i++) {
      if (this.entity[i].index > dataRecipientIndex) {
        this.entity[i].index -= 1; 
      }
    }
    this.safeguards = this.safeguards.filter(e => e.index !== dataRecipientIndex);
    for (var i = 0; i < this.safeguards.length; i++) {
      if (this.safeguards[i].index > dataRecipientIndex) {
        this.safeguards[i].index -= 1; 
      }
    }
    this.updateData();
    const length = this.dataRecipientList.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.drList.length == 0) {
      this.addDataRecipient();
    }
  }

  isDataComplete(): boolean {
    var res = true;
    // if (this.drList.length == 0) return false;
    // for (var i = 0; i < this.drList.length; i++) {
    //   var dr = this.drList[i];
    //   if (!this.entityIsFilled(i)
    //     || this.dataRecipientList.controls.length !== this.entity.length 
    //     || (!this.safeguardIsFilled(i) && dr.safeguardList.length !== 0)
    //     || (dr.thirdCountryTransfer === true && (dr.country === ""
    //     || !this.safeguardIsFilled(i)))) {
    //     res = false;
    //     break;
    //   }
    // }
    this.drList.forEach((dr: DataRecipient) => {
      res = res && dr.isComplete();
    });
    return res;
  }

  isDRComplete(i: number): boolean {
    return this.drList[i].isComplete();
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.drList.length; i++) {
      var element = new Array<string>();
      var dr = this.drList[i];
      element.push('<b>' + this.getBoxText(i) + '</b>:');

      var country = dr.thirdCountryTransfer === true && dr.country === "";
      var sg = (!this.safeguardIsFilled(i) && !this.safeguardIsEmpty(i));

      if(country || sg) {
        element.push("<i>Recipient Information:</i>");
      }

      if (country) {
        element.push('- country is required for third country transfers');
      }

      if (sg) {
        element.push('- safeguard is incomplete');
      }

      var name = !StaticValidatorService.stringNotEmpty(dr.name);
      var classi = dr.classification === '';

      if(name || classi) {
        element.push("<i>Internal Information:</i>");
      }

      if (name) {
        element.push('- unique name');
      }

      if (classi) {
        element.push('- classification (person, legal entity or public authority)');
      }

      var head = !this.checkIfListIsFilled(dr.head,"header");
      var desc = !this.checkIfListIsFilled(dr.desc,"description");

      if(head || desc) {
        element.push("<i>UI-Representation:</i>");
      }

      if (head) {
        element.push('- header list');
      }

      if (desc) {
        element.push('- description list');
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  entityIsFilled(i: number): boolean {
    if (this.entity.filter(e => e.index == i)[0]) {
      var entity = this.entity.filter(e => e.index == i)[0].entity;
      return entity.isComplete();
    }
    return false;
  }

  safeguardIsEmpty(i: number): boolean {
    var safeguardList = this.drList[i].safeguardList;
    if (safeguardList) {
      var res = true;
      for (var j = 0; j < safeguardList.length; j++) {
        res = res && safeguardList[j].isEmpty();
      }
      return res;
    }
    return true;
  }

  safeguardIsFilled(i: number): boolean {
    var safeguardList = this.drList[i].safeguardList;
    if (safeguardList) {
      var res = true;
      if (safeguardList.length > 0) {
        for (var j = 0; j < safeguardList.length; j++) {
          res = res && safeguardList[j].isComplete();
        }
      } else {
        res = false;
      }
      return res || this.safeguardIsEmpty(i);
    }
    return false;
  }

  checkIfListIsFilled(list: Array<any>, label: string): boolean {
      for (var j = 0; j < list.length; j++) {
          if (!list[j].isComplete()){
            return false;
          }
      }
    return true;
  }

  save(): void {
    var ret = this.drList;
    if (this.drList.length == 0 || this.drList.every((dr: DataRecipient) => dr.isEmpty())) {
      ret = new Array<DataRecipient>();
    }
    this.dialogRef.close({ event: 'close', data: ret });
  }

  createEntity(dataRecipients: Array<DataRecipient>) {
    for (var index = 0; index < dataRecipients.length; index++) {
      var e = this.entity.find(e => e.index == index);
      if (e) {
        this.entity.splice(this.entity.indexOf(e), 1);
      }
      var entity = new Entity();
      entity.name = dataRecipients[index].name;
      entity.classification = dataRecipients[index].classification;
      entity.authInfo = dataRecipients[index].authInfo;
      entity.desc = dataRecipients[index].desc;
      entity.head = dataRecipients[index].head;
      var newElement = {
        index,
        entity
      }
      this.entity.push(newElement);
    }
  }

  createSafeguards(dataRecipients: Array<DataRecipient>) {
    for (var index = 0; index < dataRecipients.length; index++) {
      var e = this.safeguards.find(e => e.index == index);
      if (e) {
        this.safeguards.splice(this.safeguards.indexOf(e), 1);
      }
      var safeguards = dataRecipients[index].safeguardList;
      var newElement = {
        index,
        safeguards
      }
      this.safeguards.push(newElement);
    }
  }

  addEntity(entity: Entity, index: number) {
    var e = this.entity.find(e => e.index == index);
    if (e) {
      this.entity.splice(this.entity.indexOf(e), 1);
    }
    var newElement = {
      index,
      entity
    }
    this.entity.push(newElement);
    this.updateData();
  }

  addSafeguard(newItem: Array<Safeguard>, index: number) {
    var e = this.safeguards.find(e => e.index == index);
    if (e) {
      this.safeguards.splice(this.safeguards.indexOf(e), 1);
    }
    var newElement = {
      index: index,
      safeguards: newItem,
    }
    this.safeguards.push(newElement);
    this.updateData();
  }

  updateData() {
    this.drList = new Array<DataRecipient>();
    for (var i = 0; i < this.dataRecipientList.controls.length; i++) {
      var data = new DataRecipient();
      Object.assign(data,this.dataRecipientList.controls[i].value);
      data.country = !data.country? "" : data.country;
      
      if (this.entity.length > 0) {
        if (this.entity.filter(e => e.index == i)[0]) {
          data.authInfo = this.entity.filter(e => e.index == i)[0].entity.authInfo;
          data.classification = this.entity.filter(e => e.index == i)[0].entity.classification;
          data.type = EntityType[EntityType['Data Recipient']];

          data.name = this.entity.filter(e => e.index == i)[0].entity.name;
          data.head = this.entity.filter(e => e.index == i)[0].entity.head;
          data.desc = this.entity.filter(e => e.index == i)[0].entity.desc;
        }
      }
      if (this.safeguards.length > 0) {
        if (this.safeguards.filter(s => s.index == i)[0]) {
          data.safeguardList = this.safeguards.filter(s => s.index == i)[0].safeguards;
        }
      }
      this.drList.push(data);
    }
    this.isEdited();
  }

  getDataRecipients(i: number) {
    // if (this.drList[i]) {
      return this.drList[i];
    // } else {
    //   var dataRecipient = new DataRecipient();
    //   dataRecipient.DESC = new Array<Description>();
    //   dataRecipient.HEAD = new Array<Header>();
    //   return dataRecipient;
    // }
  }

  clickEntity(index: number): void {
    if (this.entityIsClicked.includes(index)) {
      this.entityIsClicked.splice(this.entityIsClicked.indexOf(index), 1)
    } else {
      this.entityIsClicked.push(index);
    }
  }

  clickSafeguard(index: number): void {
    if (this.safeguardIsClicked.includes(index)) {
      this.safeguardIsClicked.splice(this.safeguardIsClicked.indexOf(index), 1)
    } else {
      this.safeguardIsClicked.push(index);
    }
  }

  getThirdCountryTransferValue(index: number) {
    return this.drList[index].thirdCountryTransfer;
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data Recipient(s)"),
      infoText: textCreator.getText("dataRecipientList")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  getSGTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit safeguards";
    } else {
      return "Click to hide safeguards";
    }
  }

  getBoxText(i: number): string {
    const e = this.entity.filter(e => e.index == i)[0];
    if (e) {
      return (e.entity.name == ""? "Data Recipient " + (i + 1) : e.entity.name);
    } else return "Data Recipient " + (i + 1);
  }
}