import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { CardsComponent } from "./cards/cards.component";
import { ContactComponent } from "./contact/contact.component";
import { MainPageComponent } from "./main-page/main-page.component";

const routes: Routes = [
  { path: 'start', component: CardsComponent, canDeactivate: [CardsComponent],},
  { path: 'contact', component: ContactComponent},
  { path: '', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
