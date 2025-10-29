import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, Optional, Inject } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Description } from '../model/lpl/ui-element';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ui-description',
  templateUrl: './ui-description.component.html',
  styleUrls: ['./ui-description.component.scss'],
  animations: [
    trigger('openClose', [
      state('open', style({
        height: '100px',
        opacity: 1,
      })),
      state('closed', style({
        height: '0px',
        opacity: 0,
      })),
      transition('open => closed', animate('0.2s')),
      transition('closed => open', animate('0.2s'))
    ])
  ]
})
export class UiDescriptionComponent implements OnInit {

  @Input() descriptions!: any;
  @Input() language!: any;
  @Input() disabled: boolean = false;
  @Output() event = new EventEmitter<Array<Description>>();

  frmDesc = this.fb.group({
    descs: this.fb.array([])
  });

  descList = new Array<Description>();

  descData = new Array<Description>();

  lang = new Array<any>();

  elv = [
    { header: "El", show: [{ t: -1, show: false }] }
  ];

  constructor(private fb: FormBuilder,
    private matDialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.lang = data.languageList;
  }

  ngOnInit(): void {
    this.descData = this.descriptions ? this.descriptions : new Array<Description>();

    if (!this.disabled) {
      if (this.descData.length == 0) {
        this.addDesc();
      } else {
        this.descData.forEach(desc => {
          const descForm = this.fb.group({
            lang: [desc.lang, Validators.required],
            value: [{ value: desc.value, disabled: this.disabled }, [Validators.required, Validators.pattern(/\S/)]]
          });
          this.descs.push(descForm);
        });
        this.language = '';
      }
      this.fill(this.descs, "El");
      this.onChanges();
    }
  }

  onChanges(): void {
    this.descs.valueChanges.subscribe(val => {
      var descrList = new Array<Description>();
      for (var i = 0; i < val.length; i++) {
        var descr = new Description();
        descr.lang = !val[i].lang ? "" : val[i].lang;
        descr.value = val[i].value;
        descrList.push(descr);
      }
      this.event.emit(descrList);
    });
    this.frmDesc.markAllAsTouched();
  }

  get descs() {
    return this.frmDesc.controls["descs"] as FormArray;
  }

  addDesc() {
    const descForm = this.fb.group({
      lang: [this.language == "" && this.descs.length == 0 ? "en" : this.language, Validators.required],
      value: ['', [Validators.required, Validators.pattern(/\S/)]]
    });
    this.descs.push(descForm);
    this.language = '';
    this.fill(this.descs, "El");
    this.frmDesc.markAllAsTouched();
  }

  fill(data: any, label: string) {
    var toShow = true;
    if (data.length > 1 && this.descriptionIsFilled(data.length - 1)) {
      toShow = false;
    }
    for (var t = 0; t < data.length; t++) {
      var tab = { t: t, show: toShow };
      this.elv.find(e => e.header == label)?.show.push(tab);
      if (this.show('El', t) && t < data.length - 1) {
        this.viewList('El', t);
      }

    }
  }

  viewList(tab: any, t: number) {
    let currentTab = this.elv.find(t => t.header == tab)!;
    currentTab.show.find(s => s.t == t)!.show = !currentTab.show.find(s => s.t == t)!.show;
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  isComplete(t: number): boolean {
    return this.descs.at(t).valid;
  }

  deleteDesc(descIndex: number) {
    const message = "Are you sure you want to delete the following description?<br><br><b>" + this.getBoxText(descIndex) + "</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Description\" Deletion ", message);
    var confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteDesc(descIndex);
      }
    });
  }

  actuallyDeleteDesc(descIndex: number) {
    this.descs.removeAt(descIndex);
    if (this.descs.length == 0) {
      this.addDesc();
    }
  }

  descriptionIsFilled(i: number): boolean {
    if (this.descData[i]) {
      var header = this.descData[i];
      return header.lang !== '' && header.value.length > 0;
    }
    return false;
  }

  isOptionDisabled(value: string, index: number): boolean {
    const dFormArray = this.frmDesc.value.descs.map((p: { lang: any; }) => p.lang) as readonly string[];
    const foundIndex = dFormArray.findIndex(e => e === value);
    return foundIndex !== -1 && foundIndex !== index;
  }

  getBoxText(i: number): string {
    const lang = this.frmDesc.value.descs.map((p: { lang: any; }) => p.lang)[i];
    if (lang) {
      const searchArray = this.lang.map(val => val.value);
      const foundIndex = searchArray.indexOf(lang);
      var elem = document.getElementById('headline');
      var width = 0;
      if (elem) {
        width = Math.floor(elem.getBoundingClientRect().width);
        width = Math.floor((width - this.getTextWidth(this.lang[foundIndex].viewValue) - 48) / 8);
      }
      var content = this.descs.at(i).value.value;
      if (content.length > width + 32) {
        content = content.slice(0, width) + " ...";
      }
      return this.lang[foundIndex].viewValue + ": " + content;
    } else {
      var elem = document.getElementById('headline');
      var width = 0;
      if (elem) {
        width = Math.floor(elem.getBoundingClientRect().width);
        width = Math.floor((width - this.getTextWidth("Language *") - 48) / 8);
      }
      var content = this.descs.at(i).value.value;
      if (content.length > width + 20) {
        content = content.slice(0, width) + " ...";
      }
      return "Language *: " + content;
    }
  }

  private getTextWidth(text: string): number {
    let canvas = document.createElement("canvas");
    let context = canvas.getContext("2d");
    if (context) {
      context.font = "Helvetica Neue";
      let metrics = context.measureText(text);
      return metrics.width;
    }
    return 0;
  }

  getLang(lang: string): string {
    return this.lang.find(elem => elem.value === lang).viewValue;
  }

}