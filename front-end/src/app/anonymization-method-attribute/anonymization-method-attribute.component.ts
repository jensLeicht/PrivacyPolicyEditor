import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { AnonymizationMethodAttribute } from '../model/lpl/objects';

@Component({
  selector: 'app-anonymization-method-attribute',
  templateUrl: './anonymization-method-attribute.component.html',
  styleUrls: ['./anonymization-method-attribute.component.scss']
})
export class AnonymizationMethodAttributeComponent implements OnInit {

  @Input() dataObj!: any;
  @Output() newItemEvent = new EventEmitter<Array<AnonymizationMethodAttribute>>();

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  frmAma = this.fb.group({
    amas: this.fb.array([])
  });

  amaList = new Array<AnonymizationMethodAttribute>();
  outpuAmaList = new Array<AnonymizationMethodAttribute>();

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    if (this.dataObj.length > 0) {
      this.amaList = this.dataObj;
    }

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
    this.onChanges();
  }

  onChanges(): void {
    this.amas.valueChanges.subscribe(val => {
      this.outpuAmaList = new Array<AnonymizationMethodAttribute>();

      for (var i = 0; i < val.length; i++) {
        var he = new AnonymizationMethodAttribute();
        he.key = val[i].key;
        he.value = val[i].value;

        this.outpuAmaList.push(he); 
      }
      this.newItemEvent.emit(this.outpuAmaList);
    });
  }

  get amas() {
    return this.frmAma.controls["amas"] as FormArray;
  }

  addAma() {
    const amaForm = this.fb.group({
        key: ["", [Validators.required, Validators.pattern(/\S/)]],
        value: ["", [Validators.required, Validators.pattern(/\S/)]]
    });
    this.amas.push(amaForm);
    this.fill(this.amas, "El");
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

  deleteAma(index: number) {
    this.updateData();
    this.amas.removeAt(index);
    this.amaList.splice(index, 1);
    this.outpuAmaList.slice(index, 1);
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.amas.value.length; i++) {
      if (this.amas.value[i].key == "" || this.amas.value[i].value == "") {
        return false;
      }
    }
    return true;
  }

  updateData() {
    this.amaList = [];
    for (var i = 0; i < this.amas.controls.length; i++) {
      var amaData: AnonymizationMethodAttribute = {... new AnonymizationMethodAttribute(), ...this.amas.controls[i].value};

      var amaObj = new AnonymizationMethodAttribute();
      amaObj = amaData;
      this.amaList.push(amaObj);
    }
  }

  getBoxText(i: number): string {
    const name = this.frmAma.value.amas.map((d: { key: any; }) => d.key)[i];
    if (name) {
      return name;
    } else return "Anonymization method attribute " + (i + 1);
  }

}
