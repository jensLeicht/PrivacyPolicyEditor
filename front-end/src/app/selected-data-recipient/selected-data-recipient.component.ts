import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { DataRecipient, Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-selected-data-recipient',
  templateUrl: './selected-data-recipient.component.html',
  styleUrls: ['./selected-data-recipient.component.scss']
})
export class SelectedDataRecipientComponent implements OnInit {

  dataRecipientList = new Array<DataRecipient>();
  allDataRecipientList = new Array<any>();
  allDataRecipients = new Array<DataRecipient>();
  hasSubDataRecipients = false;
  subDataRecipients = new Array<DataRecipient>();
  name = "";

  constructor(public matDialog: MatDialog,
    private cardsControl: CardsControlService,
    public dialogRef: MatDialogRef<SelectedDataRecipientComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataRecipientList = this.makeDeepCopy(data.selDR);
    this.allDataRecipients = data.allDR;
    this.hasSubDataRecipients = data.hasSubDataRecipients;
    if (this.hasSubDataRecipients) {
      var ph = new Array<PurposeHierarchyElement>();
      ph = data.purposeHierarchy;
      var subs = ph.filter(element => element.superPurpose == data.name).map((phe) => phe.subPurpose);
      var purposes = new Array<Purpose>();
      purposes = data.lpp.purposeList;
      purposes.filter((element: Purpose) => subs.includes(element.name)).map((p: Purpose) => p.dataRecipientList).forEach((drl: DataRecipient[]) => {
        drl.forEach((dr: DataRecipient) => {
          if (this.subDataRecipients.findIndex(element => element.name === dr.name) < 0) {
            this.subDataRecipients.push(dr);
          }
        })
      });
      this.subDataRecipients.forEach(element => { if (this.dataRecipientList.findIndex(d => d.name === element.name) == -1) { this.dataRecipientList.push(element); } });
    }
    this.name = data.name;

    var names = this.subDataRecipients.map((dr: DataRecipient) => dr.name);
    for (var i = 0; i < data.allDR.length; i++) {
      if (!names.includes(data.allDR[i].name)) {
        this.allDataRecipientList.push({ value: data.allDR[i].name, viewValue: data.allDR[i].name });
      }
    }

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
  }

  makeDeepCopy(source: Array<DataRecipient>): Array<DataRecipient> {
    return source.map(x => Object.assign({}, x));
  }

  isEdited(): boolean {
    var res = false;
    if (this.dataRecipientList.length == this.data.selDR.length) {
      for (let index = 0; index < this.dataRecipientList.length; index++) {
        const element = new DataRecipient(this.dataRecipientList[index]);
        res = res || !element.isEqual(new DataRecipient(this.data.selDR[index]));
      }
    } else {
      if (this.dataRecipientList.length < this.data.selDR.length) {
        return true;
      } else {
        for (let index = 0; index < this.dataRecipientList.length; index++) {
          const element = new DataRecipient(this.dataRecipientList[index]);
          if (!element.isEmpty()) {
            res = res || !element.isEqual(new DataRecipient(this.data.selDR[index]));
          }
        }
      }
    }
    return res;
  }

  close() {
    if (this.isEdited()) {
      const message = "Save changes before closing?";
      const dialogData = new ConfirmDialogModel("Close ", message);
      var confirmRef = this.matDialog.open(ConfirmDialogComponent, {
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
          this.dialogRef.close({ event: 'cancel' });
        }
      });
    } else {
      this.dialogRef.close({ event: 'cancel' });
    }
  }

  cancel(): void {
    this.dialogRef.close({ event: 'cancel' });
  }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }

  isDataComplete(): boolean {
    return true;
  }

  getSupport() {
    var data = new Array<string>();

    if (this.dataRecipientList.length === 0) {
      data.push('At least one data recipient should be selected.');
    }
    this.matDialog.open(SaveMessageComponent, { data: data });
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.dataRecipientList });
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data Recipient(s)"),
      infoText: textCreator.getText("dataRecipient")
    }
    this.matDialog.open(InfoComponent, { data: data });
  }

  checked(dataName: any): boolean {
    for (let i of this.dataRecipientList) {
      if (i.name == dataName) {
        return true;
      }
    }
    return false;
  }

  toggle(event: any, nameOfDataRecipient: any): void {
    var dObj = this.allDataRecipients.find(d => d.name === nameOfDataRecipient)!;
    if (event.checked) {
      this.dataRecipientList.push(dObj);
    } else {
      const removeIndex = this.dataRecipientList.findIndex(item => item.name === nameOfDataRecipient);
      this.dataRecipientList.splice(removeIndex, 1);
    }
  }
}