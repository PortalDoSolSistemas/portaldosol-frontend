import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UsersNewEditComponent } from './users-new-edit/users-new-edit.component';
import { UsersListComponent } from './users-list/users-list.component';

const routes: Routes = [
  { path: '', component: UsersListComponent },
  { path: 'new', component: UsersNewEditComponent },
  { path: 'edit/:id', component: UsersNewEditComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UsersRoutingModule { }
