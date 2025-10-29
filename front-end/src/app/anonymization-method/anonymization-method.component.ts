import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AnonymizationMethod, AnonymizationMethodAttribute, HierarchyEntity } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';
import { StaticValidatorService } from '../service/static-validator.service';

@Component({
  selector: 'app-anonymization-method',
  templateUrl: './anonymization-method.component.html',
  styleUrls: ['./anonymization-method.component.scss']
})
export class AnonymizationMethodComponent implements OnInit {

  @Input() inputObj!: any;
  @Input() language!: any;
  @Output() newItemEvent = new EventEmitter<AnonymizationMethod>();
  
  headerList = new Array<Header>();
  descriptionList = new Array<Description>();

  name = "";
  hierarchyEntity = new Array<HierarchyEntity>();
  attribute = new Array<AnonymizationMethodAttribute>();

  hierarchyEntityIsClicked = false;
  hierarchyEntityIsFilled = false;

  attributeIsClicked = false;
  attributeIsFilled = false;

  descriptionIsClicked = true;
  headerIsClicked = true;

  descriptionIsFilled = false;
  headerIsFilled = false;

  constructor() { }

  ngOnInit(): void {
    this.name = this.inputObj.anonymizationMethod.name;

    this.descriptionList = this.inputObj.anonymizationMethod.desc;
    this.headerList = this.inputObj.anonymizationMethod.head;
    this.hierarchyEntity = this.inputObj.anonymizationMethod.hierarchyEntityList;
    this.attribute = this.inputObj.anonymizationMethod.anonymizationMethodAttributeList;

    this.descriptionIsFilled = this.checkIfListIsFilled(this.descriptionList, "description");
    this.headerIsFilled = this.checkIfListIsFilled(this.headerList, "header");
    this.hierarchyEntityIsFilled = this.checkIfHierarchyEtityIsFilled(this.hierarchyEntity);
    this.attributeIsFilled = this.checkIfAttributeIsFilled(this.attribute);
  }

  dataChanged(event: any, label: string) {
    switch (label) {
      case 'name':
        this.name = event;
        break;
      default:
        break;
    }
    this.newItemEvent.emit(this.createAm());
  }

  createAm(): AnonymizationMethod {
    var am = new AnonymizationMethod();
    am.name = this.name;

    am.desc = this.descriptionList;
    am.head = this.headerList;
    am.hierarchyEntityList = this.hierarchyEntity;
    am.anonymizationMethodAttributeList = this.attribute;

    return am;
  }

  addDescription(descriptionList: Array<Description>) {
    this.descriptionList = descriptionList;
    this.descriptionIsFilled = this.checkIfListIsFilled(descriptionList, "description");
    this.newItemEvent.emit(this.createAm());
  }

  addHeader(headerList: Array<Header>) {
    this.headerList = headerList;
    this.headerIsFilled = this.checkIfListIsFilled(headerList, "header");
    this.newItemEvent.emit(this.createAm());
  }

  addHierarchyEntity(hierarhyEntityList: Array<HierarchyEntity>) {
    this.hierarchyEntity = hierarhyEntityList;
    this.hierarchyEntityIsFilled = this.checkIfHierarchyEtityIsFilled(hierarhyEntityList);
    this.newItemEvent.emit(this.createAm());
  }

  addAttribute(attribute: Array<AnonymizationMethodAttribute>) {
    this.attribute = attribute;
    this.attributeIsFilled = this.checkIfAttributeIsFilled(attribute);
    this.newItemEvent.emit(this.createAm());
  }

  checkIfHierarchyEtityIsFilled(hierarhyEntityList: Array<HierarchyEntity>): boolean {
    var res = true;
    for (var i = 0; i < hierarhyEntityList.length; i++) {
      var he = new HierarchyEntity(hierarhyEntityList[i]);
      res = res && (he.isComplete() || he.isEmpty());
    }
    return res;
  }

  isHierarchyEmpty(): boolean {
    var res = true;
    this.hierarchyEntity.forEach(h => {
      var he = new HierarchyEntity(h);
      res = res && h.isEmpty();
    });
    return res;
  }

  checkIfAttributeIsFilled(attribute: Array<AnonymizationMethodAttribute>): boolean {
    var res = true;
    for (var i = 0; i < attribute.length; i++) {
      var at = new AnonymizationMethodAttribute(attribute[i]);
      res = res && (at.isComplete() || at.isEmpty());
    }
    return res;
  }

  isAttributeEmpty(): boolean {
    var res = true;
    this.attribute.forEach(a => {
      var at = new AnonymizationMethodAttribute(a);
      res = res && at.isEmpty();
    });
    return res;
  }

  checkIfListIsFilled(list: Array<any>, label: string): boolean {
    if (list.length == 0) return false;
    var res = true;
    for (var i = 0; i < list.length; i++) {
      if (list[i].lang == '' || list[i].value == ''
        || !StaticValidatorService.stringNotEmpty(list[i].value)) {
        return false;
      }
    }
    return res;
  }

  clickDescription(): void {
    if (this.descriptionIsClicked) {
      this.descriptionIsClicked = false;
    } else {
      this.descriptionIsClicked = true;
    }
  }

  clickHeader(): void {
    if (this.headerIsClicked) {
      this.headerIsClicked = false;
    } else {
      this.headerIsClicked = true;
    }
  }

  clickEntityHierarchy(): void {
    if (this.hierarchyEntityIsClicked) {
      this.hierarchyEntityIsClicked = false;
    } else {
      this.hierarchyEntityIsClicked = true;
    }
  }

  clickAttribute(): void {
    if (this.attributeIsClicked) {
      this.attributeIsClicked = false;
    } else {
      this.attributeIsClicked = true;
    }
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

  getAMAttrTooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit anonymization method attribute";
    } else {
      return "Click to hide anonymization method attribute";
    }
  }

  getHETooltipText(clicked: boolean): string {
    if (!clicked) {
      return "Expand to edit hierarchy entity";
    } else {
      return "Click to hide hierarchy entity";
    }
  }
}
