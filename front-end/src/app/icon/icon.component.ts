import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { Icon, IconData } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { IconService } from '../service/icon-service.service';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-icon',
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss']
})

export class IconComponent implements OnInit {

  public icons = ["marketing", "profiling", "provision", "research", "security", "statistic"];
  iconsData = new Array<Icon>();
  inputData = new Array<Icon>();

  descriptionIsClicked: Array<number> = [];
  headerIsClicked: Array<number> = [];

  descriptionIsFilled = Array<number>();
  headerIsFilled = Array<number>();

  defaultLanguage = '';

  constructor(public matDialog: MatDialog,
      private cardsControl: CardsControlService,
      private iconService: IconService,
      public dialogRef: MatDialogRef<IconComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
        
        this.iconsData = this.copyObjArray(data.data.iconList);    
        this.inputData = this.copyObjArray(data.data.iconList);   

        this.defaultLanguage = data.defaultLanguage;
        
        for (var i = 0; i < this.iconsData.length; i++) {
          if (this.iconsData[i].icon.desc) {
            this.checkIfListIsFilled(this.iconsData[i].icon.desc, "description", this.icons.findIndex(d => d == this.iconsData[i].icon.name));
          }
          if (this.iconsData[i].icon.head) {
            this.checkIfListIsFilled(this.iconsData[i].icon.head, "header", this.icons.findIndex(d => d == this.iconsData[i].icon.name));
          }
        }
        this.dialogRef.backdropClick().subscribe(() => { this.close(); });
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
        if (dialogResult === true) {
          this.save();
        } else {
          this.dialogRef.close({ event: 'cancel'});     
        }
      });
    } else {
      this.dialogRef.close({ event: 'cancel'});
    }
  }

  isEdited(): boolean {
    // if (!this.descriptionList.every(elem => this.data.currentLpp.DESCRIPTION.includes(elem)) ||
    //   !this.headerList.every(elem => this.data.currentLpp.HEADER.includes(elem)) ||
    //   this.frmPolicyName.value.lang != this.data.currentLpp.lang ||
    //   this.frmPolicyName.value.name != this.data.currentLpp.name ||
    //   this.frmPolicyName.value.uri != this.data.currentLpp.privacyPolicyUri
    // ) {
    //   return true;
    // } else {  
      return false;
    // }
  }

  cancel(): void {
    this.dialogRef.close({ event: 'cancel'});
  }

  ngOnInit(): void {
    this.iconService.registerIcons();
  }

  checkIfListIsFilled(list: Array<any>, label: string, i: number): void { 
    var isFilledOut = true;
    for (var j = 0; j < list.length; j++) {
      if (list[j][label].lang == '' || list[j][label].value == ''
        || !StaticValidatorService.stringNotEmpty(list[j][label].value)) {
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
        if (this.descriptionIsFilled.includes(i)) this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== i)
      } else {
        if (this.headerIsFilled.includes(i)) this.headerIsFilled = this.headerIsFilled.filter(h => h !== i);
      }
    }
  }

  copyObjArray(arr: Array<Icon>): Array<Icon> {
    var res = new Array<Icon>();
    for (var i = 0; i < arr.length; i++) {     
      var iconObj = new Icon;
      var iconData = new IconData();
      iconData.name = arr[i].icon.name;

      var descrArray = new Array<Description>();
      for (var j = 0; j < arr[i].icon.desc.length; j++) {
        var d = new Description();
        d.lang = arr[i].icon.desc[j].lang;
        d.value = arr[i].icon.desc[j].value;
        descrArray.push(d);
      }
      iconData.desc = descrArray;

      var headArray = new Array<Header>();
      for (var j = 0; j < arr[i].icon.head.length; j++) {
        var h = new Header();
        h.lang = arr[i].icon.head[j].lang;
        h.value = arr[i].icon.head[j].value;
        headArray.push(h);
      }
      iconData.head = headArray;

      iconObj.icon = iconData;
      res.push(iconObj);
    }
    return res;
  }

  checked(icon: any): boolean {
    for(let i of this.iconsData) {
      if (i.icon.name == icon) {
        return true;
      }
    }
    return false;
  }

  toggle(event: any, icon: any, iconIndex: number): void {
    var ic = new Icon();
    ic.icon.name = icon;
    ic.icon.head = new Array<Header>();
    ic.icon.desc = new Array<Description>();
    if (event.checked) {
      this.iconsData.push(ic);
      this.headerIsClicked.push(iconIndex);
      this.descriptionIsClicked.push(iconIndex);
    } else {
      const removeIndex = this.iconsData.findIndex( item => item.icon.name === icon );
      this.iconsData.splice(removeIndex, 1);
      this.headerIsFilled = this.headerIsFilled.filter(h => h !== iconIndex);
      this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== iconIndex);
    }
  }

  save(): void {
    this.dialogRef.close({ event: 'close', data: this.iconsData });
  }

  isDataComplete(): boolean {
    if (this.iconsData.length == 0) return false;

    for (var i = 0; i < this.iconsData.length; i++) {
      if (this.iconsData[i].icon.desc.length == 0
        || this.iconsData[i].icon.head.length == 0) {
          return false;
      }

      for (var j = 0; j < this.iconsData[i].icon.desc.length; j++) {  
        if (this.iconsData[i].icon.desc[j].lang == "" || 
          this.iconsData[i].icon.desc[j].value == "" || 
          !StaticValidatorService.stringNotEmpty(this.iconsData[i].icon.desc[j].value)) {
            return false;
        }
      }

      for (var k = 0; k < this.iconsData[i].icon.head.length; k++) {
        if (this.iconsData[i].icon.head[k].lang == "" || 
          this.iconsData[i].icon.head[k].value == "" ||
          !StaticValidatorService.stringNotEmpty(this.iconsData[i].icon.head[k].value)) {
            return false;
        }
      }
    }
  
    return true;
  }

  getSupport() {
    var data = new Array<string>();
    
    if (this.iconsData.length == 0) data.push('icon list');

    for (var i = 0; i < this.iconsData.length; i++) {
      data.push('Icon ' + this.iconsData[i].icon.name);
      if (this.iconsData[i].icon.desc.length === 0) {
        data.push('- description list');
      }

      if (this.iconsData[i].icon.head.length === 0) {
        data.push('- header list');
      }

      for (var j = 0; j < this.iconsData[i].icon.desc.length; j++) {  
        if (this.iconsData[i].icon.desc[j].lang == "" || 
          this.iconsData[i].icon.desc[j].value == "" || 
          !StaticValidatorService.stringNotEmpty(this.iconsData[i].icon.desc[j].value)) {
            data.push('- description list');
            break;
        }
      }

      for (var k = 0; k < this.iconsData[i].icon.head.length; k++) {
        if (this.iconsData[i].icon.head[k].lang == "" || 
          this.iconsData[i].icon.head[k].value == "" ||
          !StaticValidatorService.stringNotEmpty(this.iconsData[i].icon.head[k].value)) {
            data.push('- header list');
            break;
        }
      }
    }
    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  addDescription(descriptionList: Array<Description>, icon: any, i: number) {
    this.iconsData.filter(data => data.icon.name == icon)[0].icon.desc = descriptionList;
    this.checkIfListIsFilled(descriptionList, "description", i);
  }

  addHeader(headerList: Array<Header>, icon: any, i: number) {
    this.iconsData.filter(data => data.icon.name == icon)[0].icon.head = headerList;
    this.checkIfListIsFilled(headerList, "header", i);
  }

  getDescription(icon: any): Array<Description> {
    return this.iconsData.filter(data => data.icon.name == icon)[0].icon.desc;
  }

  getHeader(icon: any): Array<Header> {
    return this.iconsData.filter(data => data.icon.name == icon)[0].icon.head;
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
      title: this.cardsControl.titleCase("Privacy Icons"),
      infoText: textCreator.getText("policyIcons")
    }
    this.matDialog.open(InfoComponent, {data: data});
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
}
