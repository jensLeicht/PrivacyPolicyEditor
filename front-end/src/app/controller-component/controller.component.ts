import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EntityType } from '../enums/entityType';
import { InfoComponent } from '../info/info.component';
import { Entity } from '../model/lpl/entity';
import { Controller } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { LayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';

@Component({
  selector: 'app-controller',
  templateUrl: './controller.component.html',
  styleUrls: ['./controller.component.scss'],
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
export class ControllerComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  frmControllers = this.fb.group({
    controllers: this.fb.array([])
  });

  controllerList = new Array<Controller>();
  inputList = new Array<Controller>();

  entityIsClicked: Array<number> = [];
  entity: Array<{index: number, entity: Entity}> = [];

  edited = false;

  defaultLanguage = '';

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private fb:FormBuilder,
      public dialogRef: MatDialogRef<ControllerComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: {data: LayeredPrivacyPolicy, defaultLanguage: string, languageList: Array<any>}) {
        
    this.defaultLanguage = data.defaultLanguage;
    this.controllerList = data.data.controllerList.map(x => Object.assign(new Controller(), x));
    this.inputList = data.data.controllerList.map(x => Object.assign(new Controller(), x));
    this.createEntity(this.controllerList);

    if (this.inputList.length == 0) {
      this.inputList.push(new Controller());
    }

    if (this.controllerList.length == 0) {
      this.addController();
    } else {
      this.controllerList.forEach(c => {
        const controllerForm = this.fb.group({
          firstName: [c.firstName, [Validators.required, Validators.pattern(/\S/)]],
          lastName: [c.lastName, [Validators.required, Validators.pattern(/\S/)]],
          email: [c.email, [Validators.required, Validators.pattern(/(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/)]],
          phoneNumber: [c.phoneNumber, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,5}[)]{0,1}[-\s\./0-9]{4,}$|^$/)]],
          address: [c.address, [Validators.required, Validators.pattern(/\S/)]]
      });
      this.controllers.push(controllerForm);
      });
    }
    this.controllers.valueChanges.subscribe(_ => {this.updateData();});
    this.fill(this.controllers, "El");
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmControllers.markAllAsTouched();    
  }

  isEdited() {
    var res = false;
    if (this.controllerList.length == this.inputList.length) {
      for (let index = 0; index < this.controllerList.length; index++) {
        res = res || !this.controllerList[index].isEqual(this.inputList[index]);
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
      this.cancel();
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

  get controllers() {
    return this.frmControllers.controls["controllers"] as FormArray;
  }

  addController() {
    var con = new Controller();
    const controllerForm = this.fb.group({
        firstName: [con.firstName, [Validators.required, Validators.pattern(/\S/)]],
        lastName: [con.lastName, [Validators.required, Validators.pattern(/\S/)]],
        email: [con.email, [Validators.required, Validators.pattern(/(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/)]],
        phoneNumber: [con.phoneNumber, [Validators.required, Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$|^$/)]],
        address: [con.address, [Validators.required, Validators.pattern(/\S/)]]
    });
    this.controllers.push(controllerForm);
    // this.controllerList.push(con);
    this.fill(this.controllers, "El");
    this.frmControllers.markAllAsTouched();
    this.updateData();
  }

  fill(data: any, label: string): void {
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

  deleteController(controllerIndex: number) {
    const message = "Are you sure you want to delete the following Controller?<br><br><b>" + this.getBoxText(controllerIndex)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Controller\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteController(controllerIndex);
      }
    });
  }

  actuallyDeleteController(controllerIndex: number) {
    this.controllers.removeAt(controllerIndex);
    this.controllerList.splice(controllerIndex, 1);
    this.entity = this.entity.filter(e => e.index !== controllerIndex);
    for (var i = 0; i < this.entity.length; i++) {
      if (this.entity[i].index > controllerIndex) {
        this.entity[i].index -= 1; 
      }
    }
    this.updateData();
    const length = this.controllers.length - 1;
    if (!this.show('El', length)) {
      this.viewList('El', length);
    }
    if (this.controllerList.length == 0) {
      this.addController();
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
    this.controllerList.forEach((c: Controller) =>{
      complete = complete && c.isComplete();
    });
    return complete;
  }

  isControllerComplete(i: number): boolean {
    return this.controllerList[i].isComplete();
  }

  entityIsFilled(i: number): boolean {
    if (this.entity.filter(e => e.index == i)[0]) {
      var entity = this.entity.filter(e => e.index == i)[0].entity;
      return entity.isComplete();
    }
    return false;
  }

  checkIfListIsFilled(list: Array<any>): boolean {
    for (var j = 0; j < list.length; j++) {      
      if (!list[j].isComplete()){
        return false;
      }
    }
    return true;
  }

  save(): void {
    var res = this.controllerList;
    if (res.length == 0 || res.every((c:Controller) => c.isEmpty())) {
      res = new Array<Controller>();
    }
    this.dialogRef.close({ event: 'close', data: res });
  }

  createEntity(controllers: Array<Controller>) {
    for (var index = 0; index < controllers.length; index++) {
      var e = this.entity.find(e => e.index == index);
      if (e) {
        this.entity.splice(this.entity.indexOf(e), 1);
      }
      var entity = new Entity();
      entity.name = controllers[index].name;
      entity.classification = controllers[index].classification;
      entity.authInfo = controllers[index].authInfo;
      entity.desc = controllers[index].desc;
      entity.head = controllers[index].head;
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
    this.controllerList = new Array<Controller>();
    for (var i = 0; i < this.controllers.controls.length; i++) {
      var controllerData = new Controller();
      Object.assign(controllerData,this.controllers.controls[i].value);

      if (this.entity.length > 0) {
        if (this.entity.filter(e => e.index == i)[0]) {
          controllerData.name = this.entity.filter(e => e.index == i)[0].entity.name;
          controllerData.type = EntityType[EntityType['Data Controller']];

          controllerData.classification = this.entity.filter(e => e.index == i)[0].entity.classification;
          controllerData.authInfo = this.entity.filter(e => e.index == i)[0].entity.authInfo;
    
          controllerData.head = this.entity.filter(e => e.index == i)[0].entity.head;
          controllerData.desc = this.entity.filter(e => e.index == i)[0].entity.desc;     

          if (controllerData.classification !== 'Person') controllerData.lastName = '';
        }
      }
      this.controllerList.push(controllerData);
    }
    this.isEdited();
  }

  getEntityData(i: number) {
    if (this.controllerList[i]) {      
      return this.controllerList[i];
    } else {
      var controller = new Controller();
      controller.desc = new Array<Description>();
      controller.head = new Array<Header>();
      return controller;
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
      title: this.cardsControl.titleCase("Controller(s)"),
      infoText: textCreator.getText("controllerList")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  getSupport() {
    var data = new Array<string>();
    
    for (var i = 0; i < this.controllerList.length; i++) {
      var element = new Array<string>();
      element.push("<b>" + this.getBoxText(i) + ':</b>');

      var firstname = !StaticValidatorService.stringNotEmpty(this.controllerList[i].firstName);
      var lastname = this.controllerList[i].classification == 'Person' && !StaticValidatorService.stringNotEmpty(this.controllerList[i].lastName);
      var mail = !StaticValidatorService.validateEmail(this.controllerList[i].email);
      var phone = !StaticValidatorService.validatePhoneNumber(this.controllerList[i].phoneNumber);
      var address = !StaticValidatorService.stringNotEmpty(this.controllerList[i].address);

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

      var name = !StaticValidatorService.stringNotEmpty(this.controllerList[i].name);
      var classi = this.controllerList[i].classification == '';

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
    if (this.controllerList[i].head.length > 0) {
      if (!this.controllerList[i].head.every((h: Header) => {
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
    if (this.controllerList[i].desc.length > 0) {
      if (!this.controllerList[i].desc.every((d: Description) => {
        return d.isComplete();
      })) {
        return false;
      }
    } else {
      return false;
    }
    return true;
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
      return (e.entity.name == ""? "Controller " + (i + 1) : e.entity.name);
    } else return "Controller " + (i + 1);
  }
}