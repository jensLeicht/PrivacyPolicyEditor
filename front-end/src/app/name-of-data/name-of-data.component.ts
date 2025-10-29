import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NameOfData } from '../model/lpl/objects';

@Component({
  selector: 'app-name-of-data',
  templateUrl: './name-of-data.component.html',
  styleUrls: ['./name-of-data.component.scss']
})
export class NameOfDataComponent implements OnInit {

  @Input() dataObj!: any;
  @Output() newItemEvent = new EventEmitter<Array<NameOfData>>();

  nameOfDataList = new Array<string>();
  data = new Array<any>();

  // selectedData = new Array<NameOfData>();

  selectedOptions = new FormControl();

  constructor() {
  }

  ngOnInit(): void {
    if (this.dataObj.nameOfDataList.length > 0) {
      this.nameOfDataList = this.dataObj.nameOfDataList.map((n: { name: any; }) => n.name);
    }

    if (this.dataObj.dataList.length > 0) {
      for (var i = 0; i < this.dataObj.dataList.length; i++) {
        this.data.push({value: this.dataObj.dataList[i].name, viewValue: this.dataObj.dataList[i].name});
      }
    }

    this.selectedOptions = new FormControl(this.nameOfDataList);
    this.selectedOptions.markAllAsTouched();

    this.onChanges();
  }

  onChanges(): void {
    this.selectedOptions.valueChanges.subscribe(val => {
      var nodList = new Array<NameOfData>();
      for (var i = 0; i < val.length; i++) {
        var nodObj = new NameOfData();
        nodObj.name = val[i];
        nodList.push(nodObj);
      }
      // this.selectedData = nodList;
      this.newItemEvent.emit(nodList);
    });
  }

  // isDataComplete(): boolean {
  //   return this.selectedData.length > 0;
  // }

}
