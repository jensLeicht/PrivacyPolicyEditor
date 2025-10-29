import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { LodgeComplaint } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { Entity } from '../model/lpl/entity';
import { EntityType } from '../enums/entityType';

@Component({
  selector: 'app-lodge-complaint',
  templateUrl: './lodge-complaint.component.html',
  styleUrls: ['./lodge-complaint.component.scss']
})
export class LodgeComplaintComponent implements OnInit {

  frmLc!: FormGroup;

  lcObj = new LodgeComplaint();

  entity = new Entity();

  edited = false;

  defaultLanguage = '';

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private cd: ChangeDetectorRef,
      private fb:FormBuilder,
      public dialogRef: MatDialogRef<LodgeComplaintComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
        
    this.lcObj = data.data.lodgeComplaint;
    this.defaultLanguage = data.defaultLanguage;
    this.createEntity(data.data.dataProtectionOfficerList);

    this.frmLc = this.fb.group({
        firstName: [this.lcObj.firstName, [Validators.required, Validators.pattern(/\S/)]],
        lastName: [this.lcObj.lastName, [Validators.pattern(/\S/)]],
        email: [this.lcObj.email, [Validators.pattern(/(^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$)|^$/)]],
        phoneNumber: [this.lcObj.phoneNumber, [Validators.pattern(/^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$|^$/)]],
        address: [this.lcObj.address, [Validators.pattern(/\S/)]]
      });
    this.frmLc.valueChanges.subscribe(_ => {this.updateData()});
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmLc.markAllAsTouched();    
  }

  isEdited() {
    this.edited = !this.lcObj.isEqual(this.data.data.lodgeComplaint);
  }
  
  ngAfterViewInit() {
    this.cd.detectChanges();
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

  isDataComplete(): boolean {
    // this.checkIfListIsFilled(this.lcObj.head,"header");
    // this.checkIfListIsFilled(this.lcObj.desc,"description");
    return StaticValidatorService.stringNotEmpty(this.lcObj.name);
    // && this.headerIsFilled
    // && this.descriptionIsFilled;
  }

  getSupport() {
    var data = new Array<string>();
    if (!StaticValidatorService.stringNotEmpty(this.frmLc.value.name)) {
      data.push("- name");
    }
    
    // if(!this.headerIsFilled || !this.descriptionIsFilled) {
    //   data.push("<i>UI-Representation:</i>");
    // }

    // if (!this.headerIsFilled) {
    //   data.push("- titles");
    // }

    // if (!this.descriptionIsFilled) {
    //   data.push("- descriptions");
    // }
        
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  updateData() {
    var obj = new LodgeComplaint();
    Object.assign(obj,this.frmLc.value);
    obj.name = this.entity.name;
    obj.type = EntityType[EntityType['Supervisory Authority']];
    obj.classification = this.entity.classification;
    obj.authInfo = this.entity.authInfo;
    obj.head = this.entity.head;
    obj.desc = this.entity.desc;
    this.lcObj = obj;
    this.isEdited();
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.lcObj });
  }

  createEntity(lc: LodgeComplaint) {
      var entity = new Entity();
      entity.name = lc.name;
      entity.classification = lc.classification;
      entity.authInfo = lc.authInfo;
      entity.desc = lc.desc;
      entity.head = lc.head;
      this.entity = entity;
    }

  getDescription(): Array<Description> {
    this.updateData();
    if(this.lcObj.desc.length > 0) {
      return this.lcObj.desc;
    } else {
      return new Array<Description>();
    }
  }

  getHeader(): Array<Header> {
    this.updateData();
    if(this.lcObj.head.length > 0) {
      return this.lcObj.head;
    } else {
      return new Array<Header>();
    }
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Lodge Complaint"),
      infoText: textCreator.getText("lodgeComplaint")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  addEntity(entity: Entity) {
    this.entity = entity;
    this.updateData();
  }

  getEntityData() {
    if (this.lcObj) {
      return this.lcObj;
    } else {
      var lc = new LodgeComplaint();
      lc.desc = new Array<Description>();
      lc.head = new Array<Header>();
      return lc;
    }
  }

  validatePhoneNumber(phoneNumber: any): boolean {
    return !StaticValidatorService.stringNotEmpty(phoneNumber) || StaticValidatorService.validatePhoneNumber(phoneNumber);
  }

  validateEmail(email: any): boolean {
    return !StaticValidatorService.stringNotEmpty(email) || StaticValidatorService.validateEmail(email);
  }

}
