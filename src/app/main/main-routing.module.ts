import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MainComponent } from './main.component';
import { ParcelsListComponent } from './parcels-list/parcels-list.component';
import { ParcelsNewEditComponent } from './parcels-new-edit/parcels-new-edit.component';
import { ResidentsListComponent } from './residents-list/residents-list.component';
import { ResidentsNewEditComponent } from './residents-new-edit/residents-new-edit.component';

const routes: Routes = [
  { path: '', redirectTo: 'parcels', pathMatch: 'full' },
  { path: 'residents', component: ResidentsListComponent },
  { path: 'residents/edit/:id', component: ResidentsNewEditComponent },
  { path: 'residents/new', component: ResidentsNewEditComponent },
  { path: 'parcels', component: ParcelsListComponent },
  { path: 'parcels/new', component: ParcelsNewEditComponent },
  { path: 'parcels/edit/:id', component: ParcelsNewEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainRoutingModule { }
