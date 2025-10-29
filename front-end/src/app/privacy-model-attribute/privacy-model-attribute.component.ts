import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { PrivacyModelAttribute } from '../model/lpl/objects';
import { StaticValidatorService } from '../service/static-validator.service';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-model-attribute',
  templateUrl: './privacy-model-attribute.component.html',
  styleUrls: ['./privacy-model-attribute.component.scss']
})
export class PrivacyModelAttributeComponent implements OnInit {

  @Input() dataObj!: Array<PrivacyModelAttribute>;
  @Input() model!: any;
  @Input() matDialog!: MatDialog;
  @Output() newItemEvent = new EventEmitter<Array<PrivacyModelAttribute>>();

  frmAma = this.fb.group({
    amas: this.fb.array([])
  });

  amaList = new Array<PrivacyModelAttribute>();

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    // if (this.dataObj.length > 0) {
      this.amaList = this.dataObj;
    // }

    if (this.amaList.length == 0) {
      this.addAma();
    } else {
      this.amaList.forEach(data => {
        const heForm = this.fb.group({
          key: [data.key, [Validators.required, Validators.pattern(/\S/)]],
          value: [data.value, [Validators.required, Validators.pattern(/\S/)]]
        })
        this.amas.push(heForm);
      });
    }
    this.fill(this.amas, "El");
    this.frmAma.markAllAsTouched();
    this.onChanges();
  }

  onChanges(): void {
    this.amas.valueChanges.subscribe(val => {
      this.updateData();
      this.newItemEvent.emit(this.amaList);
    });
  }

  get amas() {
    return this.frmAma.controls["amas"] as FormArray;
  }

  addAma() {
    var key = '';
    if (this.model === 'l-Diversity') {
      key = 'l';
    } else if (this.model == 'k-Anonymity') {
      key = 'k';
    }
    const amaForm = this.fb.group({
        key: [key, [Validators.required, Validators.pattern(/\S/)]],
        value: ["", [Validators.required, Validators.pattern(/\S/)]]
    });
    this.amas.push(amaForm);
    this.fill(this.amas, "El");
    this.frmAma.markAllAsTouched();
    this.updateData();
  }

  deleteAma(index: number) {
    const message = "Are you sure you want to delete the following Privacy Model Attribute?<br><br><b>" + this.getBoxText(index)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Privacy Model Attribute\" Deletion ",message);
    var  confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "290px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteAma(index);
      }
    });
  }

  actuallyDeleteAma(index: number) {
    this.amas.removeAt(index);
    this.amaList.splice(index, 1);
    this.updateData();
    if (this.amaList.length == 0) {
      this.addAma();
    }
  }

  fill(data: any, label: string) {
    for (var t = 0; t < data.length; t++) {
      var tab = {t: t, show: false};
      this.elv.find(e => e.header == label)?.show.push(tab);
    }
  }

  viewList(tab: any, t: number) {
    let currentTab = this.elv.find(t => t.header == tab)!;
    currentTab.show.find(s => s.t == t)!.show = !currentTab.show.find(s => s.t == t)!.show;
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.amas.value.length; i++) {
      if (!StaticValidatorService.stringNotEmpty(this.amas.value[i].key) || !StaticValidatorService.stringNotEmpty(this.amas.value[i].value)) {
        return false;
      }
    }
    return true;
  }

  isAttributeComplete(i:number): boolean {
    return this.amaList[i].isComplete();
  }

  isAttributeEmpty(i:number): boolean {
    return this.amaList[i].isEmpty();
  }

  updateData() {
    this.amaList = [];
    for (var i = 0; i < this.amas.controls.length; i++) {
      var amaData = new PrivacyModelAttribute();
      Object.assign(amaData, this.amas.controls[i].value);
      this.amaList.push(amaData);
    }
  }

  getBoxText(i: number): string {
    const name = this.frmAma.value.amas.map((d: { key: any; }) => d.key)[i];
    if (name) {
      return name;
    } else return "Privacy Model Attribute " + (i + 1);
  }

}
