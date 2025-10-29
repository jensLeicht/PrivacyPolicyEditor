import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { Data, Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-selected-data',
  templateUrl: './selected-data.component.html',
  styleUrls: ['./selected-data.component.scss']
})
export class SelectedDataComponent implements OnInit {

  dataList = new Array<Data>();
  allDataList = new Array<any>();
  allData = new Array<Data>();
  hasSubData = false;
  subData = new Array<Data>();
  name = "";

  constructor(public matDialog: MatDialog,
    private cardsControl: CardsControlService,
    public dialogRef: MatDialogRef<SelectedDataComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.dataList = this.makeDeepCopy(data.lppData);
    this.allData = data.allData;
    this.hasSubData = data.hasSubData;
    if (this.hasSubData) {
      var ph = new Array<PurposeHierarchyElement>();
      ph = data.purposeHierarchy;
      var subs = ph.filter(element => element.superPurpose == data.name).map((phe) => phe.subPurpose);
      var purposes = new Array<Purpose>();
      purposes = data.lpp.purposeList;
      purposes.filter((element: Purpose) => subs.includes(element.name)).map((p: Purpose) => p.dataList).forEach((dl: Data[]) => {
        dl.forEach((d: Data) => {
          if (this.subData.findIndex(element => element.name === d.name) < 0) {
            this.subData.push(d);
          }
        })
      });
      this.subData.forEach(element => { if (this.dataList.findIndex(d => d.name == element.name) == -1) { this.dataList.push(element); } });
    }
    this.name = data.name;

    var names = this.subData.map((datum: Data) => datum.name);
    for (var i = 0; i < data.allData.length; i++) {
      if (!names.includes(data.allData[i].name)) {
        this.allDataList.push({ value: data.allData[i].name, viewValue: data.allData[i].name });
      }
    }

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
  }

  makeDeepCopy(source: Array<Data>): Array<Data> {
    return source.map(x => Object.assign({}, x));
  }

  isEdited(): boolean {
    var res = false;
    if (this.dataList.length == this.data.lppData.length) {
      for (let index = 0; index < this.dataList.length; index++) {
        const element = new Data(this.dataList[index]);
        res = res || !element.isEqual(new Data(this.data.lppData[index]));
      }
    } else {
      if (this.dataList.length < this.data.lppData.length) {
        return true;
      } else {
        for (let index = 0; index < this.dataList.length; index++) {
          const element = new Data(this.dataList[index]);
          if (!element.isEmpty()) {
            res = res || !element.isEqual(new Data(this.data.lppData[index]));
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
    return this.dataList.length > 0;
  }

  getSupport() {
    var data = new Array<string>();

    if (this.dataList.length === 0) {
      data.push('The data list should not be empty.');
    }
    this.matDialog.open(SaveMessageComponent, { data: data });
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.dataList });
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data"),
      infoText: textCreator.getText("datum")
    }
    this.matDialog.open(InfoComponent, { data: data });
  }

  checked(dataName: any): boolean {
    for (let i of this.dataList) {
      if (i.name == dataName) {
        return true;
      }
    }
    return false;
  }

  toggle(event: any, nameOfData: any): void {
    var dObj = this.allData.find(d => d.name === nameOfData)!;
    if (event.checked) {
      this.dataList.push(dObj);
    } else {
      const removeIndex = this.dataList.findIndex(item => item.name === nameOfData);
      this.dataList.splice(removeIndex, 1);
    }
  }
}