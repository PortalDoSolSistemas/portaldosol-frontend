import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { take } from 'rxjs/operators';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.scss']
})
export class UsersListComponent implements OnInit {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'email', label: 'Email' },
    { property: 'adminLabel', label: 'Administrador' },
  ];

  tableActions: Array<PoTableAction> = [
    { action: this.edit.bind(this), icon: 'po-icon-info', label: 'Editar' },
    { action: this.remove.bind(this), icon: 'po-icon po-icon-delete', label: 'Remover' }
  ];

  close: PoModalAction = {
    action: () => {
      this.closeModal();
    },
    label: 'Cancelar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.confirmDelete();
    },
    label: 'Confirmar'
  };

  users: any[];
  itemToRemove = null;

  constructor(
    private service: UserService,
    private router: Router,
    private poNotification: PoNotificationService,
  ) { }

  ngOnInit(): void {
    this.getUsers();
  }

  getUsers(): void {
    this.service.getAll()
      .pipe(take(1))
      .subscribe(res => {
        for (let user of res) {
          user.admin ? user.adminLabel = 'Sim' : user.adminLabel = 'Não';
        }
        this.users = [...res];
      });
  }

  edit(item): void {
    this.router.navigate([`/users/edit/${item.id}`]);
  }

  navigateToNew() {
    this.router.navigate([`/users/new`]);
  }

  modalOpen() {
    this.poModal.open();
  }

  closeModal() {
    this.itemToRemove = null;
    this.poModal.close();
  }

  remove(item) {
    this.itemToRemove = item.id;
    this.modalOpen();
  }

  confirmDelete() {
    this.service.delete(this.itemToRemove)
      .subscribe(() => {
        this.poNotification.success('Deletado com sucesso!');
        this.getUsers();
        this.poModal.close();
      })
  }
}
