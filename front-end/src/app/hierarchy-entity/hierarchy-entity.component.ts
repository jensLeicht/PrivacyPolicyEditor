import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { HierarchyEntity } from '../model/lpl/objects';

@Component({
  selector: 'app-hierarchy-entity',
  templateUrl: './hierarchy-entity.component.html',
  styleUrls: ['./hierarchy-entity.component.scss']
})
export class HierarchyEntityComponent implements OnInit {

  @Input() dataObj!: any;
  @Output() newItemEvent = new EventEmitter<Array<HierarchyEntity>>();

  frmHe = this.fb.group({
    hes: this.fb.array([])
  });

  elv = [
    {header:"El", show: [{t: -1, show: false}] }
  ];

  heList = new Array<HierarchyEntity>();
  outpuHeList = new Array<HierarchyEntity>();

  constructor(private fb:FormBuilder) {
  }

  ngOnInit(): void {
    if (this.dataObj.length > 0) {
      this.heList = this.dataObj;
    }

    if (this.heList.length == 0) {
      this.addHe();
    } else {
      this.heList.forEach(data => {
        const heForm = this.fb.group({
          value: [data.value, Validators.required]
        })
        this.hes.push(heForm);
      });
    }
    this.fill(this.hes, "El");
    this.onChanges();
  }

  onChanges(): void {
    this.hes.valueChanges.subscribe(val => {
      this.outpuHeList = new Array<HierarchyEntity>();

      for (var i = 0; i < val.length; i++) {
        var he = new HierarchyEntity();
        he.value = val[i].value;

        this.outpuHeList.push(he); 
      }
      this.newItemEvent.emit(this.outpuHeList);
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

  get hes() {
    return this.frmHe.controls["hes"] as FormArray;
  }

  addHe() {
    const heForm = this.fb.group({
        value: ["", Validators.required]
    });
    this.hes.push(heForm);
    this.fill(this.hes, "El");
  }

  deleteHe(index: number) {
    this.updateData();
    this.hes.removeAt(index);
    this.heList.splice(index, 1);
    this.outpuHeList.slice(index, 1);
  }

  isDataComplete(): boolean {
    for (var i = 0; i < this.hes.value.length; i++) {
      if (this.hes.value[i].value == "") {
        return false;
      }
    }
    return true;
  }

  updateData() {
    this.heList = [];
    for (var i = 0; i < this.hes.controls.length; i++) {
      var heData: HierarchyEntity = {... new HierarchyEntity(), ...this.hes.controls[i].value};

      var heObj = new HierarchyEntity();
      heObj = heData;
      this.heList.push(heObj);
    }
  }

  getBoxText(i: number): string {
    const name = this.frmHe.value.hes.map((d: { value: any; }) => d.value)[i];
    if (name) {
      return name;
    } else return "Hierarchy entity " + (i + 1);
  }
}