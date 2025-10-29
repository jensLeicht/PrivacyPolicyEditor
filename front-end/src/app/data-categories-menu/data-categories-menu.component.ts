import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { DataCategories } from '../enums/dataCategories';
import { Data, DataCategory } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';

@Component({
  selector: 'app-data-categories-menu',
  templateUrl: './data-categories-menu.component.html',
  styleUrls: ['./data-categories-menu.component.scss']
})
export class DataCategoriesMenuComponent implements OnInit {

  @Input() inputObj!: Array<Data>;
  @Input() index!: number;
  @Output() newItemEvent = new EventEmitter<Array<DataCategory>>();

  public dCategories = [
    {value: DataCategories[DataCategories.dc_account], viewValue: "Account", tip: "Information that identifies an individual's financial account, e.g., credit card number, bank account.", checked: false},
    {value: DataCategories[DataCategories.dc_authenticating], viewValue: "Authenticating", tip: "Information used to authenticate an individual with something they know, e.g., passwords, PIN, mother's maiden name.", checked: false},
    {value: DataCategories[DataCategories.dc_behavioral], viewValue: "Behavioral", tip: "Information that describes an individual's behavior or activity, e.g., browsing behavior, call logs, links clicked, demeanor, attitude.", checked: false},
    {value: DataCategories[DataCategories.dc_communication], viewValue: "Communication", tip: "Information communicated from or to an individual, e.g., telephone recordings, voice mail, email.", checked: false},
    {value: DataCategories[DataCategories.dc_computer], viewValue: "Computer Device", tip: "Information about a device that an individual uses for personal use (even part-time or with others), e.g., IP address, Mac address, browser fingerprint.", checked: false},
    {value: DataCategories[DataCategories.dc_contact], viewValue: "Contact", tip: "Information that provides a mechanism for contacting an individual, e.g., email address, physical address, telephone number.", checked: false},
    {value: DataCategories[DataCategories.dc_credit], viewValue: "Credit", tip: "Information about an individual's reputation with regards to money, e.g., credit records, credit worthiness, credit standing, credit capacity.", checked: false},
    {value: DataCategories[DataCategories.dc_criminal], viewValue: "Criminal", tip: "Information about an individual's criminal activity, e.g., convictions, charges, pardons.", checked: false},
    {value: DataCategories[DataCategories.dc_demographic], viewValue: "Demographic", tip: "Information that describes an individual's characteristics shared with others, e.g., age ranges, physical traits, income brackets, geographic.", checked: false},
    {value: DataCategories[DataCategories.dc_derived], viewValue: "Derived Personal Data", tip: "Derived data is data that is obtained or derived from other data.", checked: false},
    {value: DataCategories[DataCategories.dc_ethnicity], viewValue: "Ethnicity", tip: "Information that describes an individual's origins and lineage, e.g., race, national or ethnic origin, languages spoken, dialects, accents.", checked: false},
    {value: DataCategories[DataCategories.dc_family], viewValue: "Family", tip: "Information about an individual's family and relationships, e.g., family structure, siblings, offspring, marriages, divorces, relationships.", checked: false},
    {value: DataCategories[DataCategories.dc_historical], viewValue: "Historical", tip: "Information about an individual's personal history, e.g., events that happened in a person's life, either to them or just around them which might have influenced them (WWII,9/11)", checked: false},
    {value: DataCategories[DataCategories.dc_identifying], viewValue: "Identifying", tip: "Information that uniquely or semi-uniquely identifies a specific individual, e.g., name, user-name, unique identifier, government issued identification, picture, biometric data.", checked: false},
    {value: DataCategories[DataCategories.dc_knowledge], viewValue: "Knowledge and Belief", tip: "Information about what a person knows or believes, e.g., religious beliefs, philosophical beliefs, thoughts, what they know and don't know, what someone thinks.", checked: false},
    {value: DataCategories[DataCategories.dc_location], viewValue: "Location", tip: "Information about an individual's location, e.g., country, GPS coordinates, room number.", checked: false},
    {value: DataCategories[DataCategories.dc_medical], viewValue: "Medical and Health", tip: "Information that describes an individual's health, medical conditions or health care, e.g., physical and mental health, drug test results, disabilities, family or individual health history, health records, blood type, DNA code, prescriptions.", checked: false},
    {value: DataCategories[DataCategories.dc_ownership], viewValue: "Ownership", tip: "Information about things an individual has owned, rented, borrowed, possessed, e.g., cars, houses, apartments, personal possessions.", checked: false},
    {value: DataCategories[DataCategories.dc_physical], viewValue: "Physical Characteristics", tip: "Information that describes an individual's physical characteristics, e.g., height, weight, age, hair color, skin tone, tattoos, gender, piercings.", checked: false},
    {value: DataCategories[DataCategories.dc_professional], viewValue: "Professional", tip: "Information about an individual's educational or professional career, e.g., job titles, salary, work history, school attended, employee files, employment history, evaluations, references, interviews, certifications, disciplinary actions.", checked: false},
    {value: DataCategories[DataCategories.dc_public], viewValue: "Public Life", tip: "Information about an individual's public life, e.g., character, general reputation, social status, marital status, religion, political affiliations, interactions, communications meta-data.", checked: false},
    {value: DataCategories[DataCategories.dc_sexual], viewValue: "Sexual", tip: "Information that describes an individual's sexual life, e.g., gender identity, preferences, proclivities, fetishes, history, etc.", checked: false},
    {value: DataCategories[DataCategories.dc_social], viewValue: "Social Network", tip: "Information about an individual's friends or social connections, e.g., friends, connections, acquaintances, associations, group membership.", checked: false},
    {value: DataCategories[DataCategories.dc_transactional], viewValue: "Transactional", tip: "Information about an individual's purchasing, spending, or income, e.g., purchases, sales, credit, income, loan records, transactions, taxes, purchases and spending habits.", checked: false},
    {value: DataCategories[DataCategories.dc_preference], viewValue: "Preference", tip: "Information about an individual's preferences or interests, e.g., opinions, intentions, interests, favorite foods, colors, likes, dislikes, music.", checked: false}
  ];

  descriptions: { [key: string]: string; } = {
    "dc_preference": "Information about an individual's preferences or interests, e.g., opinions, intentions, interests, favorite foods, colors, likes, dislikes, music.",
    "dc_transactional": "Information about an individual's purchasing, spending, or income, e.g., purchases, sales, credit, income, loan records, transactions, taxes, purchases and spending habits.", 
    "dc_social": "Information about an individual's friends or social connections, e.g., friends, connections, acquaintances, associations, group membership.",
    "dc_sexual": "Information that describes an individual's sexual life, e.g., gender identity, preferences, proclivities, fetishes, history, etc.",
    "dc_public": "Information about an individual's public life, e.g., character, general reputation, social status, marital status, religion, political affiliations, interactions, communications meta-data.",
    "dc_professional": "Information about an individual's educational or professional career, e.g., job titles, salary, work history, school attended, employee files, employment history, evaluations, references, interviews, certifications, disciplinary actions.",
    "dc_physical": "Information that describes an individual's physical characteristics, e.g., height, weight, age, hair color, skin tone, tattoos, gender, piercings.",
    "dc_ownership": "Information about things an individual has owned, rented, borrowed, possessed, e.g., cars, houses, apartments, personal possessions.",
    "dc_medical": "Information that describes an individual's health, medical conditions or health care, e.g., physical and mental health, drug test results, disabilities, family or individual health history, health records, blood type, DNA code, prescriptions.",
    "dc_location": "Information about an individual's location, e.g., country, GPS coordinates, room number.",
    "dc_knowledge": "Information about what a person knows or believes, e.g., religious beliefs, philosophical beliefs, thoughts, what they know and don't know, what someone thinks.",
    "dc_identifying": "Information that uniquely or semi-uniquely identifies a specific individual, e.g., name, user-name, unique identifier, government issued identification, picture, biometric data.",
    "dc_historical": "Information about an individual's personal history, e.g., events that happened in a person's life, either to them or just around them which might have influenced them (WWII,9/11)",
    "dc_family": "Information about an individual's family and relationships, e.g., family structure, siblings, offspring, marriages, divorces, relationships.",
    "dc_ethnicity": "Information that describes an individual's origins and lineage, e.g., race, national or ethnic origin, languages spoken, dialects, accents.",
    "dc_derived": "Derived data is data that is obtained or derived from other data.",
    "dc_demographic": "Information that describes an individual's characteristics shared with others, e.g., age ranges, physical traits, income brackets, geographic.",
    "dc_criminal": "Information about an individual's criminal activity, e.g., convictions, charges, pardons.",
    "dc_credit": "Information about an individual's reputation with regards to money, e.g., credit records, credit worthiness, credit standing, credit capacity.",
    "dc_contact": "Information that provides a mechanism for contacting an individual, e.g., email address, physical address, telephone number.",
    "dc_computer": "Information about a device that an individual uses for personal use (even part-time or with others), e.g., IP address, Mac address, browser fingerprint.",
    "dc_communication": "Information communicated from or to an individual, e.g., telephone recordings, voice mail, email.",
    "dc_behavioral":  "Information that describes an individual's behavior or activity, e.g., browsing behavior, call logs, links clicked, demeanor, attitude.",
    "dc_authenticating": "Information used to authenticate an individual with something they know, e.g., passwords, PIN, mother's maiden name.",
    "dc_account": "Information that identifies an individual's financial account, e.g., credit card number, bank account.",
  };

  dgData = new Array<DataCategory>();

  // descriptionIsClicked: Array<number> = [];
  // headerIsClicked: Array<number> = [];

  // descriptionIsFilled = Array<number>();
  // headerIsFilled = Array<number>();

  constructor() {}

  ngOnInit(): void {
    this.dgData = this.inputObj[this.index].dataCategoryList.map(x => Object.assign(new DataCategory(), x));
    this.dgData.forEach(dg => {
      var cd = this.dCategories.find(c => c.value == dg.name);
      if (cd) cd.checked = true;
    });
    // if(this.dgData) {
    //   for (var i = 0; i < this.dgData.length; i++) {
    //     if (this.dgData[i].DESC) {
    //       this.checkIfListIsFilled(this.dgData[i].DESC, "description", this.dCategories.findIndex(d => d.value == this.dgData[i].name));
    //     }
    //     if (this.dgData[i].HEAD) {
    //       this.checkIfListIsFilled(this.dgData[i].HEAD, "header", this.dCategories.findIndex(d => d.value == this.dgData[i].name));
    //     }
    //   }
    // }
  }

  // checkIfListIsFilled(list: Array<any>, label: string, i: number): void { 
  //   var isFilledOut = true;
  //   for (var j = 0; j < list.length; j++) {
  //     if (list[j].lang == '' || list[j].value == '') {
  //       isFilledOut = false;
  //       break;
  //     }
  //   }
  //   if (isFilledOut) {
  //     if (label == "description") {
  //       this.descriptionIsFilled.push(i);
  //     } else {
  //       this.headerIsFilled.push(i);
  //     }
  //   } else {
  //     if (label == "description") {
  //       if (this.descriptionIsFilled.includes(i)) this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== i)
  //     } else {
  //       if (this.headerIsFilled.includes(i)) this.headerIsFilled = this.headerIsFilled.filter(h => h !== i);
  //     }
  //   }
  // }

  // copyObjArray(arr: Array<Icon>): Array<Icon> {
  //   var res = new Array<Icon>();
  //   for (var i = 0; i < arr.length; i++) {     
  //     var iconObj = new Icon;
  //     var iconData = new IconData();
  //     iconData.name = arr[i].icon.name;

  //     var descrArray = new Array<Description>();
  //     for (var j = 0; j < arr[i].icon.DESC.length; j++) {
  //       var d = new Description();
  //       d.lang = arr[i].icon.DESC[j].lang;
  //       d.value = arr[i].icon.DESC[j].value;
  //       descrArray.push(d);
  //     }
  //     iconData.DESC = descrArray;

  //     var headArray = new Array<Header>();
  //     for (var j = 0; j < arr[i].icon.HEAD.length; j++) {
  //       var h = new Header();
  //       h.lang = arr[i].icon.HEAD[j].lang;
  //       h.value = arr[i].icon.HEAD[j].value;
  //       headArray.push(h);
  //     }
  //     iconData.HEAD = headArray;

  //     iconObj.icon = iconData;
  //     res.push(iconObj);
  //   }
  //   return res;
  // }

  toggle(event: any, icon: any, iconIndex: number): void {
    var ic = new DataCategory();
    ic.name = icon;
    ic.head = new Array<Header>();
    ic.desc = new Array<Description>();
    if (event.checked) {
      ic.desc.push(this.getDataCategoryDesc(icon));
      ic.head.push(this.getDataCategoryHeader(icon));
      this.dgData.push(ic);
      // this.headerIsFilled.push(iconIndex);
      // this.descriptionIsFilled.push(iconIndex);
      // this.newItemEvent.emit(this.dgData);
    } else {
      const removeIndex = this.dgData.findIndex( item => item.name === icon );
      this.dgData.splice(removeIndex, 1);
      // this.headerIsFilled = this.headerIsFilled.filter(h => h !== iconIndex);
      // this.descriptionIsFilled = this.descriptionIsFilled.filter(d => d !== iconIndex);
    }
    this.newItemEvent.emit(this.dgData);
  }

  // addDescription(descriptionList: Array<Description>, icon: any, i: number) {
  //   this.dgData.filter(data => data.name == icon)[0].DESC = descriptionList;
  //   this.checkIfListIsFilled(descriptionList, "description", i);
  //   this.newItemEvent.emit(this.createGroup(i));
  // }

  // addHeader(headerList: Array<Header>, icon: any, i: number) {
  //   this.dgData.filter(data => data.name == icon)[0].HEAD = headerList;
  //   this.checkIfListIsFilled(headerList, "header", i);
  //   this.newItemEvent.emit(this.createGroup(i));
  // }

  // createGroup(i: number): Array<DataCategory> {
  //   return this.dgData;
  // }

  // getDescription(icon: any): Array<Description> {
  //   var desc = this.dgData.filter(data => data.name == icon)[0].DESC;
  //   if (desc.length == 0) {
  //     desc.push(this.dataService.getDataCategoryDesc(icon));
  //   }
  //   return desc;
  // }

  // getHeader(icon: any): Array<Header> {
  //   var head = this.dgData.filter(data => data.name == icon)[0].HEAD;
  //   if (head.length == 0) {
  //     head.push(this.dataService.getDataCategoryHeader(icon));
  //   }
  //   return head;
  // }

  // clickDescription(index: number): void {
  //   if (this.descriptionIsClicked.includes(index)) {
  //     this.descriptionIsClicked = this.descriptionIsClicked.filter(d => d !== index);
  //   } else {
  //     this.descriptionIsClicked.push(index);
  //   }
  // }

  // clickHeader(index: number): void {
  //   if (this.headerIsClicked.includes(index)) {
  //     this.headerIsClicked = this.headerIsClicked.filter(h => h !== index);
  //   } else {
  //     this.headerIsClicked.push(index);
  //   }
  // }

  // getHeaderTooltipText(clicked: boolean): string {
  //   if (!clicked) {
  //     return "Expand to edit header data";
  //   } else {
  //     return "Click to hide header data";
  //   }
  // }

  // getDescTooltipText(clicked: boolean): string {
  //   if (!clicked) {
  //     return "Expand to edit description data";
  //   } else {
  //     return "Click to hide description data";
  //   }
  // }

  // getTooltipText(i: any) {
  //   return this.descriptions[i] || "unknown error";
  //   // this.getDataCategoryDesc(i).value;
  // }

  getDataCategoryHeader(name: string): Header {
    var header = new Header();
    header.lang = 'en';
    switch (name) {
      case "dc_preference":
        header.value = "Preference";
        break;
      case "dc_transactional":
        header.value = "Transactional";
        break;
      case "dc_social":
        header.value = "Social Network";
        break;
      case "dc_sexual":
        header.value = "Sexual";
        break;
      case "dc_public":
        header.value = "Public Life";
        break;
      case "dc_professional":
        header.value = "Professional";
        break;
      case "dc_physical":
        header.value = "Physical Characteristics";
        break;
      case "dc_ownership":
        header.value = "Ownership";
        break;
      case "dc_medical":
        header.value = "Medical and Health";
        break;
      case "dc_location":
        header.value = "Location";
        break;
      case "dc_knowledge":
        header.value = "Knowledge and Belief";
        break;
      case "dc_identifying":
        header.value = "Identifying";
        break;
      case "dc_historical":
        header.value = "Historical";
        break;
      case "dc_family":
        header.value = "Family";
        break;
      case "dc_ethnicity":
        header.value = "Ethnicity";
        break;
      case "dc_derived":
        header.value = "Derived Personal Data";
        break;
      case "dc_demographic":
        header.value = "Demographic";
        break;
      case "dc_criminal":
        header.value = "Criminal";
        break;
      case "dc_credit":
        header.value = "Credit";
        break;
      case "dc_contact":
        header.value = "Contact";
        break;
      case "dc_computer":
        header.value = "Computer Device";
        break;
      case "dc_communication":
        header.value = "Communication";
        break;
      case "dc_behavioral":
        header.value = "Behavioral";
        break;
      case "dc_authenticating":
        header.value = "Authenticating";
        break;
      case "dc_account":
        header.value = "Account";
        break;  
      default:
        break;
    }
    return header;
  }

  getDataCategoryDesc(name: string): Description {
    var desc = new Description();
    desc.lang = 'en';
    switch (name) {
      case "dc_preference":
        desc.value = "Information about an individual's preferences or interests, e.g., opinions, intentions, interests, favorite foods, colors, likes, dislikes, music.";
        break;
      case "dc_transactional":
        desc.value = "Information about an individual's purchasing, spending, or income, e.g., purchases, sales, credit, income, loan records, transactions, taxes, purchases and spending habits.";
        break;
      case "dc_social":
        desc.value = "Information about an individual's friends or social connections, e.g., friends, connections, acquaintances, associations, group membership.";
        break;
      case "dc_sexual":
        desc.value = "Information that describes an individual's sexual life, e.g., gender identity, preferences, proclivities, fetishes, history, etc.";
        break;
      case "dc_public":
        desc.value = "Information about an individual's public life, e.g., character, general reputation, social status, marital status, religion, political affiliations, interactions, communications meta-data.";
        break;
      case "dc_professional":
        desc.value = "Information about an individual's educational or professional career, e.g., job titles, salary, work history, school attended, employee files, employment history, evaluations, references, interviews, certifications, disciplinary actions.";
        break;
      case "dc_physical":
        desc.value = "Information that describes an individual's physical characteristics, e.g., height, weight, age, hair color, skin tone, tattoos, gender, piercings.";
        break;
      case "dc_ownership":
        desc.value = "Information about things an individual has owned, rented, borrowed, possessed, e.g., cars, houses, apartments, personal possessions.";
        break;
      case "dc_medical":
        desc.value = "Information that describes an individual's health, medical conditions or health care, e.g., physical and mental health, drug test results, disabilities, family or individual health history, health records, blood type, DNA code, prescriptions.";
        break;
      case "dc_location":
        desc.value = "Information about an individual's location, e.g., country, GPS coordinates, room number.";
        break;
      case "dc_knowledge":
        desc.value = "Information about what a person knows or believes, e.g., religious beliefs, philosophical beliefs, thoughts, what they know and don't know, what someone thinks.";
        break;
      case "dc_identifying":
        desc.value = "Information that uniquely or semi-uniquely identifies a specific individual, e.g., name, user-name, unique identifier, government issued identification, picture, biometric data.";
        break;
      case "dc_historical":
        desc.value = "Information about an individual's personal history, e.g., events that happened in a person's life, either to them or just around them which might have influenced them (WWII,9/11)";
        break;
      case "dc_family":
        desc.value = "Information about an individual's family and relationships, e.g., family structure, siblings, offspring, marriages, divorces, relationships.";
        break;
      case "dc_ethnicity":
        desc.value = "Information that describes an individual's origins and lineage, e.g., race, national or ethnic origin, languages spoken, dialects, accents.";
        break;
      case "dc_derived":
        desc.value = "Derived data is data that is obtained or derived from other data.";
        break;
      case "dc_demographic":
        desc.value = "Information that describes an individual's characteristics shared with others, e.g., age ranges, physical traits, income brackets, geographic.";
        break;
      case "dc_criminal":
        desc.value = "Information about an individual's criminal activity, e.g., convictions, charges, pardons.";
        break;
      case "dc_credit":
        desc.value = "Information about an individual's reputation with regards to money, e.g., credit records, credit worthiness, credit standing, credit capacity.";
        break;
      case "dc_contact":
        desc.value = "Information that provides a mechanism for contacting an individual, e.g., email address, physical address, telephone number.";
        break;
      case "dc_computer":
        desc.value = "Information about a device that an individual uses for personal use (even part-time or with others), e.g., IP address, Mac address, browser fingerprint.";
        break;
      case "dc_communication":
        desc.value = "Information communicated from or to an individual, e.g., telephone recordings, voice mail, email.";
        break;
      case "dc_behavioral":
        desc.value = "Information that describes an individual's behavior or activity, e.g., browsing behavior, call logs, links clicked, demeanor, attitude.";
        break;
      case "dc_authenticating":
        desc.value = "Information used to authenticate an individual with something they know, e.g., passwords, PIN, mother's maiden name.";
        break;
      case "dc_account":
        desc.value = "Information that identifies an individual's financial account, e.g., credit card number, bank account.";
        break;  
      default:
        break;
    }
    return desc;
  }

}
