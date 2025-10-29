import { Injectable } from '@angular/core';
import { LayeredPrivacyPolicy, UnderlyingLayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';
import { Controller, Data, DataProtectionOfficer, DataSubjectRight, DateSource, Icon, LodgeComplaint, Purpose } from '../model/lpl/objects';
import { Description, Header } from '../model/lpl/ui-element';

@Injectable({
  providedIn: 'root'
})
export class CardsControlService {

  constructor() { }

  createTree(list: Array<LayeredPrivacyPolicy>): LayeredPrivacyPolicy {
    var res: LayeredPrivacyPolicy = list.find(p => p.id == 0)!;
    var children = this.nest(list.filter(p => p.id !== res.id), res.id!);
    res.underlyingLayeredPrivacyPolicy = children;
		return res;
  }

  nest(items: Array<LayeredPrivacyPolicy>, id: number): Array<UnderlyingLayeredPrivacyPolicy> {
    return items
      .filter(item => item.parentId === id)
      .map(item => { 
        var underlyingLpp = new UnderlyingLayeredPrivacyPolicy();
        underlyingLpp.layeredPrivacyPolicy = item;
        underlyingLpp.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy = this.nest(items, item.id!);
        return underlyingLpp;
    });
  }

  createAllList(lpp: LayeredPrivacyPolicy): Array<LayeredPrivacyPolicy> {
    var res = new Array<LayeredPrivacyPolicy>();
    var children = lpp.underlyingLayeredPrivacyPolicy;
    lpp.underlyingLayeredPrivacyPolicy = new Array<UnderlyingLayeredPrivacyPolicy>();
    res.push(lpp);
    var rest = this.nestAllList(children);
    for (var i = 0; i < rest.length; i ++) {
      res.push(rest[i]);
    }
		return res;
  }

  nestAllList(items: Array<UnderlyingLayeredPrivacyPolicy>): Array<LayeredPrivacyPolicy> {
    var res = new Array<LayeredPrivacyPolicy>();
    for (var i = 0; i < items.length; i++) {
      var lpp = items[i].layeredPrivacyPolicy;
      var children = lpp.underlyingLayeredPrivacyPolicy;
      lpp.underlyingLayeredPrivacyPolicy = new Array<UnderlyingLayeredPrivacyPolicy>();
      res.push(lpp);

      var rest = this.nestAllList(children);
      for (var i = 0; i < rest.length; i ++) {
        res.push(rest[i]);
      }
    }
    return res;
  }

  mapLpp(list: LayeredPrivacyPolicy): LayeredPrivacyPolicy {
    delete list.id;
    delete list.parentId;
    var children = this.lppNest(list.underlyingLayeredPrivacyPolicy);
    list.underlyingLayeredPrivacyPolicy = children;
		return list;
  }

  lppNest(items: Array<UnderlyingLayeredPrivacyPolicy>): Array<UnderlyingLayeredPrivacyPolicy> {
    return items
      .map(item => { 
        delete item.layeredPrivacyPolicy.id;
        delete item.layeredPrivacyPolicy.parentId;
        item.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy = this.lppNest(item.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy);
        return item;
    });
  }

  mapLppProlog(list: any, allData: any): any {
		return {list, allData};
  }

  fillOutLpp(lpp: LayeredPrivacyPolicy): LayeredPrivacyPolicy {
    if (lpp.iconList == null) {
      lpp.iconList = new Array<Icon>();
    }
    if (lpp.dataSource == null) {
      lpp.dataSource = new DateSource();
    }
    if (lpp.purposeList == null) {
      lpp.purposeList = new Array<Purpose>();
    }
    if (lpp.controllerList == null) {
      lpp.controllerList = new Array<Controller>();
    }
    if (lpp.dataProtectionOfficerList == null) {
      lpp.dataProtectionOfficerList = new Array<DataProtectionOfficer>();
    }
    if (lpp.dataSubjectRightList == null) {
      lpp.dataSubjectRightList = new Array<DataSubjectRight>();
    }
    if (lpp.lodgeComplaint == null) {
      lpp.lodgeComplaint = new LodgeComplaint();
    }
    if (lpp.underlyingLayeredPrivacyPolicy == null) {
      lpp.underlyingLayeredPrivacyPolicy = new Array<UnderlyingLayeredPrivacyPolicy>();
    }
    if (lpp.head == null) {
      lpp.head = new Array<Header>();
    }
    if (lpp.desc == null) {
      lpp.desc = new Array<Description>();
    }
    return lpp;
  }

  makeDeepCopy(source: Array<LayeredPrivacyPolicy>): Array<LayeredPrivacyPolicy> {
    return source.map(x => Object.assign({}, x));
  }

  getALlData(lpp: Array<LayeredPrivacyPolicy>): Array<Data> {
    var res = new Array<Data>();
    var dataName = new Array<string>();
    var purposeLists = lpp.map(p => p.purposeList);
    for (var i = 0; i < purposeLists.length; i++) {
      for (var j = 0; j < purposeLists[i].length; j++) {
        for (var k = 0; k < purposeLists[i][j].dataList.length; k++) {
          var name = purposeLists[i][j].dataList[k].name;
          if (!dataName.includes(name)) {
            res.push(purposeLists[i][j].dataList[k]);
          }
        }
      }
    }
    return res;
  }

  getPolicyNames(lpp: LayeredPrivacyPolicy): Array<string> {
    var names = new Array<string>();
    names.push(lpp.name);
    var childrenNames = this.getChildrenName(lpp.underlyingLayeredPrivacyPolicy);
    return names.concat(childrenNames);
  }

  getChildrenName(items: Array<UnderlyingLayeredPrivacyPolicy>): Array<string> {
    return items
      .map(item => {
        this.getChildrenName(item.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy);
        return item.layeredPrivacyPolicy.name;
    });
  }

  titleCase(str: string) {
    var splitStr = str.toLowerCase().split(' ');
    for (var i = 0; i < splitStr.length; i++) {
        splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);     
    }
    return splitStr.join(' '); 
 }
}