import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { EntityClassification } from '../enums/entityClassification';
import { EntityType } from '../enums/entityType';
import { Entity } from '../model/lpl/entity';
import { Description, Header } from '../model/lpl/ui-element';
import { StaticValidatorService } from '../service/static-validator.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-entity',
  templateUrl: './entity.component.html',
  styleUrls: ['./entity.component.scss']
})
export class EntityComponent implements OnInit {

  @Input() inputObj!: any;
  @Input() language!: any;
  @Input()
  config: {
    authEnabled: Boolean;
    classificationEnabled: Boolean;
  };
  @Output() newItemEvent = new EventEmitter<Entity>();
  
  frmEntity!: FormGroup;

  headerList = new Array<Header>();
  descriptionList = new Array<Description>();

  name = "";
  classification = "";
  authInfo = "";

  classificationList = [
    {value: EntityClassification[EntityClassification.Person], viewValue: 'Person'},
    {value: EntityClassification[EntityClassification['Legal Entity']], viewValue: 'Legal entity'},
    {value: EntityClassification[EntityClassification['Public Authority']], viewValue: 'Public authority'}
  ];

  typeList = [
    {value: EntityType[EntityType['Data Controller']], viewValue: 'Data Controller'},
    {value: EntityType[EntityType['Data Protection Officer']], viewValue: 'Data Protection Officer'},
    {value: EntityType[EntityType['Data Recipient']], viewValue: 'Data Recipient'},
    {value: EntityType[EntityType['Data Source']], viewValue: 'Data Source'},
    {value: EntityType[EntityType['Supervisory Authority']], viewValue: 'Supervisory Authority'}
  ];

  descriptionIsClicked = true;
  headerIsClicked = true;

  descriptionIsFilled = false;
  headerIsFilled = false;

  formBuilder: FormBuilder;

  constructor(formBuilder: FormBuilder) {
      this.formBuilder = formBuilder;
      this.config = {authEnabled: true, classificationEnabled: true};
    }

  ngOnInit(): void {
  if (!this.config.authEnabled) {
    console.log("Test");
    }

    this.name = this.inputObj.name;
    this.classification = this.inputObj.classification;
    this.authInfo = this.inputObj.authInfo;
    this.descriptionList = this.inputObj.desc;
    this.headerList = this.inputObj.head;

    this.frmEntity = this.formBuilder.group({
      name: [this.inputObj.name, [Validators.required, Validators.pattern(/\S/)]],
      authInfo: [this.inputObj.authInfo],
      classification: [this.inputObj.classification, Validators.required]
    });

    this.descriptionIsFilled = this.checkIfListIsFilled(this.descriptionList);
    this.headerIsFilled = this.checkIfListIsFilled(this.headerList);
    this.frmEntity.markAllAsTouched();
  }

  dataChanged(event: any, label: string) {
    switch (label) {
      case 'name':
        this.name = event;
        break;
     /*  case 'type':
        this.type = event;
        break; */
      case 'classification':
        this.classification = event;
        break;
      case 'authInfo':
        this.authInfo = event;
        break;
      default:
        break;
    }
    this.newItemEvent.emit(this.createEntity());
  }

  createEntity(): Entity {
    var entity = new Entity();
    entity.name = this.name;
    entity.authInfo = this.authInfo;
    entity.classification = this.classification;
    entity.desc = this.descriptionList;
    entity.head = this.headerList;
    return entity;
  }

  addDescription(descriptionList: Array<Description>) {
    this.descriptionList = descriptionList;
    this.descriptionIsFilled = this.checkIfListIsFilled(descriptionList);
    this.newItemEvent.emit(this.createEntity());
  }

  addHeader(headerList: Array<Header>) {
    this.headerList = headerList;
    this.headerIsFilled = this.checkIfListIsFilled(headerList);
    this.newItemEvent.emit(this.createEntity());
  }

  checkIfListIsFilled(list: Array<any>): boolean {
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

}
