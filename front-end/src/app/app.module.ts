import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ControllerComponent } from './controller-component/controller.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MainPageComponent } from './main-page/main-page.component';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatStepperModule } from '@angular/material/stepper';
import { PolicyInfoComponent } from './policy-info/policy-info.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ValidatorService } from './service/validator.service';
import { MatSelectModule } from '@angular/material/select';
import { TextFieldModule } from '@angular/cdk/text-field';
import { CardsComponent } from './cards/cards.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PolicyDescriptionComponent } from './policy-description/policy-description.component';
import { DataProtectionOfficerComponent } from './data-protection-officer/data-protection-officer.component';
import { DataSubjectRightComponent } from './data-subject-right/data-subject-right.component';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { IconComponent } from './icon/icon.component';
import { ToastrModule } from 'ngx-toastr';
import { ContactComponent } from './contact/contact.component';
import { LodgeComplaintComponent } from './lodge-complaint/lodge-complaint.component';
import { PurposeComponent } from './purpose/purpose.component';
import { PurposeHierarchyComponent } from './purpose-hierarchy/purpose-hierarchy.component';
import { InfoComponent } from './info/info.component';
import { LegalBasisComponent } from './legal-basis/legal-basis.component';
import { DataRecipientListComponent } from './data-recipient-list/data-recipient-list.component';
import { DataListComponent } from './data-list/data-list.component';
import { RetentionComponent } from './retention/retention.component';
import { PrivacyModelListComponent } from './privacy-model-list/privacy-model-list.component';
import { AutomatedDecisionMakingListComponent } from './automated-decision-making-list/automated-decision-making-list.component';
import { PseudonymizationMethodListComponent } from './pseudonymization-method-list/pseudonymization-method-list.component';
import { SafeguardComponent } from './safeguard/safeguard.component';
import { UiHeaderComponent } from './ui-header/ui-header.component';
import { UiDescriptionComponent } from './ui-description/ui-description.component';
import { EntityComponent } from './entity/entity.component';
import { DataCategoryComponent } from './data-category/data-category.component';
import { AnonymizationMethodComponent } from './anonymization-method/anonymization-method.component';
import { HierarchyEntityComponent } from './hierarchy-entity/hierarchy-entity.component';
import { AnonymizationMethodAttributeComponent } from './anonymization-method-attribute/anonymization-method-attribute.component';
import { PrivacyModelAttributeComponent } from './privacy-model-attribute/privacy-model-attribute.component';
import { PseudonymizationMethodAttributeComponent } from './pseudonymization-method-attribute/pseudonymization-method-attribute.component';
import { NameOfDataComponent } from './name-of-data/name-of-data.component';
import { MatTreeModule } from '@angular/material/tree';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { SelectedDataComponent } from './selected-data/selected-data.component';
import { SelectedDataRecipientComponent } from './selected-data-recipient/selected-data-recipient.component';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { DataCategoriesMenuComponent } from './data-categories-menu/data-categories-menu.component';
import { DataGroupMenuComponent } from './data-group-menu/data-group-menu.component';
import { WarnMessageComponent } from './warn-message/warn-message.component';
import { NgSelectModule } from '@ng-select/ng-select';
import {MatTabsModule} from '@angular/material/tabs';

import { TooltipModule } from '@syncfusion/ej2-angular-popups';
import { PolicyPreviewComponent } from './policy-preview/policy-preview.component';
import { PrologResponseComponent } from './prolog-response/prolog-response.component';
import { SaveMessageComponent } from './save-message/save-message.component';
import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { StaticValidatorService } from './service/static-validator.service';

import { HashLocationStrategy, LocationStrategy } from '@angular/common';

@NgModule({
  declarations: [
    AppComponent,
    ControllerComponent,
    HeaderComponent,
    MainPageComponent,
    FooterComponent,
    PolicyInfoComponent,
    CardsComponent,
    PolicyDescriptionComponent,
    DataProtectionOfficerComponent,
    DataSubjectRightComponent,
    IconComponent,
    ContactComponent,
    LodgeComplaintComponent,
    PurposeComponent,
    PurposeHierarchyComponent,
    InfoComponent,
    LegalBasisComponent,
    DataRecipientListComponent,
    DataListComponent,
    RetentionComponent,
    PrivacyModelListComponent,
    AutomatedDecisionMakingListComponent,
    PseudonymizationMethodListComponent,
    SafeguardComponent,
    UiHeaderComponent,
    UiDescriptionComponent,
    EntityComponent,
    DataCategoryComponent,
    AnonymizationMethodComponent,
    HierarchyEntityComponent,
    AnonymizationMethodAttributeComponent,
    PrivacyModelAttributeComponent,
    PseudonymizationMethodAttributeComponent,
    NameOfDataComponent,
    SelectedDataComponent,
    SelectedDataRecipientComponent,
    DataCategoriesMenuComponent,
    DataGroupMenuComponent,
    WarnMessageComponent,
    PolicyPreviewComponent,
    PrologResponseComponent,
    SaveMessageComponent,
    ConfirmDialogComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatCardModule,
    MatButtonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatDividerModule,
    MatIconModule,
    MatDialogModule,
    MatToolbarModule,
    MatStepperModule,
    MatSlideToggleModule,
    MatSelectModule,
    TextFieldModule,
    BrowserModule,
    FlexLayoutModule,
    MatCheckboxModule,
    ToastrModule.forRoot(),
    MatMenuModule,
    MatTreeModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    HttpClientModule,
    TooltipModule,
    TreeViewModule,
    NgSelectModule,
    MatTabsModule
  ],
  providers: [ValidatorService,StaticValidatorService,
    {provide: LocationStrategy, useClass: HashLocationStrategy}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
