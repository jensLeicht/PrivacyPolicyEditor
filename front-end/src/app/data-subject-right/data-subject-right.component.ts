import { ChangeDetectorRef, Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { DataSubjectRight } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { DataService } from '../service/data.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-data-subject-right',
  templateUrl: './data-subject-right.component.html',
  styleUrls: ['./data-subject-right.component.scss']
})
export class DataSubjectRightComponent implements OnInit {

  dataSubjectRightList = new Array<any>(
    {name: "access", displayName: "Right of Access by the Data Subject", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "rectification", displayName: "Right to Rectification", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "erasure", displayName: "Right to Erasure", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "restriction", displayName: "Right to Restriction of Processing", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "portability", displayName: "Right to Data Portability", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "objection", displayName: "Right to Object", desc: new Array<Description>(), head: new Array<Header>()},
    {name: "intervention", displayName: "Right of Intervention", desc: new Array<Description>(), head: new Array<Header>()}
  );

  dataSubjectRightData = new Array<DataSubjectRight>();

  inputData = new Array<DataSubjectRight>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptionIsFilled = Array<number>();
  headerIsFilled = Array<number>();

  defaultLanguage = '';

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      public dialogRef: MatDialogRef<DataSubjectRightComponent>,
      private cd: ChangeDetectorRef,
      private dataService: DataService,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.defaultLanguage = data.defaultLanguage;

    this.dataSubjectRightData = this.copyObjArray(data.data.dataSubjectRightList);    
    this.inputData = this.copyObjArray(data.data.dataSubjectRightList);

    for (var i = 0; i < this.dataSubjectRightData.length; i++) {
      if (this.dataSubjectRightData[i].desc) {
        this.checkIfListIsFilled(this.dataSubjectRightData[i].desc, "description", this.dataSubjectRightList.findIndex(d => d.name == this.dataSubjectRightData[i].name));
      }
      if (this.dataSubjectRightData[i].head) {
        this.checkIfListIsFilled(this.dataSubjectRightData[i].head, "header", this.dataSubjectRightList.findIndex(d => d.name == this.dataSubjectRightData[i].name));
      }
    }
    
    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
  }

  isEdited(): boolean {
    if (this.dataSubjectRightData.some(elem => !this.data.data.dataSubjectRightList.includes(elem))) {      
      var res = false;
      if (this.dataSubjectRightData.length == this.data.data.dataSubjectRightList.length) {
          for (let index = 0; index < this.dataSubjectRightData.length; index++) {
          const element = new DataSubjectRight(this.dataSubjectRightData[index]);
          res = res || !element.isEqual(this.data.data.dataSubjectRightList[index]);
        }
        return res;
      }
      return true;
    } else {
      return this.dataSubjectRightData.length == 0 && this.data.data.dataSubjectRightList.length > 0;
    }
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

  ngAfterViewInit() {
    this.cd.detectChanges();
  }

  checkIfListIsFilled(list: Array<any>, label: string, i: number): void { 
    var isFilledOut = true;
    for (var j = 0; j < list.length; j++) {
      if (label == "description") {
        var desc = new Description(list[j]);
        isFilledOut = isFilledOut && desc.isComplete();
      } else {
        var head = new Header(list[j]);
        isFilledOut = isFilledOut && head.isComplete();
      }
    }
    if (isFilledOut) {
      if (label == "description") {
        this.descriptionIsFilled.push(i);
      } else {
        this.headerIsFilled.push(i);
      }
    } else {
      if (label == "description") {
        if (this.descriptionIsFilled.includes(i)) this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== i);
      } else {
        if (this.headerIsFilled.includes(i)) this.headerIsFilled = this.headerIsFilled.filter(h => h !== i);
      }
    }
  }

  copyObjArray(arr: Array<DataSubjectRight>): Array<DataSubjectRight> {
    var res = new Array<DataSubjectRight>();
    for (var i = 0; i < arr.length; i++) {     
      var obj = new DataSubjectRight;
      obj.name = arr[i].name;

      var descrArray = new Array<Description>();
      for (var j = 0; j < arr[i].desc.length; j++) {
        var d = new Description();
        d.lang = arr[i].desc[j].lang;
        d.value = arr[i].desc[j].value;
        descrArray.push(d);
      }
      obj.desc = descrArray;

      var headArray = new Array<Header>();
      for (var j = 0; j < arr[i].head.length; j++) {
        var h = new Header();
        h.lang = arr[i].head[j].lang;
        h.value = arr[i].head[j].value;
        headArray.push(h);
      }
      obj.head = headArray;
      res.push(obj);
    }
    return res;
  }

  checked(right: any): boolean {
    for(let i of this.dataSubjectRightData) {
      if (i.name == right) {
        return true;
      }
    }
    return false;
  }

  toggle(event: any, right: any, rightsIndex: number): void {
    var r = new DataSubjectRight();
    r.name =  right;
    r.head = new Array<Header>();
    r.desc = new Array<Description>();
    if (event.checked) {
      r.desc = this.dataService.getRightsDesc(right);
      r.head = this.dataService.getRightsHeader(right);
      this.dataSubjectRightData.push(r);
      this.headerIsFilled.push(rightsIndex);
      this.descriptionIsFilled.push(rightsIndex);
      this.headerIsClicked.push(rightsIndex);
      this.descriptionIsClicked.push(rightsIndex);
    } else {
      const removeIndex = this.dataSubjectRightData.findIndex( item => item.name === right );
      this.dataSubjectRightData.splice(removeIndex, 1);
      this.headerIsFilled = this.headerIsFilled.filter(h => h !== rightsIndex);
      this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== rightsIndex);
    }
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.dataSubjectRightData });
  }

  isDataComplete(): boolean {
    if (this.dataSubjectRightData.length == 0) return false;

    var complete = true;
    for (var i = 0; i < this.dataSubjectRightData.length; i++) {
      var index = this.dataSubjectRightList.findIndex(d => d.name == this.dataSubjectRightData[i].name);
      complete = complete && this.headerIsFilled.includes(index) && this.descriptionIsFilled.includes(index);
    }
  
    return complete;
  }

  getSupport() {
    var data = new Array<string>();
    
    if (this.dataSubjectRightData.length == 0){
       data.push('The data subject right list should not be empty.');
       data.push('Select at least one data subject to continue.');
    }

    for (var i = 0; i < this.dataSubjectRightData.length; i++) {
      var index = this.dataSubjectRightList.findIndex(d => d.name == this.dataSubjectRightData[i].name);
      var element = new Array<string>();
      element.push('Data Subject Right \"' + this.dataSubjectRightData[i].name + "\":");

      if (!this.headerIsFilled.includes(index)) {
        element.push('- titles');
      }

      if (!this.descriptionIsFilled.includes(index)) {
        element.push('- descriptions');
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  addDescription(descriptionList: Array<Description>, icon: any, i: number) {
    this.dataSubjectRightData.filter(data => data.name == icon)[0].desc = descriptionList;
    this.checkIfListIsFilled(descriptionList, "description", i);
  }

  addHeader(headerList: Array<Header>, icon: any, i: number) {
    this.dataSubjectRightData.filter(data => data.name == icon)[0].head = headerList;
    this.checkIfListIsFilled(headerList, "header", i);
  }

  getDescription(icon: any): Array<Description> {
    return this.dataSubjectRightData.filter(data => data.name == icon)[0].desc;
  }

  getHeader(icon: any): Array<Header> {
    return this.dataSubjectRightData.filter(data => data.name == icon)[0].head;
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

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Data Subject Rights"),
      infoText: textCreator.getText("dataSubjectRight")
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
