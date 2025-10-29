import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityType } from '../enums/entityType';
import { InfoComponent } from '../info/info.component';
import { Entity } from '../model/lpl/entity';
import { DataProtectionOfficer} from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { LayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';
import { Data } from '@angular/router';

@Component({
  selector: 'app-data-protection-officer',
  templateUrl: './data-protection-officer.component.html',
  styleUrls: ['./data-protection-officer.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '100px',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
      })),
      transition('open => closed', animate('0.2s')),
      transition('closed => open', animate('0.2s'))
    ])
  ]
})
export class DataProtectionOfficerComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  frmDPOfficer = this.fb.group({
    dPOfficers: this.fb.array([])
  });

  dPOfficerList = new Array<DataProtectionOfficer>();

  entityIsClicked: Array<number> = [];
  entity: Array<{index: number, entity: Entity}> = [];

  edited = false;

  defaultLanguage = '';

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder,
      public dialogRef: MatDialogRef<DataProtectionOfficerComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: LayeredPrivacyPolicy, defaultLanguage: string, languageList: Array<any>}) {
        
    this.defaultLanguage = data.defaultLanguage;

    this.dPOfficerList = data.data.dataProtectionOfficerList;
    this.createEntity(data.data.dataProtectionOfficerList);

    if (this.dPOfficerList.length == 0) {
      this.addDPOfficer();
    } else {
      this.dPOfficerList.forEach(dPOfficer => {
        const dPOfficerForm = this.fb.group({
          firstName: [dPOfficer.firstName, [Validators.required, Validators.pattern(/\S/)]],
          lastName: [dPOfficer.lastName, [Validators.required, Validators.pattern(/\S/)]],
          email: [dPOfficer.email, [Validators.required, Validators.pattern(/(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/)]],
          phoneNumber: [dPOfficer.phoneNumber, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$|^$/)]],
          address: [dPOfficer.address, [Validators.required, Validators.pattern(/\S/)]]
      });
      this.dPOfficers.push(dPOfficerForm);
      });
    }
    this.dPOfficers.valueChanges.subscribe(_ => {this.updateData();});
    this.fill(this.dPOfficers, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmDPOfficer.markAllAsTouched();
  }

  isEdited() {
      var res = false;
      if (this.dPOfficerList.length == this.data.data.dataProtectionOfficerList.length) {
        for (let index = 0; index < this.dPOfficerList.length; index++) {
          res = res || !this.dPOfficerList[index].isEqual(this.data.data.dataProtectionOfficerList[index]);
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

  get dPOfficers() {
    return this.frmDPOfficer.controls["dPOfficers"] as FormArray;
  }

  addDPOfficer() {
    var dpo = new DataProtectionOfficer();
    const dPOfficerForm = this.fb.group({
        firstName: [dpo.firstName, [Validators.required, Validators.pattern(/\S/)]],
        lastName: [dpo.lastName, [Validators.required, Validators.pattern(/\S/)]],
        email: [dpo.email, [Validators.required, Validators.pattern(/(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/)]],
        phoneNumber: [dpo.phoneNumber, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,5}[)]{0,1}[-\s\./0-9]{4,}$|^$/)]],
        address: [dpo.address, [Validators.required, Validators.pattern(/\S/)]]
    });
    this.dPOfficers.push(dPOfficerForm);
    this.dPOfficerList.push(dpo);
    this.fill(this.dPOfficers, "El");
    this.frmDPOfficer.markAllAsTouched();
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

  deleteDPOfficer(dpoIndex: number) {
    const message = "Are you sure you want to delete the following Data Protection Officer?<br><br><b>" + this.getBoxText(dpoIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Data Protection Officer\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "290px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteDPOfficer(dpoIndex);
      }
    });
  }

  actuallyDeleteDPOfficer(dpoIndex: number) {
    this.dPOfficers.removeAt(dpoIndex);
    this.dPOfficerList.splice(dpoIndex, 1);
    this.entity = this.entity.filter(e => e.index !== dpoIndex);
    for (var i = 0; i < this.entity.length; i++) {
      if (this.entity[i].index > dpoIndex) {
        this.entity[i].index -= 1; 
      }
    }
    const length = this.dPOfficers.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.dPOfficerList.length == 0) {
      this.addDPOfficer();
    }
  }

  validateEmail(email: any): boolean {
    return !StaticValidatorService.stringNotEmpty(email) || StaticValidatorService.validateEmail(email);
  }

  validatePhoneNumber(phoneNumber: any): boolean {
    return !StaticValidatorService.stringNotEmpty(phoneNumber) || StaticValidatorService.validatePhoneNumber(phoneNumber);
  }

  isDataComplete(): boolean {
    var complete = true;
    this.dPOfficerList.forEach((d: DataProtectionOfficer) =>{
      complete = complete && d.isComplete();
    });
    return complete;
  }

  isDPOComplete(i: number): boolean {
    return this.dPOfficerList[i].isComplete();
  }

  entityIsFilled(i: number): boolean {
    if (this.entity.filter(e => e.index == i)[0]) {
      var entity = this.entity.filter(e => e.index == i)[0].entity;
      return entity.isComplete();
    }
    return false;
  }

  checkIfListIsFilled(list: Array<any>): boolean {
    var isFilledOut = true;
    for (var j = 0; j < list.length; j++) {      
      if (!list[j].isComplete()){
        isFilledOut = false;
        break;
      }
    }
    return isFilledOut;
  }

  save(): void {
    var res = this.dPOfficerList;
    if (res.length == 0 || res.every((dpo: DataProtectionOfficer) => dpo.isEmpty())) {
      res = new Array<DataProtectionOfficer>();
    }
    this.dialogRef.close({ event: 'close', data: res });
  }

  createEntity(dpos: Array<DataProtectionOfficer>) {
    for (var index = 0; index < dpos.length; index++) {
      var e = this.entity.find(e => e.index == index);
      if (e) {
        this.entity.splice(this.entity.indexOf(e), 1);
      }
      var entity = new Entity();
      entity.name = dpos[index].name;
      entity.classification = dpos[index].classification;
      entity.authInfo = dpos[index].authInfo;
      entity.desc = dpos[index].desc;
      entity.head = dpos[index].head;
      var newElement = {
        index,
        entity
      }
      this.entity.push(newElement);
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

  updateData() {
    this.dPOfficerList = [];
    for (var i = 0; i < this.dPOfficers.controls.length; i++) {
      var dpo = new DataProtectionOfficer();
      Object.assign(dpo, this.dPOfficers.controls[i].value);

      if (this.entity.length > 0) {
        if (this.entity.filter(e => e.index == i)[0]) {
          dpo.name = this.entity.filter(e => e.index == i)[0].entity.name;
          dpo.type = EntityType[EntityType['Data Protection Officer']];

          dpo.classification = this.entity.filter(e => e.index == i)[0].entity.classification;
          dpo.authInfo = this.entity.filter(e => e.index == i)[0].entity.authInfo;
    
          dpo.head = this.entity.filter(e => e.index == i)[0].entity.head;
          dpo.desc = this.entity.filter(e => e.index == i)[0].entity.desc;    

          if (dpo.classification !== 'Person') dpo.lastName = ''; 
        }
      }
      this.dPOfficerList.push(dpo);
    }
    this.isEdited();
  }

  getEntityData(i: number) {
    if (this.dPOfficerList[i]) {
      return this.dPOfficerList[i];
    } else {
      var dpo = new DataProtectionOfficer();
      dpo.desc = new Array<Description>();
      dpo.head = new Array<Header>();
      return dpo;
    }
  }

  clickEntity(index: number): void {
    if (this.entityIsClicked.includes(index)) {
      this.entityIsClicked.splice(this.entityIsClicked.indexOf(index), 1)
    } else {
      this.entityIsClicked.push(index);
    }
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data Protection Officer"),
      infoText: textCreator.getText("dataProtectionOfficer")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  lastNameEnabled(i: number) {
    if (this.entity.filter(e => e.index == i)[0]) {
      if (this.entity.filter(e => e.index == i)[0].entity.classification == "Person") {
        return true;
      } else {
        return false;
      }
    }   
    return false;
  }

  getBoxText(i: number): string {
    const e = this.entity.filter(e => e.index == i)[0];
    if (e) {
      return (e.entity.name == ""? "Data Protection Officer " + (i + 1) : e.entity.name);
    } else return "Data Protection Officer " + (i + 1);
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.dPOfficerList.length; i++) {
      var element = new Array<string>();
      data.push("<b>" + this.getBoxText(i) + ':</b>');

      var firstname = !StaticValidatorService.stringNotEmpty(this.dPOfficerList[i].firstName);
      var lastname = this.dPOfficerList[i].classification == 'Person' && !StaticValidatorService.stringNotEmpty(this.dPOfficerList[i].lastName);
      var mail = !StaticValidatorService.validateEmail(this.dPOfficerList[i].email);
      var phone = !StaticValidatorService.validatePhoneNumber(this.dPOfficerList[i].phoneNumber);
      var address = !StaticValidatorService.stringNotEmpty(this.dPOfficerList[i].address);

      if(firstname || lastname || mail || phone || address) {
        element.push("<i>Controller Information:</i>");
      }

      if (firstname) {
        element.push('- name');
      }
      
      if (lastname) {
        element.push('- last name');
      }

      if (mail) {
        element.push('- email');
      }

      if (phone) {
        element.push('- phone number');
      }

      if (address) {
        element.push('- address');
      }

      var name = !StaticValidatorService.stringNotEmpty(this.dPOfficerList[i].name);
      var classi = this.dPOfficerList[i].classification == '';

      if(name || classi) {
        element.push("<i>Internal Information:</i>");
      }

      if (name) {
        element.push('- unique name');
      }

      if (classi) {
        element.push('- classification (person, legal entity or public authority)');
      }

      var head = this.headerIsFilled(i);
      var desc = this.descriptionIsFilled(i);

      if(!head || !desc) {
        element.push("<i>UI-Representation:</i>");
      }
  
      if(!head) {
        element.push("- titles");
      }
  
      if(!desc) {
        element.push("- descriptions");
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  headerIsFilled(i: number): boolean {
    if (this.dPOfficerList[i].head.length > 0) {
      if (!this.dPOfficerList[i].head.every((h: Header) => {
        return h.isComplete();
      })) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

  descriptionIsFilled(i: number): boolean {
    if (this.dPOfficerList[i].desc.length > 0) {
      if (!this.dPOfficerList[i].desc.every((d: Description) => {
        return d.isComplete();
      })) {
        return false;
      }
    } else {
      return false;
    }
    return true;
  }

}
