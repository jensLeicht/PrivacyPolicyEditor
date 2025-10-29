import { Injectable } from '@angular/core';
import { LayeredPrivacyPolicy, UnderlyingLayeredPrivacyPolicy } from '../model/lpl/layered-privacy-policy';
import { AutomatedDecisionMaking, Controller, Data, DataProtectionOfficer, DataRecipient, DataSubjectRight, LegalBasis, LodgeComplaint, PrivacyModel, PseudonymizationMethod, Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { Header } from '../model/lpl/ui-element';
import { Description } from '../model/lpl/ui-element';
import { StaticValidatorService } from './static-validator.service';
import { pdfHeaderQueryCellInfo } from '@syncfusion/ej2-angular-grids';

@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor() { }

    isControllerDataComplete(controllers: Array<Controller>): boolean {
    var res: boolean = true;
    controllers.forEach(c => {
      res = res && (new Controller(c)).isComplete();
    });
    return res;  
  }

  isOfficerDataComplete(dpos: Array<DataProtectionOfficer>): boolean {
    var res = true;
    dpos.forEach(d => {
      res = res && (new DataProtectionOfficer(d)).isComplete();
    });
    return res;  
  }

  isDataSubjectRightsComplete(dsrs: Array<DataSubjectRight>): boolean {
    var res = true;
    if (dsrs.length == 0) {
      return false;
    }
    dsrs.forEach(d => {
      res = res && (new DataSubjectRight(d)).isComplete();
    });
    return res;  
  }

  idIsComplete(data: any): boolean {
    return data.email != '' &&
    StaticValidatorService.stringNotEmpty(data.email) && 
    StaticValidatorService.validateEmail(data.email);
  }

  isEntityComplete(data: any): boolean {
    return data.name != "" &&
    data.type != "" &&
    data.classification != "" &&
    data.desc &&
    data.head;
  }

  isHeaderComplete(header: Array<Header>): boolean {
    var ret = true;
    if (header.length > 0) {
      header.forEach(h => {
        ret = ret && (new Header(h)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isDescriptionComplete(description: Array<Description>): boolean {
    var ret = true;
    if (description.length > 0) {
      description.forEach(d => {
        ret = ret && (new Description(d)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isDataComplete(data: Array<Data>): boolean {
    var ret = true;
    if (data.length > 0) {
      data.forEach(d => {
        ret = ret && (new Data(d)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isDataRecipientComplete(dataRecipients: Array<DataRecipient>): boolean {
    var ret = true;
    if (dataRecipients.length > 0) {
      dataRecipients.forEach(d => {
        ret = ret && (new DataRecipient(d)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isPurposeComplete(purposes: Array<Purpose>): boolean {
    var ret = true;
    if (purposes.length > 0) {
      purposes.forEach(p => {
        ret = ret && (new Purpose(p)).isComponentComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isLegalBasisComplete(legalBases: Array<LegalBasis>): boolean {
    var ret = true;
    if (legalBases.length > 0) {
      legalBases.forEach(l => {
        ret = ret && (new LegalBasis(l)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isPrivacyModelComplete(models: Array<PrivacyModel>): boolean {
    var ret = true;
    if (models.length > 0) {
      models.forEach(p => {
        ret = ret && (new PrivacyModel(p)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isAutomatedDecisionMakingComplete(adm: Array<AutomatedDecisionMaking>): boolean {
    var ret = true;
    if (adm.length > 0) {
      adm.forEach(a => {
        ret = ret && (new AutomatedDecisionMaking(a)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isPseudonymizationMethodComplete(psm: Array<PseudonymizationMethod>): boolean {
    var ret = true;
    if (psm.length > 0) {
      psm.forEach(p => {
        ret = ret && (new PseudonymizationMethod(p)).isComplete();
      });
      return ret;
    } else {
      return false;
    }
  }

  isLegalBasisEmpty(legalBases: Array<LegalBasis>): boolean {
    var ret = true;
    if (legalBases.length > 0) {
      legalBases.forEach(l => {
        ret = ret && (new LegalBasis(l)).isEmpty();
      });
      return ret;
    } else {
      return ret;
    }
  }

  isPrivacyModelEmpty(models: Array<PrivacyModel>): boolean {
    var ret = true;
    if (models.length > 0) {
      models.forEach(p => {
        ret = ret && (new PrivacyModel(p)).isEmpty();
      });
      return ret;
    } else {
      return ret;
    }
  }

  isAutomatedDecisionMakingEmpty(adm: Array<AutomatedDecisionMaking>): boolean {
    var ret = true;
    if (adm.length > 0) {
      adm.forEach(a => {
        ret = ret && (new AutomatedDecisionMaking(a)).isEmpty();
      });
      return ret;
    } else {
      return ret;
    }
  }

  isPseudonymizationMethodEmpty(psm: Array<PseudonymizationMethod>): boolean {
    var ret = true;
    if (psm.length > 0) {
      psm.forEach(p => {
        ret = ret && (new PseudonymizationMethod(p)).isEmpty();
      });
      return ret;
    } else {
      return ret;
    }
  }

  isComponentReady(label: any, lpp: LayeredPrivacyPolicy, dataList: Array<Data>): boolean {
    var res = false;
    switch (label) {
      case 'controllerList':
        res = this.isControllerDataComplete(lpp.controllerList);
        break;
      case 'info':
        res = lpp.lang !== ""
        && StaticValidatorService.validateURL(lpp.privacyPolicyUri)
        && /\S/.test(lpp.name) 
        && this.isDescriptionComplete(lpp.desc) 
        && this.isHeaderComplete(lpp.head);
        break;  
      case 'desc':
        res = lpp.desc.length > 0 && lpp.head.length > 0;
        break;
      case 'dataProtectionOfficer':
        res = this.isOfficerDataComplete(lpp.dataProtectionOfficerList);
        break;
      case 'policyIcons':
        res = lpp.iconList.length > 0;
        break;  
      case 'dataSubjectRight':
        res = this.isDataSubjectRightsComplete(lpp.dataSubjectRightList);
        break; 
      case 'purpose':
        res = this.isPurposeComplete(lpp.purposeList);
        break; 
      case 'lodgeComplaint':
        res = (new LodgeComplaint(lpp.lodgeComplaint)).isComplete();
        break;  
      case 'dataList':
        res = this.isDataComplete(dataList);
        break; 
      case 'dataRecipientList':
        res = this.isDataRecipientComplete(lpp.completeDataRecipientList);
        break; 
      case 'purposeHierarchy':
        res = this.isPurposeHierarchyComplete(lpp.purposeHierarchy, lpp.purposeList);
        break;
      default:
        break;
    }
    return res;
  }

  isPurposeComponentReady(purpose: Purpose, label: string): boolean {
    var res = false;
    switch (label) {
      case 'dataList':
        res = purpose.dataList.length > 0;
        break;
      case 'dataRecipient':
        res = purpose.dataRecipientList.length > 0;
        break;  
      case 'retention':
        res = purpose.retention.isComplete();
        break;
      case 'legalBasisList':
        res = this.isLegalBasisComplete(purpose.legalBasisList);
        break;
      case 'privacyModelList':
        res = this.isPrivacyModelComplete(purpose.privacyModelList);
        break;  
      case 'automatedDecisionMakingList':
        res = this.isAutomatedDecisionMakingComplete(purpose.automatedDecisionMakingList);
        break; 
      case 'pseudonymizationMethodList':
        res = this.isPseudonymizationMethodComplete(purpose.pseudonymizationMethodList);
        break;
      default:
        break;
    }
    return res;
  }

  isPurposeComponentEmpty(purpose: Purpose, label: string): boolean {
    var res = true;
    switch (label) {
      case 'dataList':
        res = !(purpose.dataList.length > 0) || purpose.dataList.every(dt => {
          var data = new Data(dt);
          return data.isEmpty();
        });
        break;
      case 'dataRecipient':
        res = !(purpose.dataRecipientList.length > 0);
        break;  
      case 'retention':
        res = purpose.retention.isEmpty();
        break;
      case 'legalBasisList':
        res = this.isLegalBasisEmpty(purpose.legalBasisList);
        break;
      case 'privacyModelList':
        res = this.isPrivacyModelEmpty(purpose.privacyModelList);
        break;  
      case 'automatedDecisionMakingList':
        res = this.isAutomatedDecisionMakingEmpty(purpose.automatedDecisionMakingList);
        break; 
      case 'pseudonymizationMethodList':
        res = this.isPseudonymizationMethodEmpty(purpose.pseudonymizationMethodList);
        break;
      default:
        break;
    }
    return res;
  }

  isComponentFilled(label: any, lpp: LayeredPrivacyPolicy, dataList: Array<Data>): boolean {
    var res = false;
    switch (label) {
      case 'controllerList':
        if (lpp.controllerList.length > 0) {
          res = lpp.controllerList.some(c => !c.isEmpty());
        }
        break;
      case 'info':
        res = lpp.lang !== "" || lpp.name !== "" || lpp.desc.length > 0 || lpp.head.length > 0;
        break;
      case 'dataProtectionOfficer':
        if (lpp.dataProtectionOfficerList.length > 0) {
          res = lpp.dataProtectionOfficerList.some(c => !c.isEmpty());
        }
        break;
      case 'dataSubjectRight':
        if (lpp.dataSubjectRightList.length > 0) {
          res = lpp.dataSubjectRightList.some(c => !c.isEmpty());
        }
        break; 
      case 'purpose':
        if (lpp.purposeList.length > 0) {
          res = lpp.purposeList.some(c => !c.isEmpty());
        }
        break; 
      case 'lodgeComplaint':
          res = !lpp.lodgeComplaint.isEmpty();
        break;  
      case 'dataList':
        if (lpp.completeDataList.length > 0) {
          res = lpp.completeDataList.some(c => !c.isEmpty());
        }
        break;
      case 'dataRecipientList':
        if (lpp.completeDataRecipientList.length > 0) {
          res = lpp.completeDataRecipientList.some(c => !c.isEmpty());
        }
        break;
      case 'purposeHierarchy':
        if (lpp.purposeHierarchy.length > 0) {
          res = lpp.purposeHierarchy.some(c => !c.isEmpty());
        }
        break;
      default:
        break;
    }
    return res;
  }

  isPurposeHierarchyComplete(purposeHierarchy: PurposeHierarchyElement[], purposeList: Purpose[]): boolean {
    var res = true;
    purposeList.forEach(purpose => res = res && purposeHierarchy.find(elem => elem.subPurpose === purpose.name) != null);
    var potErrorPurposes = purposeList.filter(elem => purposeHierarchy.find(ph => ph.superPurpose === elem.name) != null);
    potErrorPurposes.forEach(elem => res = res && purposeHierarchy.filter(ph => ph.superPurpose === elem.name).length != 1);
    return res;
  }

  isLppComplete(lpp: LayeredPrivacyPolicy): boolean {
    var res = false;
      for (var x = 0; x < lpp.purposeList.length; x++) {
        if (lpp.purposeList[x].name === '' ||
        lpp.purposeList[x].desc.length === 0 ||
        lpp.purposeList[x].head.length === 0 ||
        lpp.purposeList[x].dataList.length === 0 ||
        lpp.purposeList[x].legalBasisList.length === 0 ||
        lpp.purposeList[x].retention.type === '') {
          res = false;
        } else {
          res = true;
        }
      }
    return res;
  }

  isLppReady(lpp: LayeredPrivacyPolicy): boolean {
    return this.isLppComplete(lpp) && this.nestIsLppComplete(lpp.underlyingLayeredPrivacyPolicy);
  }

  nestIsLppComplete(items: Array<UnderlyingLayeredPrivacyPolicy>): boolean {
    var res = true;
    items.map(item => {
      res = this.isLppComplete(item.layeredPrivacyPolicy) && this.nestIsLppComplete(item.layeredPrivacyPolicy.underlyingLayeredPrivacyPolicy);
    });
    return res;
  }

  buildWarnMessage(lpps: Array<LayeredPrivacyPolicy>): Array<string> {
    var message = new Array<string>();
    for (var i = 0; i < lpps.length; i++) {
      if (!this.isLppFilled(lpps[i])) {
        message = message.concat(this.getWarnText(lpps[i]));
      }
    }
    if (message.length > 0) {
      var start = ["The following information is missing:"];
      message = start.concat(message);
    }
    return message;
  }

  isLppFilled(lpp: LayeredPrivacyPolicy): boolean {
    return lpp.name != "" && lpp.lang != "" && 
      lpp.purposeList.length > 0 && lpp.controllerList.length > 0 && 
      lpp.dataSubjectRightList.length > 0 && lpp.lodgeComplaint.name != "" && this.isLppComplete(lpp);
  }

  getWarnText(lpp: LayeredPrivacyPolicy): Array<string> {
    var name = "*policy name is missing*";
    if (lpp.name != "") name = lpp.name;
    var message = [" -- In privacy policy: " + name];
    
    if (lpp.name === "") {
      message.push(" ----- policy name");
    }
    if (lpp.lang === "") {
      message.push(" ----- policy language");
    }
    if (lpp.purposeList.length === 0) {
      message.push(" ----- purpose(s)");
    }
    if (lpp.controllerList.length === 0) {
      message.push(" ----- controller(s)");
    }
    if (lpp.dataSubjectRightList.length === 0) {
      message.push(" ----- Data Subject rigth(s)");
    }
    if (lpp.lodgeComplaint.name === "") {
      message.push(" ----- lodge complaint information");
    }

    if (!this.isLppComplete(lpp) && lpp.purposeList.length > 0) {
      message = message.concat(this.getPurposeWarnMessage(lpp));
    }

    return message;
  }

  getPurposeWarnMessage(lpp: LayeredPrivacyPolicy): Array<string> {
    var res = new Array<string>();
      for (var x = 0; x < lpp.purposeList.length; x++) {
        if ((new Purpose(lpp.purposeList[x])).isComplete()) break;
        res.push(" ------ In purpose: " + lpp.purposeList[x].name); 
        if (lpp.purposeList[x].dataList.length === 0) {
          res.push(" -------- data to be collected");
        }
        if (lpp.purposeList[x].dataRecipientList.length === 0) {
          res.push(" -------- data recipient");
        }
        if (lpp.purposeList[x].legalBasisList.length === 0) {
          res.push(" -------- legal basis");
        }
        if (lpp.purposeList[x].retention.type === '') {
          res.push(" -------- retention");
        }
      }
    return res;
  }

}
