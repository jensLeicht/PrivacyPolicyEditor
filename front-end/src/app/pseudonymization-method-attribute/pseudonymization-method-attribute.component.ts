import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { PseudonymizationMethodAttribute } from '../model/lpl/objects';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-pseudonymization-method-attribute',
  templateUrl: './pseudonymization-method-attribute.component.html',
  styleUrls: ['./pseudonymization-method-attribute.component.scss']
})
export class PseudonymizationMethodAttributeComponent implements OnInit {

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];
  
  @Input() dataObj!: Array<PseudonymizationMethodAttribute>;
  @Input() matDialog!: MatDialog;
  @Output() newItemEvent = new EventEmitter<Array<PseudonymizationMethodAttribute>>();

  frmAma = this.fb.group({
    amas: this.fb.array([])
  });

  amaList = new Array<PseudonymizationMethodAttribute>();

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
          key: [data.key, Validators.required],
          value: [data.value, Validators.required]
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

  get amas() {
    return this.frmAma.controls["amas"] as FormArray;
  }

  addAma() {
    const amaForm = this.fb.group({
        key: ["", Validators.required],
        value: ["", Validators.required]
    });
    this.amas.push(amaForm);
    this.fill(this.amas, "El");
    this.updateData();
    this.frmAma.markAllAsTouched();
  }

  deleteAma(index: number) {
    const message = "Are you sure you want to delete the following Pseudonymization Method Attribute?<br><br><b>" + this.getBoxText(index)+"</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Pseudonymization Method Attribute\" Deletion ",message);
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

  isDataComplete(): boolean {
    for (var i = 0; i < this.amas.value.length; i++) {
      if (this.amas.value[i].key == "" || this.amas.value[i].value == "") {
        return false;
      }
    }
    return true;
  }

  isPMAComplete(i:number):boolean {
    return this.amaList[i].isComplete() || this.amaList[i].isEmpty();
  }

  updateData() {
    this.amaList = [];
    for (var i = 0; i < this.amas.controls.length; i++) {
      var amaData = new PseudonymizationMethodAttribute();
      Object.assign(amaData,this.amas.controls[i].value);
      this.amaList.push(amaData);
    }
  }

  getBoxText(i: number): string {
    const name = this.frmAma.value.amas.map((d: { key: any; }) => d.key)[i];
    if (name) {
      return (name == ""? "Pseudonymization Method Attribute " + (i + 1) : name);;
    } else return "Pseudonymization Method Attribute " + (i + 1);
  }

}
