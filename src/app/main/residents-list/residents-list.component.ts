import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PoModalAction, PoTableAction, PoTableColumn, PoTableColumnSort } from '@po-ui/ng-components';
import { ResidentsService } from 'src/app/services/residents/residents.service';
import { PoModalComponent } from '@po-ui/ng-components';
import { PoNotificationService } from '@po-ui/ng-components';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, filter, distinctUntilChanged, takeWhile, tap } from 'rxjs/operators';
@Component({
  selector: 'app-residents-list',
  templateUrl: './residents-list.component.html',
  styleUrls: ['./residents-list.component.scss']
})
export class ResidentsListComponent implements OnInit, OnDestroy {
  @ViewChild(PoModalComponent, { static: true }) poModal: PoModalComponent;

  columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome' },
    { property: 'block', label: 'Bloco' },
    { property: 'apartment', label: 'Apartamento' },
    { property: 'cpf', label: 'CPF' },
    { property: 'email', label: 'Email' },
    { property: 'cel', label: 'Celular', width: '10%' },
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

  form: FormGroup;
  residents = [];
  isListening = true;
  itemToRemove = null;
  page = 1;
  disableShowMore = false;
  term = '';
  termAddress = '';

  constructor(
    private service: ResidentsService,
    private router: Router,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.setForm();
    this.get();
  }

  ngOnDestroy() {
    this.isListening = false;
  }

  setForm() {
    this.form = this.formBuilder.group({
      searchInput: [null],
      searchInputAddress: [null],
    });

    this.form.get('searchInput').valueChanges.pipe(
      takeWhile(() => this.isListening),
      tap(() => { 
        this.form.get('searchInputAddress').setValue(null, { emitEvent: false });
        this.termAddress = '';
      }),
      debounceTime(300),
      filter(value => value.length >= 3 || !value.length),
      distinctUntilChanged()
    )
      .subscribe(value => {
        this.residents = [];
        this.term = value;
        this.page = 1;
        this.get()
      });

      this.form.get('searchInputAddress').valueChanges.pipe(
        takeWhile(() => this.isListening),
        tap(() => { 
          this.form.get('searchInput').setValue(null, { emitEvent: false });
          this.term = '';
        }),
        debounceTime(300),
        filter(value => value.length >= 2 || !value.length),
        distinctUntilChanged()
      )
        .subscribe(value => {
          this.residents = [];
          this.termAddress = value;
          this.page = 1;
          this.get()
        });
  }


  get() {
    const params: any = {
      page: this.page,
    }
    if(this.term) {
      params.term = this.term;
    }
    if(this.termAddress) {
      params.termAddress = this.termAddress
    }
    this.service.get(params)
      .subscribe(res => {
        this.residents = [...this.residents, ...res.data];
        if (res.count <= this.residents.length) {
          this.disableShowMore = true;
        } else {
          this.disableShowMore = false;
        }
      });
  }

  edit(item) {
    this.router.navigate([`/main/residents/edit/${item.id}`]);
  }

  remove(item) {
    this.itemToRemove = item.id;
    this.modalOpen();
  }

  navigateToNew() {
    this.router.navigate([`/main/residents/new`]);
  }

  modalOpen() {
    this.poModal.open();
  }

  closeModal() {
    this.itemToRemove = null;
    this.poModal.close();
  }

  confirmDelete() {
    this.service.delete(this.itemToRemove)
      .subscribe(() => {
        this.poNotification.success('Deletado com sucesso!');
        this.residents = [];
        this.get();
        this.poModal.close();
      })
  }

  showMore() {
    this.page += 1;
    this.get();
  }

}
