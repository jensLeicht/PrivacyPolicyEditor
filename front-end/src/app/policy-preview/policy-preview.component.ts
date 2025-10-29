import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, Inject, OnInit, Optional } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-policy-preview',
  templateUrl: './policy-preview.component.html',
  styleUrls: ['./policy-preview.component.scss'],
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
export class PolicyPreviewComponent implements OnInit {

  elv = [
    {header:"HEAD", show: [{t: -1, show: false}] },
    {header:"DESC", show: [{t: -1, show: false}] },
    // {header:"ICONS", show: [{t: -1, show: false}] },
    {header:"LC", show: [{t: -1, show: false}] },

    {header:"LCHH", show: [{t: -1, show: false}] },
    {header:"LCDD", show: [{t: -1, show: false}] },

    {header:"DSR", show: [{t: -1, show: false}] },
    {header:"DPO", show: [{t: -1, show: false}] },
    {header:"C", show: [{t: -1, show: false}] },
    {header:"P", show: [{t: -1, show: false}] },

    {header:"LPP", show: [{t: -1, show: false}] },
  ];

  elvLC = [
    {header: "LCHEAD", show: [{t: -1, i: -1, show: false}] },
    {header: "LCDESC", show: [{t: -1, i: -1, show: false}] },
    {header: "DSR", show: [{t: -1, i: -1, show: false}] },

    {header: "DSRHH", show: [{t: -1, i: -1, show: false}] },
    {header: "DSRDD", show: [{t: -1, i: -1, show: false}] },

    {header: "DPO", show: [{t: -1, i: -1, show: false}] },
    {header: "C", show: [{t: -1, i: -1, show: false}] },

    {header: "CHH", show: [{t: -1, i: -1, show: false}] },
    {header: "CDD", show: [{t: -1, i: -1, show: false}] },

    {header: "DPOHH", show: [{t: -1, i: -1, show: false}] },
    {header: "DPODD", show: [{t: -1, i: -1, show: false}] },

    {header: "P", show: [{t: -1, i: -1, show: false}] },
    {header: "R", show: [{t: -1, i: -1, show: false}] },
    // {header: "ICONS", show: [{t: -1, i: -1, show: false}] },
    {header: "H", show: [{t: -1, i: -1, show: false}] },
    {header: "D", show: [{t: -1, i: -1, show: false}] },

    {header: "RH", show: [{t: -1, i: -1, show: false}] },
    {header: "RD", show: [{t: -1, i: -1, show: false}] },

    // {header: "IHEAD", show: [{t: -1, i: -1, show: false}] },
    // {header: "IDESC", show: [{t: -1, i: -1, show: false}] },
    {header: "PH", show: [{t: -1, i: -1, show: false}] },
    {header: "PD", show: [{t: -1, i: -1, show: false}] },
    {header: "PDRL", show: [{t: -1, i: -1, show: false}] },

    {header: "PDD", show: [{t: -1, i: -1, show: false}] },
    {header: "PPM", show: [{t: -1, i: -1, show: false}] },
    {header: "PLBA", show: [{t: -1, i: -1, show: false}] },

    {header: "PADML", show: [{t: -1, i: -1, show: false}] },
    {header: "PPNML", show: [{t: -1, i: -1, show: false}] }
    
  ];

  elvList = [
    {header: "DSRHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DSRDESC", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DPOHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DPODESC", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "CHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "CDESC", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PDESC", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "RHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "RDESC", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "PM", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "LB", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "ADM", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PNM", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "PNMHH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PNMDD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PNMARRI", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PNMNODD", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "ADMHH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "ADMDD", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "LBHH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "LBDD", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "PMH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PMD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PMNOD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PMATTRI", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "PDR", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DL", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "DLH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DLD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DLDC", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "DLDG", show: [{t: -1, i: -1, j: -1, show: false}] },

    // {header: "IHEAD", show: [{t: -1, i: -1, j: -1, show: false}] },
    // {header: "IDESC", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "ANM", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "ANMH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "ANMD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "ANMHE", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "ANMATTR", show: [{t: -1, i: -1, j: -1, show: false}] },

    {header: "PDRH", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PDRD", show: [{t: -1, i: -1, j: -1, show: false}] },
    {header: "PDRDSG", show: [{t: -1, i: -1, j: -1, show: false}] } 
  ];

  elvSubList = [
    {header: "PDRHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "PDRDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "PMHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "PMDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "LBHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "LBDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "ADMHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "ADMDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "PNMHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "PNMDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "SG", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "SGH", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "SGD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    
    {header: "DLHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "DLDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "ANMHEAD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "ANMDESC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "HE", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "NoDdm", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "PMATTR", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "PNMATTR", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "PNMNoD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    
    {header: "ANMATTR", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "DC", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "DG", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "DCH", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "DCD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },

    {header: "DGH", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] },
    {header: "DGD", show: [{t: -1, i: -1, j: -1, k: -1, show: false}] }
    
  ];

  elvSubListEnd = [
    {header: "SGHEAD", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] },
    {header: "SGDESC", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] },

    {header: "DCHEAD", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] },
    {header: "DCDESC", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] },

    {header: "DGHEAD", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] },
    {header: "DGDESC", show: [{t: -1, i: -1, j: -1, k: -1, n: -1, show: false}] }
  ];

  list = new Array();

  constructor(public dialogRef: MatDialogRef<PolicyPreviewComponent>,
      @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {
    this.list = data;

    this.fill(this.list, "HEAD");
    this.fill(this.list, "DESC");
    // this.fill(this.list, "ICONS");
    this.fill(this.list, "LC");
    this.fill(this.list, "LCHH");
    this.fill(this.list, "LCDD");
    this.fill(this.list, "DSR");
    this.fill(this.list, "DPO");
    this.fill(this.list, "C");
    this.fill(this.list, "P");

    this.fill(this.list, "LPP");

    this.fillHead(this.list, "LCHEAD", "lodgeComplaint");
    this.fillDesc(this.list, "LCDESC", "lodgeComplaint");
    this.fillEl(this.list, "DSR", "dataSubjectRightList");

    this.fillEl(this.list, "DSRHH", "dataSubjectRightList");
    this.fillEl(this.list, "DSRDD", "dataSubjectRightList");

    this.fillEl(this.list, "DPO", "dataProtectionOfficerList");

    this.fillEl(this.list, "DPOHH", "dataProtectionOfficerList");
    this.fillEl(this.list, "DPODD", "dataProtectionOfficerList");

    this.fillEl(this.list, "C", "controllerList");

    this.fillEl(this.list, "CHH", "controllerList");
    this.fillEl(this.list, "CDD", "controllerList");

    this.fillEl(this.list, "P", "purposeList");
    this.fillEl(this.list, "R", "purposeList");
    // this.fillEl(this.list, "ICONS", "iconList");
    this.fillEl(this.list, "H", "HEADER");
    this.fillEl(this.list, "D", "DESCRIPTION");

    this.fillEl(this.list, "RH", "purposeList");
    this.fillEl(this.list, "RD", "purposeList");

    // this.fillEl(this.list, "IHEAD", "iconList");
    // this.fillEl(this.list, "IDESC", "iconList");

    this.fillEl(this.list, "PH", "purposeList");
    this.fillEl(this.list, "PD", "purposeList");
    this.fillEl(this.list, "PDRL", "purposeList");  

    this.fillEl(this.list, "PPM", "purposeList"); 
    this.fillEl(this.list, "PLBA", "purposeList"); 

    this.fillEl(this.list, "PADML", "purposeList"); 
    this.fillEl(this.list, "PPNML", "purposeList"); 

    this.fillEl(this.list, "PDD", "purposeList");  

    this.fillListHead(this.list, "DSRHEAD", "dataSubjectRightList", "dataSubjectRight");
    this.fillListDesc(this.list, "DSRDESC", "dataSubjectRightList", "dataSubjectRight");

    this.fillListHead(this.list, "DPOHEAD", "dataProtectionOfficerList", "dataProtectionOfficer");
    this.fillListDesc(this.list, "DPODESC", "dataProtectionOfficerList", "dataProtectionOfficer");

    this.fillListHead(this.list, "CHEAD", "controllerList", "controller");
    this.fillListDesc(this.list, "CDESC", "controllerList", "controller");

    this.fillListHead(this.list, "PHEAD", "purposeList", "purpose");
    this.fillListDesc(this.list, "PDESC", "purposeList", "purpose");

    this.fillList(this.list, "PM", "purposeList", "purpose", "privacyModelList");
    this.fillList(this.list, "LB", "purposeList", "purpose", "legalBasisList");
    this.fillList(this.list, "ADM", "purposeList", "purpose", "automatedDecisionMakingList");
    this.fillList(this.list, "PNM", "purposeList", "purpose", "automatedDecisionMakingList");

    this.fillList(this.list, "PNMHH", "purposeList", "purpose", "automatedDecisionMakingList");
    this.fillList(this.list, "PNMDD", "purposeList", "purpose", "automatedDecisionMakingList");
    this.fillList(this.list, "PNMARRI", "purposeList", "purpose", "automatedDecisionMakingList");
    this.fillList(this.list, "PNMNODD", "purposeList", "purpose", "automatedDecisionMakingList");

    this.fillList(this.list, "ADMHH", "purposeList", "purpose", "automatedDecisionMakingList");
    this.fillList(this.list, "ADMDD", "purposeList", "purpose", "automatedDecisionMakingList");

    this.fillList(this.list, "LBHH", "purposeList", "purpose", "legalBasisList");
    this.fillList(this.list, "LBDD", "purposeList", "purpose", "legalBasisList");

    this.fillList(this.list, "PMH", "purposeList", "purpose", "privacyModelList");
    this.fillList(this.list, "PMD", "purposeList", "purpose", "privacyModelList");

    this.fillList(this.list, "PMNOD", "purposeList", "purpose", "privacyModelList");
    this.fillList(this.list, "PMATTRI", "purposeList", "purpose", "privacyModelList");

    this.fillListHead(this.list, "RHEAD", "purposeList", "purpose");
    this.fillListDesc(this.list, "RDESC", "purposeList", "purpose");

    // this.fillListHead(this.list, "IHEAD", "iconList", "icon");
    // this.fillListDesc(this.list, "IDESC", "iconList", "icon");

    this.fillSubEl(this.list, "PDR", "purposeList", "purpose", "dataRecipientList");
    this.fillSubEl(this.list, "DL", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "ANM", "purposeList", "purpose", "dataList");

    this.fillSubEl(this.list, "ANMH", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "ANMD", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "ANMHE", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "ANMATTR", "purposeList", "purpose", "dataList");

    this.fillSubEl(this.list, "DLH", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "DLD", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "DLDC", "purposeList", "purpose", "dataList");
    this.fillSubEl(this.list, "DLDG", "purposeList", "purpose", "dataList");


    this.fillSubEl(this.list, "PDRH", "purposeList", "purpose", "dataRecipientList");
    this.fillSubEl(this.list, "PDRD", "purposeList", "purpose", "dataRecipientList");
    this.fillSubEl(this.list, "PDRDSG", "purposeList", "purpose", "dataRecipientList");

    this.fillSubSubEl(this.list, "SG", "purposeList", "purpose", "dataRecipientList", "dataRecipient", "safeguardList");

    this.fillSubSubEl(this.list, "SGH", "purposeList", "purpose", "dataRecipientList", "dataRecipient", "safeguardList");
    this.fillSubSubEl(this.list, "SGD", "purposeList", "purpose", "dataRecipientList", "dataRecipient", "safeguardList");

    this.fillSubSubEl(this.list, "DC", "purposeList", "purpose", "dataList", "data", "dataCategoryList");
    this.fillSubSubEl(this.list, "DG", "purposeList", "purpose", "dataList", "data", "dataGroupList");

    this.fillSubSubEl(this.list, "DCH", "purposeList", "purpose", "dataList", "data", "dataCategoryList");
    this.fillSubSubEl(this.list, "DCD", "purposeList", "purpose", "dataList", "data", "dataCategoryList");

    this.fillSubSubEl(this.list, "DGH", "purposeList", "purpose", "dataList", "data", "dataCategoryList");
    this.fillSubSubEl(this.list, "DGD", "purposeList", "purpose", "dataList", "data", "dataCategoryList");

    this.fillSubSubEl(this.list, "NoDdm", "purposeList", "purpose", "privacyModelList", "privacyModel", "nameOfDataList");
    this.fillSubSubEl(this.list, "PMATTR", "purposeList", "purpose", "privacyModelList", "privacyModel", "privacyModelAttributeList");

    this.fillSubSubEl(this.list, "PNMATTR", "purposeList", "purpose", "pseudonymizationMethodList", "pseudonymizationMethod", "pseudonymizationMethodAttributeList");
    this.fillSubSubEl(this.list, "PNMNoD", "purposeList", "purpose", "pseudonymizationMethodList", "pseudonymizationMethod", "nameOfDataList");

    this.fillSubElHead(this.list, "PDRHEAD", "purposeList", "purpose", "dataRecipientList", "dataRecipient");
    this.fillSubElDesc(this.list, "PDRDESC", "purposeList", "purpose", "dataRecipientList", "dataRecipient");
    this.fillSubElHead(this.list, "PMHEAD", "purposeList", "purpose", "privacyModelList", "privacyModel");
    this.fillSubElDesc(this.list, "PMDESC", "purposeList", "purpose", "privacyModelList", "privacyModel");

    this.fillSubElHead(this.list, "LBHEAD", "purposeList", "purpose", "legalBasisList", "legalBasis");
    this.fillSubElDesc(this.list, "LBDESC", "purposeList", "purpose", "legalBasisList", "legalBasis");

    this.fillSubElHead(this.list, "ADMHEAD", "purposeList", "purpose", "automatedDecisionMakingList", "automatedDecisionMaking");
    this.fillSubElDesc(this.list, "ADMDESC", "purposeList", "purpose", "automatedDecisionMakingList", "automatedDecisionMaking");

    this.fillSubElHead(this.list, "PNMHEAD", "purposeList", "purpose", "pseudonymizationMethodList", "pseudonymizationMethod");
    this.fillSubElDesc(this.list, "PNMDESC", "purposeList", "purpose", "pseudonymizationMethodList", "pseudonymizationMethod");


    this.fillSubElHead(this.list, "DLHEAD", "purposeList", "purpose", "dataList", "data");
    this.fillSubElDesc(this.list, "DLDESC", "purposeList", "purpose", "dataList", "data");

    this.fillSubElANM(this.list, "ANMHEAD", "purposeList", "purpose", "dataList", "data", "anonymizationMethod", "HEAD");
    this.fillSubElANM(this.list, "ANMDESC", "purposeList", "purpose", "dataList", "data", "anonymizationMethod", "DESC");
    this.fillSubElANM(this.list, "HE", "purposeList", "purpose", "dataList", "data", "anonymizationMethod", "hierarchyEntityList");
    
    this.fillSubElANM(this.list, "ANMATTR", "purposeList", "purpose", "dataList", "data", "anonymizationMethod", "anonymizationMethodAttributeList");

    this.fillSubElHeadEnd(this.list, "SGHEAD", "purposeList", "purpose", "dataRecipientList", "dataRecipient", "safeguardList", "safeguard");
    this.fillSubElDescEnd(this.list, "SGDESC", "purposeList", "purpose", "dataRecipientList", "dataRecipient", "safeguardList", "safeguard");

    this.fillSubElHeadEnd(this.list, "DCHEAD", "purposeList", "purpose", "dataList", "data", "dataCategoryList", "dataCategory");
    this.fillSubElDescEnd(this.list, "DCDESC", "purposeList", "purpose", "dataList", "data", "dataCategoryList", "dataCategory");

    this.fillSubElHeadEnd(this.list, "DGHEAD", "purposeList", "purpose", "dataList", "data", "dataGroupList", "dataGroup");
    this.fillSubElDescEnd(this.list, "DGDESC", "purposeList", "purpose", "dataList", "data", "dataGroupList", "dataGroup");

  }

  fillHead(data: any, label: string, el: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].HEAD.length; i++) {
        var tab = {t: t, i: i, show: false};
        this.elvLC.find(e => e.header == label)?.show.push(tab);
      }
    }
  }

  fillDesc(data: any, label: string,el: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].DESC.length; i++) {
        var tab = {t: t, i: i, show: false};
        this.elvLC.find(e => e.header == label)?.show.push(tab);
      }
    }
  }

  fill(data: any, label: string) {
    for (var t = 0; t < data.length; t++) {
      var tab = {t: t, show: false};
      this.elv.find(e => e.header == label)?.show.push(tab);
    }
  }

  fillEl(data: any, label: string, el: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        var tab = {t: t, i: i, show: false};
        this.elvLC.find(e => e.header == label)?.show.push(tab);
      }
    }
  }

  fillListHead(data: any, label: string, el: string, name: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i].HEAD.length; j++) {
          var tab = {t: t, i: i, j: j, show: false};
          this.elvList.find(e => e.header == label)?.show.push(tab);
        }    
      } 
    }
  }

  fillListDesc(data: any, label: string, el: string, name: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i].DESC.length; j++) {
          var tab = {t: t, i: i, j: j, show: false};
          this.elvList.find(e => e.header == label)?.show.push(tab);
        }     
      }
    }
  }

  fillList(data: any, label: string, el: string, name: string, target: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][target].length; j++) {
          var tab = {t: t, i: i, j: j, show: false};
          this.elvList.find(e => e.header == label)?.show.push(tab);
        }     
      }
    }
  }

  fillSubEl(data: any, label: string, el: string, name: string, subEl: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
            var tab = {t: t, i: i, j: j, show: false};
            this.elvList.find(e => e.header == label)?.show.push(tab);
        }     
      }
    }
  }

  fillSubSubEl(data: any, label: string, el: string, name: string, subEl: string, subName:  string, subSubEl: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j][subSubEl].length; k++) {
            var tab = {t: t, i: i, j: j, k: k, show: false};
            this.elvSubList.find(e => e.header == label)?.show.push(tab);
          }
        }     
      }
    }
  }

  fillSubElHead(data: any, label: string, el: string, name: string, subEl: string, subName: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j].HEAD.length; k++) {
            var tab = {t: t, i: i, j: j, k: k, show: false};
            this.elvSubList.find(e => e.header == label)?.show.push(tab);
          }
        }     
      }
    }
  }

  fillSubElDesc(data: any, label: string, el: string, name: string, subEl: string, subName: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j].DESC.length; k++) {
            var tab = {t: t, i: i, j: j, k: k, show: false};
            this.elvSubList.find(e => e.header == label)?.show.push(tab);
          }
        }     
      }
    }
  }

  fillSubElANM(data: any, label: string, el: string, name: string, subEl: string, subName: string, anm: string, target: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j][anm][target].length; k++) {
            var tab = {t: t, i: i, j: j, k: k, show: false};
            this.elvSubList.find(e => e.header == label)?.show.push(tab);
          }
        }     
      }
    }
  }

  fillSubElHeadEnd(data: any, label: string, el: string, name: string, subEl: string, subName: string, subElEnd: string, subNameEnd: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j][subElEnd].length; k++) {
            for (var n = 0; n < data[t][el][i][subEl][j][subElEnd][k].HEAD.length; n++) {
              var tab = {t: t, i: i, j: j, k: k, n: n, show: false};
              this.elvSubListEnd.find(e => e.header == label)?.show.push(tab);
            }
          }
        }     
      }
    }
  }

  fillSubElDescEnd(data: any, label: string, el: string, name: string, subEl: string, subName: string, subElEnd: string, subNameEnd: string) {
    for (var t = 0; t < data.length; t++) {
      for (var i = 0; i < data[t][el].length; i++) {
        for (var j = 0; j < data[t][el][i][subEl].length; j++) {
          for (var k = 0; k < data[t][el][i][subEl][j][subElEnd].length; k++) {
            for (var n = 0; n < data[t][el][i][subEl][j][subElEnd][k].DESC.length; n++) {
              var tab = {t: t, i: i, j: j, k: k, n: n, show: false};
              this.elvSubListEnd.find(e => e.header == label)?.show.push(tab);
            }
          }
        }     
      }
    }
  }

  ngOnInit(): void {
  }

  close(): void {
    this.dialogRef.close();
  }

  viewList(tab: any, t: number) {
    let currentTab = this.elv.find(t => t.header == tab)!;
    currentTab.show.find(s => s.t == t)!.show = !currentTab.show.find(s => s.t == t)!.show;
  }

  viewListEl(tab: any, t: number, i: number) {
    let currentTab = this.elvLC.find(t => t.header == tab)!;
    currentTab.show.find(s => s.i == i && s.t == t)!.show = !currentTab.show.find(s => s.i == i && s.t == t)!.show;
  }

  viewElvList(tab: any, t: number, i: number, j: number) {
    let currentTab = this.elvList.find(t => t.header == tab)!;
    currentTab.show.find(s => s.i == i && s.j == j && s.t == t)!.show = !currentTab.show.find(s => s.i == i && s.j == j && s.t == t)!.show;
  }

  viewElvSubList(tab: any, t: number, i: number, j: number, k: number) {
    let currentTab = this.elvSubList.find(t => t.header == tab)!;
    currentTab.show.find(s => s.i == i && s.j == j && s.k == k && s.t == t)!.show = !currentTab.show.find(s => s.i == i && s.j == j && s.k == k && s.t == t)!.show;
  }

  viewElvSubListEnd(tab: any, t: number, i: number, j: number, k: number, n: number) {
    let currentTab = this.elvSubListEnd.find(t => t.header == tab)!;
    currentTab.show.find(s => s.i == i && s.j == j && s.k == k && s.n == n && s.t == t)!.show = !currentTab.show.find(s => s.i == i && s.j == j && s.k == k && s.n == n && s.t == t)!.show;
  }

  show(tab: any, t: number): boolean {
    return this.elv.find(t => t.header == tab)!.show.find(s => s.t == t)!.show;
  }

  showEl(tab: any, t: number, i: number): boolean {
    return this.elvLC.find(t => t.header == tab)!.show.find(s => s.i == i && s.t == t)!.show;
  }

  showElv(tab: any, t: number, i: number, j: number): boolean {
    return this.elvList.find(t => t.header == tab)!.show.find(s => s.i == i && s.j == j && s.t == t)!.show;
  }

  showSubElv(tab: any, t: number, i: number, j: number, k: number): boolean {
    return this.elvSubList.find(t => t.header == tab)!.show.find(s => s.i == i && s.j == j && s.k == k && s.t == t)!.show;
  }

  showSubElvEnd(tab: any, t: number, i: number, j: number, k: number, n: number): boolean {
    return this.elvSubListEnd.find(t => t.header == tab)!.show.find(s => s.i == i && s.j == j && s.k == k && s.n == n && s.t == t)!.show;
  }

}
