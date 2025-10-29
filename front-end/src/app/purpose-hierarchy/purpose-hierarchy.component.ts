import { Component, ElementRef, Inject, OnInit, Optional, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { InfoComponent } from '../info/info.component';
import { InfoText } from '../resources/info-text';
import { CardsControlService } from '../service/cards-control.service';
import { DragAndDropEventArgs, TreeViewAllModule } from '@syncfusion/ej2-angular-navigations';
import { Purpose, PurposeHierarchyElement } from '../model/lpl/objects';
import { SaveMessageComponent } from '../save-message/save-message.component';
import { ConfirmDialogComponent, ConfirmDialogModel } from '../confirm-dialog/confirm-dialog.component';

interface TreeElement {
  id: string;
  pid?: string;
  name: string;
  value: String;
  hasChild: boolean;
  category: boolean;
}

@Component({
  selector: 'app-purpose-hierarchy',
  templateUrl: './purpose-hierarchy.component.html',
  styleUrls: ['./purpose-hierarchy.component.scss']
})
export class PurposeHierarchyComponent implements OnInit {

  purposeList = new Array<Purpose>();
  purposeHierarchy = new Array<PurposeHierarchyElement>();
  @ViewChild('tree') tree: any;
  isComplete = false;
  error = false;
  errorPurposes = new Array<TreeElement>();

  public hierarchy: TreeElement[] = [
    { id: 'gp01', name: 'Account Management', value: 'accountManagement', category: true, hasChild: false },
    { id: 'gp02', name: 'Commercial Purpose', value: 'commercialPurpose', category: true, hasChild: false },
    { id: 'gp03', name: 'Communication Management', value: 'communicationManagement', category: true, hasChild: false },
    { id: 'gp04', name: 'Communication for Customer Care', value: 'communicationForCustomerCare', category: true, hasChild: false },
    { id: 'gp05', name: 'Customer Management', value: 'customerManagement', category: true, hasChild: false },
    { id: 'gp06', name: 'Security Enforcement', value: 'enforceSecurity', category: true, hasChild: false },
    { id: 'gp07', name: 'Establish Contractual Agreement', value: 'establishContractualAgreement', category: true, hasChild: false },
    { id: 'gp08', name: 'Fulfilment of Obligation', value: 'fulfilmentOfObligation', category: true, hasChild: false },
    { id: 'gp09', name: 'Human Resource Management', value: 'humanResourceManagement', category: true, hasChild: false },
    { id: 'gp10', name: 'Marketing', value: 'marketing', category: true, hasChild: false },
    { id: 'gp11', name: 'Non-Commercial Purpose', value: 'nonCommercialPurpose', category: true, hasChild: false },
    { id: 'gp12', name: 'Organisation Governance', value: 'organisationGovernance', category: true, hasChild: false },
    { id: 'gp13', name: 'Personalisation', value: 'personalisation', category: true, hasChild: false },
    { id: 'gp14', name: 'Public Benefit', value: 'publicBenefit', category: true, hasChild: false },
    { id: 'gp15', name: 'Record Management', value: 'recordManagement', category: true, hasChild: false },
    { id: 'gp16', name: 'Research and Development', value: 'researchAndDevelopment', category: true, hasChild: false },
    { id: 'gp17', name: 'Service Provision', value: 'serviceProvision', category: true, hasChild: false },
    { id: 'gp18', name: 'Vendor Management', value: 'vendorManagement', category: true, hasChild: false },
    { id: 'gp19', name: 'Other', value: 'other', category: true, hasChild: false }
  ];

  constructor(public matDialog: MatDialog,
    private cardsControl: CardsControlService,
    public dialogRef: MatDialogRef<PurposeHierarchyComponent>,
    @Optional() @Inject(MAT_DIALOG_DATA) public data: any) {

    this.purposeList = data.data.purposeList;
    this.purposeHierarchy = this.makeDeepCopy(data.data.purposeHierarchy);

    var assignedPurposes = new Array<Purpose>();

    this.purposeHierarchy.forEach(element => {
      var superPurpose = this.hierarchy.find(h => h.value === element.superPurpose);
      if (superPurpose) {
        var purpose = this.purposeList.find(p => p.name === element.subPurpose);
        if (purpose) {
          assignedPurposes.push(purpose);
          superPurpose.hasChild = true;
          var child = { id: purpose.name, pid: superPurpose.id, name: purpose.name, value: purpose.name, category: false, hasChild: false };
          this.hierarchy.push(child);
        }
      }
    });
    var toSort: TreeElement[] = [];
    var toDo = this.purposeList.filter(purp => assignedPurposes.indexOf(purp) < 0);
    toDo.forEach(element => {
      toSort.push({ id: element.name, pid: 'gp20', name: element.name, value: element.name, category: false, hasChild: false });
    });
    if (toSort.length > 0) {
      this.hierarchy.push(
        { id: 'gp20', name: 'New Purposes', value: 'toSort', hasChild: true, category: true }
      );
      toSort.forEach(element => this.hierarchy.push(element));
    } else {
      this.isComplete = true;
    }
    this.nodeDropped();

    this.dialogRef.backdropClick().subscribe(() => { this.close(); });
  }

  makeDeepCopy(source: Array<PurposeHierarchyElement>): Array<PurposeHierarchyElement> {
    return source.map(x => Object.assign({}, x));
  }

  isEdited(): boolean {
    this.updateData();
    var res = false;
    if (this.purposeHierarchy.length == this.data.data.purposeHierarchy.length) {
      for (let index = 0; index < this.purposeHierarchy.length; index++) {
        const element = new PurposeHierarchyElement(this.purposeHierarchy[index]);
        res = res || !element.isEqual(new PurposeHierarchyElement(this.data.data.purposeHierarchy[index]));
      }
    } else {
      for (let index = 0; index < this.purposeHierarchy.length; index++) {
        const element = new PurposeHierarchyElement(this.purposeHierarchy[index]);
        if (!element.isEmpty()) {
          res = res || !element.isEqual(new PurposeHierarchyElement(this.data.data.purposeHierarchy[index]));
        }
      }
    }
    return res;
  }

  cancel(): void {
    this.dialogRef.close({ event: 'cancel' });
  }

  close() {
    if (this.isEdited()) {
      const message = "Save changes before closing?";
      const dialogData = new ConfirmDialogModel("Close ", message);
      var confirmRef = this.matDialog.open(ConfirmDialogComponent, {
        maxWidth: "400px",
        maxHeight: "200px",
        data: dialogData,
        disableClose: true
      });
      confirmRef.afterClosed().subscribe(dialogResult => {
        if (dialogResult === 1) {
          this.save();
        } else if (dialogResult === -1) {
          return;
        } else {
          this.dialogRef.close({ event: 'cancel' });
        }
      });
    } else {
      this.dialogRef.close({ event: 'cancel' });
    }
  }

  ngOnInit(): void {
    this.dialogRef.keydownEvents().subscribe(event => {
      if (event.key === "Escape") {
        this.close();
      }
    });
  }

  isDataComplete(): boolean {
    return this.isComplete && !this.error;
  }

  getSupport() {
    var data = new Array<string>();
    if (!this.isComplete) {
      data.push('Please, move the following purposes to a given purpose in the purpose hierarchy:');
      var toSort = this.hierarchy.filter(elem => elem.pid === 'gp20');
      toSort?.forEach(child => data.push('- ' + child.name));
    }
    if (this.error) {
      data.push('Non-given purposes must have at least two subordinate purposes.');
      data.push('Add another subordinate purpose to the following purposes:');
      this.errorPurposes.forEach(p => data.push('- ' + p.name));
    }

    this.matDialog.open(SaveMessageComponent, { data: data });
  }

  save(): void {
    this.updateData();
    this.dialogRef.close({ event: 'close', data: this.purposeHierarchy });
  }

  updateData(): void {
    this.purposeHierarchy.splice(0);
    this.hierarchy.filter((element: TreeElement) => element.value !== "toSort").forEach(element => {
      if (element.hasChild) {
        this.translateHierarchy(element);
      }
    });
  }

  translateHierarchy(parent: TreeElement) {
    var subPurposes = this.hierarchy.filter((element: TreeElement) => element.pid == parent.id);
    subPurposes?.forEach(element => {
      var hierarchyElement = new PurposeHierarchyElement();
      hierarchyElement.superPurpose = parent.value.toString();
      hierarchyElement.subPurpose = element.value.toString();
      this.purposeHierarchy.push(hierarchyElement);
    });
  }

  getInfo() {
    var textCreator = new InfoText();
    var data = {
      title: this.cardsControl.titleCase("Purpose Hierarchy"),
      infoText: textCreator.getText("purposeHierarchy")
    }
    this.matDialog.open(InfoComponent, { data: data });
  }

  // Mapping TreeView fields property with data source properties
  public field: Object = { dataSource: this.hierarchy, id: 'id', parentID: 'pid', text: 'name', hasChildren: 'hasChild' };

  public dropStart(args: DragAndDropEventArgs) {
    //check whether node is root node or not
    if (args.draggedParentNode.nodeName !== "LI") {
      args.cancel = true;
    }
  };

  public dropStop(args: DragAndDropEventArgs) {
    //check whether node is root node or not
    if (args.dropLevel == 1 && args.position != "Inside") {
      args.dropIndicator = 'e-no-drop';
      args.cancel = true;
    } else {
      var tree = (document.getElementById('tree') as any).ej2_instances[0];
      this.hierarchy = tree.getTreeData();
      var toSort = this.hierarchy.find(elem => elem.id === 'gp20');
      if (toSort != null) {
        this.isComplete = (((toSort.hasChild && args.draggedNodeData.parentID === 'gp20')) || !toSort.hasChild) && args.droppedNodeData.id !== 'gp20';
      }
    }
  };

  public nodeDropped() {
    this.errorPurposes = this.hierarchy.filter((element: TreeElement) => {
      if (element.hasChild && !element.id.startsWith('gp')) {
        return this.hierarchy.filter((sub: TreeElement) => sub.pid == element.id).length == 1;
      } else {
        return false;
      }
    });
    this.error = this.errorPurposes.length > 0;
  }

  public dragging(args: DragAndDropEventArgs) {
    //check whether node is root node or not
    if (args.dropLevel == 1 && args.position != "Inside") {
      args.dropIndicator = 'e-no-drop';
    }
  };

}