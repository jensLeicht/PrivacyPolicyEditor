import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output, Optional, Inject, ChangeDetectorRef } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Header } from '../model/lpl/ui-element';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-ui-header',
  templateUrl: './ui-header.component.html',
  styleUrls: ['./ui-header.component.scss'],
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
export class UiHeaderComponent implements OnInit {

  elv = [
    { header: "El", show: [{ t: -1, show: false }] }
  ];

  @Input() headers!: any;
  @Input() language!: any;
  @Input() disabled: boolean = false;
  @Output() event = new EventEmitter<Array<Header>>();

  frmHeader = this.fb.group({
    hs: this.fb.array([])
  });

  headerList = new Array<Header>();

  headerData = new Array<Header>();

  lang = new Array<any>();

  constructor(private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private matDialog: MatDialog,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.lang = data.languageList;
  }

  ngOnInit(): void {
    this.headerData = this.headers ? this.headers : new Array<Header>();
    if (!this.disabled) {
      if (this.headerData.length == 0) {
        this.addHeader();
      } else {
        this.headerData.forEach(h => {
          const headerForm = this.fb.group({
            lang: [h.lang, Validators.required],
            value: [h.value, [Validators.required, Validators.pattern(/\S/)]]
          });
          this.hs.push(headerForm);
        });
        this.language = '';
      }
      this.fill(this.hs, "El");
      this.onChanges();
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
  }

  fill(data: any, label: string) {
    var toShow = true;
    if (data.length > 1 && this.headerIsFilled(data.length - 1)) {
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
    return this.hs.at(t).valid;
  }

  onChanges(): void {
    this.hs.valueChanges.subscribe(val => {
      var hList = new Array<Header>();
      for (var i = 0; i < val.length; i++) {
        var h = new Header();
        h.lang = !val[i].lang ? "" : val[i].lang;
        h.value = val[i].value;
        hList.push(h);
      }
      this.event.emit(hList);
    });
    this.frmHeader.markAllAsTouched();
  }

  headerIsFilled(i: number): boolean {
    if (this.headerData[i]) {
      var header = this.headerData[i];
      return header.lang !== '' && header.value.length > 0;
    }
    return false;
  }

  get hs() {
    return this.frmHeader.controls["hs"] as FormArray;
  }

  addHeader() {
    const headerForm = this.fb.group({
      lang: [this.language == "" && this.hs.length == 0 ? "en" : this.language, Validators.required],
      value: ['', [Validators.required, Validators.pattern(/\S/)]]
    });
    this.hs.push(headerForm);
    this.language = '';
    this.fill(this.hs, "El");
    this.frmHeader.markAllAsTouched();
  }

  deleteHeader(headerIndex: number) {
    const message = "Are you sure you want to delete the following title?<br><br><b>" + this.getBoxText(headerIndex) + "</b>";
    const dialogData = new ConfirmDialogModel("Confirm \"Title\" Deletion ", message);
    var confirmRef = this.matDialog.open(ConfirmDialogComponent, {
      maxWidth: "400px",
      maxHeight: "260px",
      data: dialogData,
      disableClose: true
    });
    confirmRef.afterClosed().subscribe(dialogResult => {
      if (dialogResult === 1) {
        this.actuallyDeleteHeader(headerIndex);
      }
    });
  }

  actuallyDeleteHeader(headerIndex: number) {
    this.hs.removeAt(headerIndex);
    if (this.hs.length == 0) {
      this.addHeader();
    }
  }

  isOptionDisabled(value: string, index: number): boolean {
    const dFormArray = this.frmHeader.value.hs.map((p: { lang: any; }) => p.lang) as readonly string[];
    const foundIndex = dFormArray.findIndex(e => e === value);
    return foundIndex !== -1 && foundIndex !== index;
  }

  getBoxText(i: number): string {
    const lang = this.frmHeader.value.hs.map((p: { lang: any; }) => p.lang)[i];
    if (lang) {
      const searchArray = this.lang.map(val => val.value);
      const foundIndex = searchArray.indexOf(lang);
      var elem = document.getElementById('headline');
      var width = 0;
      if (elem) {
        width = Math.floor(elem.getBoundingClientRect().width);
        width = Math.floor((width - this.getTextWidth(this.lang[foundIndex].viewValue) - 48) / 8);
      }
      var content = this.hs.at(i).value.value;
      if (content.length > width + 20) {
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
      var content = this.hs.at(i).value.value;
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