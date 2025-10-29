import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { RetentionType } from '../enums/retentionType';
import { InfoComponent } from '../info/info.component';
import { Retention } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-retention',
  templateUrl: './retention.component.html',
  styleUrls: ['./retention.component.scss']
})
export class RetentionComponent implements OnInit {

  frmRetention!: FormGroup;

  headerList = new Array<Header>();
  descriptionList = new Array<Description>();

  descriptionIsClicked = true;
  headerIsClicked = true;

  descriptionIsFilled = false;
  headerIsFilled = false;

  defaultLanguage = '';
  name = "";

  years = 31556926;
  month = 2629743;
  days = 86400;

  typeList = [
    {value: RetentionType[RetentionType.afterPurpose], viewValue: 'After purpose'},
    {value: RetentionType[RetentionType.fixedDate], viewValue: 'Fixed date'},
    {value: RetentionType[RetentionType.indefinite], viewValue: 'Indefinite'}
  ];

  listOfYears = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50];

  listOfDays = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30];

  listOfMonths = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11];

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      formBuilder: FormBuilder,
      public dialogRef: MatDialogRef<RetentionComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.defaultLanguage = data.defaultLanguage;
    this.name = data.name;

    var date!: '' | Date;
    var y = 0;
    var m = 0;
    var d = 0;
    if (data.data.retention.type === "afterPurpose") {
      y = Math.trunc(data.data.retention.pointInTime / this.years);     
      m = Math.trunc((data.data.retention.pointInTime - (y * this.years)) / this.month);
      d = Math.trunc((data.data.retention.pointInTime - (y * this.years) - (m * this.month)) / this.days);
    } else {
      date = data.data.retention.pointInTime == "" ? "" : new Date(data.data.retention.pointInTime * 1000);
    }  

    this.frmRetention = formBuilder.group({
      type: [data.data.retention.type, Validators.required],
      pointInTime: [date, Validators.required],
      years: [y],
      months: [m],
      days: [d]
    });

    this.descriptionList = data.data.retention.desc;
    this.headerList = data.data.retention.head;

    this.descriptionIsFilled = this.checkIfListIsFilled(this.descriptionList, "description");
    this.headerIsFilled = this.checkIfListIsFilled(this.headerList, "header");

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmRetention.markAllAsTouched();
  }
  
  isEdited(): boolean {
    var r = new Retention();
    r.type = this.frmRetention.value.type;
    if (this.indefniteSelected()) {
      r.pointInTime = "";
    } else if (this.afterPurposeSelected()) {
      var newDate = this.years * this.frmRetention.value.years + this.month * this.frmRetention.value.months + this.days * this.frmRetention.value.days;
      r.pointInTime = newDate.toString();
    } else if (r.type == "") {
      r.pointInTime = "";
    } else {
      r.pointInTime = (new Date(this.frmRetention.value.pointInTime).getTime() / 1000).toString();
    }    
    r.head = this.headerList;
    r.desc = this.descriptionList;
    return !r.isEqual(new Retention(this.data.data.retention));
  }
  
  close() {
    if (this.isEdited()) {
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
    if (this.indefniteSelected()) {
      return this.frmRetention.value.type
      && this.descriptionList.length > 0 && this.headerList.length > 0
      && this.checkIfListIsFilled(this.descriptionList, "description")
      && this.checkIfListIsFilled(this.headerList, "header");
    }

    if (this.afterPurposeSelected()) {
      return this.frmRetention.value.type
      && this.descriptionList.length > 0 && this.headerList.length > 0
      && this.checkIfListIsFilled(this.descriptionList, "description")
      && this.checkIfListIsFilled(this.headerList, "header");
    }
    return this.frmRetention.value.type && this.frmRetention.value.pointInTime
      && this.descriptionList.length > 0 && this.headerList.length > 0
      && this.checkIfListIsFilled(this.descriptionList, "description")
      && this.checkIfListIsFilled(this.headerList, "header");
  }

  getSupport() {
    var data = new Array<string>();

    if (this.afterPurposeSelected()) {
      if (this.frmRetention.value.years === 0 && this.frmRetention.value.months === 0 && this.frmRetention.value.days === 0) {
        data.push('- duration');
      }
    }

    if (this.fixedDateSelected()) {
      if (!this.frmRetention.value.pointInTime) {
        data.push('- point in time');
      }
    }
    

    if (!this.frmRetention.value.type) {
      data.push('- type');
    } 

    var head = this.headerList.length === 0 || !this.checkIfListIsFilled(this.headerList, "header");
    var desc = this.descriptionList.length === 0 || !this.checkIfListIsFilled(this.descriptionList, "description");

    if(head || desc) {
      data.push("<i>UI-Representation:</i>");
    }

    if (head) {
      data.push('- titles');
    }

    if (desc) {
      data.push('- descriptions');
    }

    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  save(): void {
    var r = new Retention();
    r.type = this.frmRetention.value.type;
    if (this.indefniteSelected()) {
      r.pointInTime = "";
    } else if (this.afterPurposeSelected()) {

      var newDate = this.years * this.frmRetention.value.years + this.month * this.frmRetention.value.months + this.days * this.frmRetention.value.days;
      r.pointInTime = newDate.toString();
    } else {
      r.pointInTime = (new Date(this.frmRetention.value.pointInTime).getTime() / 1000).toString();
    }    
    r.head = this.headerList;
    r.desc = this.descriptionList;
    this.dialogRef.close({ event: 'close', data:r });
  }

  addDescription(descriptionList: Array<Description>) {
    this.descriptionList = descriptionList;
    this.descriptionIsFilled = this.checkIfListIsFilled(descriptionList, "description");
  }

  addHeader(headerList: Array<Header>) {
    this.headerList = headerList;
    this.headerIsFilled = this.checkIfListIsFilled(headerList, "header");
  }

  checkIfListIsFilled(list: Array<any>, label: string): boolean {
    if (list.length == 0) return false;
    var res = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].lang == '' || list[i].value == '' || !StaticValidatorService.stringNotEmpty(list[i].value)) {
        return false;
      }
    }
    return res;
  }

  clickDescription(): void {
    if (this.descriptionIsClicked) {
      this.descriptionIsClicked = false;
    } else {
      this.descriptionIsClicked = true;
    }
  }

  clickHeader(): void {
    if (this.headerIsClicked) {
      this.headerIsClicked = false;
    } else {
      this.headerIsClicked = true;
    }
  }

  indefniteSelected(): boolean {
    var selected = this.frmRetention.value.type === RetentionType[RetentionType.indefinite];
    /* if (selected) {
      this.frmRetention.patchValue({
            pointInTime: "",
      })
    } */
    return selected;
  }

  fixedDateSelected(): boolean {
    var selected = this.frmRetention.value.type === RetentionType[RetentionType.fixedDate];
    return selected;
  }

  afterPurposeSelected(): boolean {
    var selected = this.frmRetention.value.type === RetentionType[RetentionType.afterPurpose]; 
    return selected;
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Retention"),
      infoText: textCreator.getText("retention")
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

}
