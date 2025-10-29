import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LegalBasisCategory } from '../enums/legalBasisCategory';
import { InfoComponent } from '../info/info.component';
import { LegalBasis, Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-legal-basis',
  templateUrl: './legal-basis.component.html',
  styleUrls: ['./legal-basis.component.scss']
})
export class LegalBasisComponent implements OnInit {

  legalBasisList = new Array<any>(
    { lbCategory: LegalBasisCategory[LegalBasisCategory.consent], displayName: "Consent", desc: new Array<Description>(), head: new Array<Header>() },
    { lbCategory: LegalBasisCategory[LegalBasisCategory.contract], displayName: "Contract", desc: new Array<Description>(), head: new Array<Header>() },
    { lbCategory: LegalBasisCategory[LegalBasisCategory.legalObligation], displayName: "Legal obligation", desc: new Array<Description>(), head: new Array<Header>() },
    { lbCategory: LegalBasisCategory[LegalBasisCategory.legitimateInterest], displayName: "Legitimate interest", desc: new Array<Description>(), head: new Array<Header>() },
    { lbCategory: LegalBasisCategory[LegalBasisCategory.publicTask], displayName: "Public task", desc: new Array<Description>(), head: new Array<Header>() },
    { lbCategory: LegalBasisCategory[LegalBasisCategory.vitalInterest], displayName: "Vital interest", desc: new Array<Description>(), head: new Array<Header>() }
  );

  legalBasisData = new Array<LegalBasis>();

  inputData = new Array<LegalBasis>();
  hasSubLB = false;
  subLB = new Array<LegalBasis>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptionIsFilled = Array<number>();
  headerIsFilled = Array<number>();

  defaultLanguage = '';
  name = "";

  constructor(public matDialog: MatDialog,
    private cardsControl: CardsControlService,
    public dialogRef: MatDialogRef<LegalBasis>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.legalBasisData = this.copyObjArray(data.data.legalBasisList);
    this.inputData = this.copyObjArray(data.data.legalBasisList);

    this.hasSubLB = data.hasSub;
    if (this.hasSubLB) {
      var ph = new Array<PurposeHierarchyElement>();
      ph = data.purposeHierarchy;
      var subs = ph.filter(element => element.superPurpose == data.name).map((phe) => phe.subPurpose);
      var purposes = new Array<Purpose>();
      purposes = data.lpp.purposeList;
      purposes.filter((element: Purpose) => subs.includes(element.name)).map((p: Purpose) => p.legalBasisList).forEach((lbl: LegalBasis[]) => {
        lbl.forEach((lb: LegalBasis) => {
          if (this.subLB.findIndex(element => element.lbCategory === lb.lbCategory) < 0) {
            this.subLB.push(lb);
          }
        })
      });
      this.subLB.forEach(element => { if (this.legalBasisData.findIndex(d => d.lbCategory == element.lbCategory) == -1) { this.legalBasisData.push(element); } });
    }

    this.defaultLanguage = data.defaultLanguage;
    this.name = data.name;

    for (var i = 0; i < this.legalBasisData.length; i++) {
      if (this.legalBasisData[i].desc) {
        this.checkIfListIsFilled(this.legalBasisData[i].desc, "description", this.legalBasisList.findIndex(d => d.lbCategory == this.legalBasisData[i].lbCategory));
      }
      if (this.legalBasisData[i].head) {
        this.checkIfListIsFilled(this.legalBasisData[i].head, "header", this.legalBasisList.findIndex(d => d.lbCategory == this.legalBasisData[i].lbCategory));
      }
    }

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
  }

  isEdited(): boolean {
    var res = false;
    if (this.legalBasisData.length == this.data.data.legalBasisList.length) {
      for (let index = 0; index < this.legalBasisData.length; index++) {
        const element = new LegalBasis(this.legalBasisData[index]);
        res = res || !element.isEqual(new LegalBasis(this.data.data.legalBasisList[index]));
      }
    } else {
      if (this.legalBasisData.length < this.data.data.legalBasisList.length) {
        return true;
      } else {
        for (let index = 0; index < this.legalBasisData.length; index++) {
          const element = new LegalBasis(this.legalBasisData[index]);
          if (!element.isEmpty()) {
            res = res || !element.isEqual(new LegalBasis(this.data.data.legalBasisList[index]));
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

  checkIfListIsFilled(list: Array<any>, label: string, i: number): void {
    var isFilledOut = true;
    for (var j = 0; j < list.length; j++) {
      if (list[j].lang == '' || list[j].value == '' || !StaticValidatorService.stringNotEmpty(list[j].value)) {
        isFilledOut = false;
        break;
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

  copyObjArray(arr: Array<LegalBasis>): Array<LegalBasis> {
    var res = new Array<LegalBasis>();
    for (var i = 0; i < arr.length; i++) {
      var data = new LegalBasis();
      data.lbCategory = arr[i].lbCategory;

      var descrArray = new Array<Description>();
      for (var j = 0; j < arr[i].desc.length; j++) {
        var d = new Description();
        d.lang = arr[i].desc[j].lang;
        d.value = arr[i].desc[j].value;
        descrArray.push(d);
      }
      data.desc = descrArray;

      var headArray = new Array<Header>();
      for (var j = 0; j < arr[i].head.length; j++) {
        var h = new Header();
        h.lang = arr[i].head[j].lang;
        h.value = arr[i].head[j].value;
        headArray.push(h);
      }
      data.head = headArray;
      res.push(data);
    }
    return res;
  }

  checked(right: any): boolean {
    return this.legalBasisData.findIndex(element => element.lbCategory == right) > -1;
  }

  toggle(event: any, right: any, rightsIndex: number): void {
    var r = new LegalBasis();
    r.lbCategory = right;
    r.head = new Array<Header>();
    r.desc = new Array<Description>();
    if (event.checked) {
      this.legalBasisData.push(r);
      this.headerIsClicked.push(rightsIndex);
      this.descriptionIsClicked.push(rightsIndex);
    } else {
      const removeIndex = this.legalBasisData.findIndex(item => item.lbCategory === right);
      this.legalBasisData.splice(removeIndex, 1);
      this.headerIsFilled = this.headerIsFilled.filter(h => h !== rightsIndex);
      this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== rightsIndex);
    }
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.legalBasisData });
  }

  isDataComplete(): boolean {
    if (this.legalBasisData.length == 0) return false;

    for (var i = 0; i < this.legalBasisData.length; i++) {
      if (this.legalBasisData[i].desc.length == 0
        || this.legalBasisData[i].head.length == 0) {
        return false;
      }

      for (var j = 0; j < this.legalBasisData[i].desc.length; j++) {
        if (this.legalBasisData[i].desc[j].lang == "" ||
          this.legalBasisData[i].desc[j].value == "" ||
          !StaticValidatorService.stringNotEmpty(this.legalBasisData[i].desc[j].value)) {
          return false;
        }
      }

      for (var k = 0; k < this.legalBasisData[i].head.length; k++) {
        if (this.legalBasisData[i].head[k].lang == "" ||
          this.legalBasisData[i].head[k].value == "" ||
          !StaticValidatorService.stringNotEmpty(this.legalBasisData[i].head[k].value)) {
          return false;
        }
      }
    }

    return true;
  }

  getSupport() {
    var data = new Array<string>();

    if (this.legalBasisData.length == 0) data.push('Select at least one legal basis for this purpose.');

    for (var i = 0; i < this.legalBasisData.length; i++) {
      var element = new Array<string>();
      element.push("<b>" + this.legalBasisList.find(lb => lb.lbCategory === this.legalBasisData[i].lbCategory).displayName + ':</b>');

      if (this.legalBasisData[i].head.length == 0) {
        element.push('- titles');
      }

      if (this.legalBasisData[i].head.length > 0) {
        if (!this.legalBasisData[i].head.every((h: Header) => {
          return h.isComplete();
        })) {
          element.push('- titles');
        }
      }

      if (this.legalBasisData[i].desc.length == 0) {
        element.push('- descriptions');
      }

      if (this.legalBasisData[i].desc.length > 0) {
        if (!this.legalBasisData[i].desc.every((d: Description) => {
          return d.isComplete();
        })) {
          element.push('- descriptions');
        }
      }

      if (element.length > 1) {
        data = data.concat(element);
      }
    }
    this.matDialog.open(SaveMessageComponent, { data: data });
  }

  addDescription(descriptionList: Array<Description>, icon: any, i: number) {
    this.legalBasisData.filter(data => data.lbCategory == icon)[0].desc = descriptionList;
    this.checkIfListIsFilled(descriptionList, "description", i);
  }

  addHeader(headerList: Array<Header>, icon: any, i: number) {
    this.legalBasisData.filter(data => data.lbCategory == icon)[0].head = headerList;
    this.checkIfListIsFilled(headerList, "header", i);
  }

  getDescription(icon: any): Array<Description> {
    return this.legalBasisData.filter(data => data.lbCategory == icon)[0].desc;
  }

  getHeader(icon: any): Array<Header> {
    return this.legalBasisData.filter(data => data.lbCategory == icon)[0].head;
  }

  getSubDescription(icon: any): Array<Description> {
    if (this.hasSubLB) {
      var array = this.subLB.filter(data => data.lbCategory == icon);
      if (array.length > 0) {
        return array[0].desc
      }
      return [];
    }
    return [];
  }

  getSubHeader(icon: any): Array<Header> {
    if (this.hasSubLB) {
      var array = this.subLB.filter(data => data.lbCategory == icon);
      if (array.length > 0) {
        return array[0].head;
      }
      return [];
    }
    return [];
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
      title: this.cardsControl.titleCase("Legal Bases"),
      infoText: textCreator.getText("legalBasisList")
    }
    this.matDialog.open(InfoComponent, { data: data });
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
