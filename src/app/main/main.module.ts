import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { PoWidgetModule } from '@po-ui/ng-components';
import { PoPageModule } from '@po-ui/ng-components';
import { PoButtonModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PoFieldModule } from '@po-ui/ng-components';
import { PoDividerModule } from '@po-ui/ng-components';
import { ResidentsListComponent } from './residents-list/residents-list.component';
import { PoTableModule } from '@po-ui/ng-components';
import { PoModalModule } from '@po-ui/ng-components';
import { ParcelsNewEditComponent } from './parcels-new-edit/parcels-new-edit.component';
import { ParcelsListComponent } from './parcels-list/parcels-list.component';
import { ResidentsNewEditComponent } from './residents-new-edit/residents-new-edit.component';
import { PoContainerModule } from '@po-ui/ng-components';
@NgModule({
  declarations: [
    MainComponent,
    ResidentsNewEditComponent,
    ResidentsListComponent,
    ParcelsNewEditComponent,
    ParcelsListComponent
  ],
  imports: [
    CommonModule,
    MainRoutingModule,
    PoWidgetModule,
    PoPageModule,
    PoButtonModule,
    ReactiveFormsModule,
    FormsModule,
    PoFieldModule,
    PoDividerModule,
    PoTableModule,
    PoModalModule,
    PoContainerModule
  ]
})
export class MainModule { }
