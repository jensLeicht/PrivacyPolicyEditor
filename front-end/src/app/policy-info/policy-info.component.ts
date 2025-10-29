import { Component, Inject, OnInit, Optional } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { Description, Header } from '../model/lpl/ui-element';
import { InfoText } from '../resources/info-text';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { CardsControlService } from '../service/cards-control.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { StaticValidatorService } from '../service/static-validator.service';

@Component({
  selector: 'app-policy-info',
  templateUrl: './policy-info.component.html',
  styleUrls: ['./policy-info.component.scss']
})
export class PolicyInfoComponent implements OnInit {

  frmPolicyName!: FormGroup;

  headerList: Array<Header>;
  descriptionList: Array<Description>;

  descriptionIsClicked = true;
  headerIsClicked = true;

  descriptionIsFilled = false;
  headerIsFilled = false;

  lang = new Array<any>();

  constructor(public matDialog: MatDialog,
    private cardsControl: CardsControlService,
    formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<PolicyInfoComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.descriptionList = data.currentLpp.desc;
    this.headerList = data.currentLpp.head;
    this.frmPolicyName = formBuilder.group({
      name: [data.currentLpp.name, [Validators.required, Validators.pattern(/\S/)]],
      lang: [data.currentLpp.lang, Validators.required],
      uri: [data.currentLpp.privacyPolicyUri],
      version: [data.currentLpp.version]
    });

    this.lang = data.languageList;

    this.checkIfListIsFilled(this.descriptionList, "description");
    this.checkIfListIsFilled(this.headerList, "header");

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
    this.frmPolicyName.markAllAsTouched();
  }

  isEdited(): boolean {
    if (!this.descriptionList.every(elem => this.data.currentLpp.desc.includes(elem)) ||
      !this.headerList.every(elem => this.data.currentLpp.head.includes(elem)) ||
      this.frmPolicyName.value.lang != this.data.currentLpp.lang ||
      this.frmPolicyName.value.name != this.data.currentLpp.name ||
      this.frmPolicyName.value.uri != this.data.currentLpp.privacyPolicyUri
    ) {
      return true;
    } else {  
      return false;
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

  checkIfListIsFilled(list: Array<any>, label: string): void {
    var isFilledOut = false;
    if (list.length > 0) {
      isFilledOut = true;
      for (var j = 0; j < list.length; j++) {      
        if (list[j].lang == '' || list[j].value == '' ||
          !StaticValidatorService.stringNotEmpty(list[j].value)) {
          isFilledOut = false;
          break;
        }
      }
    }
    
    if (label == "description") {
      this.descriptionIsFilled = isFilledOut;
    } else {
      this.headerIsFilled = isFilledOut;
    }
  }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
          this.close();
      }
    });
  }

  isDataComplete(): boolean {
    var fieldsAreFilled = true;
    for (var i = 0; i < this.headerList.length; i++) { 
      if (!(new Header(this.headerList[i])).isComplete()) {
        return false;
      }
    }
    for (var j = 0; j < this.descriptionList.length; j++) { 
      if (!(new Description(this.descriptionList[j])).isComplete()) {
        return false;
      }
    }

    if (!StaticValidatorService.stringNotEmpty(this.frmPolicyName.value.name)) {
      return false;
    }

    return this.headerList.length > 0 && this.descriptionList.length > 0 && fieldsAreFilled &&
      this.frmPolicyName.value.name && 
      this.frmPolicyName.value.lang &&
      StaticValidatorService.validateURL(this.frmPolicyName.value.uri);
  }

  getSupport() {
    var data = new Array<string>();

    if(!this.frmPolicyName.value.lang || !StaticValidatorService.stringNotEmpty(this.frmPolicyName.value.name) || !StaticValidatorService.validateURL(this.frmPolicyName.value.uri)) {
      data.push("<i>Policy Information:</i>");
    }

    if (!this.frmPolicyName.value.lang) {
      data.push("- language");
    }

    if (!StaticValidatorService.stringNotEmpty(this.frmPolicyName.value.name)) {
      data.push("- service name");
    }

    if(!StaticValidatorService.validateURL(this.frmPolicyName.value.uri)) {
      data.push("- policy URI");
    }

    if(!this.headerIsFilled || !this.descriptionIsFilled) {
      data.push("<i>UI-Representation:</i>");
    }

    if(!this.headerIsFilled) {
      data.push("- titles");
    }

    if(!this.descriptionIsFilled) {
      data.push("- descriptions");
    }

    this.matDialog.open(SaveMessageComponent, {data: data});
  }

  validateURL(url: any): boolean {
    return StaticValidatorService.validateURL(url);
  }

  cancel(): void {
    this.dialogRef.close({ event: 'cancel'});
  }

  save(): void {
    var res = {
      head: this.headerList,
      desc: this.descriptionList,
      genInfo: this.frmPolicyName.value
    }
    res.genInfo.lang = !res.genInfo.lang? "" : res.genInfo.lang;
    if (res.head.every((h: Header) => {h.isEmpty()})) {
      res.head = new Array<Header>();
    }
    if (res.desc.every((d: Description) => {d.isEmpty()})) {
      res.desc = new Array<Description>();
      console.log(res.desc);
    }
    this.dialogRef.close({ event: 'close', data: res });
  }

  addDescription(descriptionList: Array<Description>) {
    this.descriptionList = descriptionList;
    this.checkIfListIsFilled(descriptionList, "description");
  }

  addHeader(headerList: Array<Header>) {
    this.headerList = headerList;
    this.checkIfListIsFilled(headerList, "header");
  }

  clickDescription(): void {
    if (this.descriptionIsClicked == true) {
      this.descriptionIsClicked = false;
    } else {
      this.descriptionIsClicked = true;
    }
  }

  clickHeader(): void {
    if (this.headerIsClicked == true) {
      this.headerIsClicked = false;
    } else {
      this.headerIsClicked = true;
    }
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Essential Information"),
      infoText: textCreator.getText("info")
    }
    this.matDialog.open(InfoComponent, {data: data});
  }

  getHeaderTooltipText(): string {
    if (!this.headerIsClicked) {
      return "Expand to edit titles";
    } else {
      return "Click to hide titles";
    }
  }

  getDescTooltipText(): string {
    if (!this.descriptionIsClicked) {
      return "Expand to edit descriptions";
    } else {
      return "Click to hide descriptions";
    }
  }
}
