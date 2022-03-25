import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UsersRoutingModule } from './users-routing.module';
import { UsersNewEditComponent } from './users-new-edit/users-new-edit.component';
import { UsersListComponent } from './users-list/users-list.component';
import { PoButtonModule, PoContainerModule, PoDividerModule, PoFieldModule, PoModalModule, PoPageModule, PoTableModule, PoWidgetModule } from '@po-ui/ng-components';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    UsersListComponent,
    UsersNewEditComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
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
export class UsersModule { }
