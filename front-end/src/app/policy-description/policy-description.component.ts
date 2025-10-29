import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Description, Header, UIElement } from '../model/lpl/ui-element';

@Component({
  selector: 'app-policy-description',
  templateUrl: './policy-description.component.html',
  styleUrls: ['./policy-description.component.scss']
})
export class PolicyDescriptionComponent implements OnInit {

  headerList: Array<Header>;
  descriptionList: Array<Description>;

  constructor(public dialogRef: MatDialogRef<PolicyDescriptionComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.descriptionList = data.desc;
    this.headerList = data.head;
  }

  ngOnInit(): void {
  }

  addDescription(descriptionList: Array<any>) {
    this.descriptionList = descriptionList;
  }

  addHeader(headerList: Array<any>) {
    this.headerList = headerList;
  }

  isDataComplete(): boolean {
    var fieldsAreFilled = true;
    for (var i = 0; i < this.headerList.length; i++) { 
      if (this.headerList[i].lang == "" || this.headerList[i].value == "") {
        return false;
      }
    }
    for (var j = 0; j < this.descriptionList.length; j++) { 
      if (this.descriptionList[j].lang == "" || this.descriptionList[j].value == "") {
        return false;
      }
    }
    return this.headerList.length > 0 && this.descriptionList.length > 0 && fieldsAreFilled;
  }

  save(): void {
    var uiElement = new UIElement();
    uiElement.desc = this.descriptionList;
    uiElement.head = this.headerList;
    this.dialogRef.close({ event: 'close', data: uiElement });
  }

}
