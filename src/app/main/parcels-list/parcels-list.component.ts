import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { PoModalAction, PoModalComponent, PoNotificationService, PoPageListComponent, PoTableAction, PoTableColumn } from '@po-ui/ng-components';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { debounceTime, filter, distinctUntilChanged, takeWhile } from 'rxjs/operators';
import { ResidentsFilter } from 'src/app/services/residents/residents-filter';
@Component({
  selector: 'app-parcels-list',
  templateUrl: './parcels-list.component.html',
  styleUrls: ['./parcels-list.component.scss']
})
export class ParcelsListComponent implements OnInit {
  @ViewChild('poPageList', { static: true }) poPageList: PoPageListComponent;
  @ViewChild('modalDelete', { static: true }) poModalDelete: PoModalComponent;
  @ViewChild('modalAdvancedSearch', { static: true }) poModalAdvancedSearch: PoModalComponent;

  columns: Array<PoTableColumn> = [
    { property: 'code', label: 'Código', width: '15%' },
    { property: 'date', label: 'Data de Recebimento', width: '15%' },
    { property: 'name', label: 'Morador' },
    { property: 'block', label: 'Bloco', width: '10%' },
    { property: 'apartment', label: 'Apartamento', width: '10%' },
    { property: 'delivered_date', label: 'Data de Entrega', width: '10%' },
  ];

  tableActions: Array<PoTableAction> = [
    { action: this.edit.bind(this), icon: 'po-icon-info', label: 'Editar' },
    { action: this.remove.bind(this), icon: 'po-icon po-icon-delete', label: 'Remover' }
  ];

  close: PoModalAction = {
    action: () => {
      this.closeModal();
    },
    label: 'Limpar',
    danger: true
  };

  confirm: PoModalAction = {
    action: () => {
      this.confirmDelete();
    },
    label: 'Confirmar'
  };

  closeModalSearch: PoModalAction = {
    action: () => {
      this.resetForm();
    },
    label: 'Limpar',
    danger: true
  };

  confirmModalSearch: PoModalAction = {
    action: () => {
      this.confirmSearch();
    },
    label: 'Confirmar'
  };

  form: FormGroup;
  parcels = [];
  isListening = true;
  itemToRemove = null;
  disableShowMore = false;
  params = {
    page: 1,
    term: '',
    status: true,
    limit: 200,
  }
  filtersToPrint: any;
  sort: any;

  constructor(
    public filter: ResidentsFilter,
    private service: ParcelsService,
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
      searchInput: [''],
      status: [true],
      resident_id: [null],
      block: [null],
      apartment: [null],
      code: [null],
      date: [null],
      delivered_date: [null],
    });

    this.form.get('searchInput').valueChanges.pipe(
      takeWhile(() => this.isListening),
      debounceTime(300),
      filter(value => value.length >= 3 || !value.length),
      distinctUntilChanged()
    )
      .subscribe(value => {
        this.filtersToPrint = null;
        this.resetForm();
        this.parcels = [];
        this.resetParams();
        this.params.term = value;
        this.get();
      });

    this.form.get('status').valueChanges.subscribe((value) => {
      this.form.get('searchInput').setValue('');
      this.resetParams();
      this.params.status = value;
      this.parcels = [];
      if (value) {
        this.form.get('delivered_date').setValue(null);
      }
      this.get();
    })

  }

  get(params = this.params) {
    this.service.get(params)
      .subscribe(res => {
        this.parcels = [...this.parcels, ...res.data];
        if (res.count <= this.parcels.length) {
          this.disableShowMore = true;
        } else {
          this.disableShowMore = false;
        }
      });
  }

  edit(item) {
    this.router.navigate([`/main/parcels/edit/${item.id}`]);
  }

  remove(item) {
    this.itemToRemove = item.id;
    this.modalOpen();
  }

  modalOpen() {
    this.poModalDelete.open();
  }

  closeModal() {
    this.itemToRemove = null;
    this.poModalDelete.close();
  }

  confirmDelete() {
    this.service.delete(this.itemToRemove)
      .subscribe(() => {
        this.poNotification.success('Deletado com sucesso!');
        this.parcels = [];
        this.get();
        this.poModalDelete.close();
      })
  }

  navigateToNew() {
    this.router.navigate([`/main/parcels/new`]);
  }

  showMore() {
    this.params.page += 1;
    this.get();
  }

  modalSearchOpen() {
    this.poModalAdvancedSearch.open();
  }

  closeSearch() {
    this.poModalAdvancedSearch.close();
  }

  confirmSearch() {
    this.params.page = 1;
    let params = {
      ...this.params,
      ...this.form.value,
      term: ''
    };
    if (params.date) {
      params = { ...params, startDate: params.date.start, endDate: params.date.end };
      delete params.date;
    }
    if (params.delivered_date) {
      params = { ...params, startDeliveredDate: params.delivered_date.start, endDeliveredDate: params.delivered_date.end };
      delete params.delivered_date;
    }
    this.filtersToPrint = { ...params };
    this.parcels = [];
    this.closeSearch();
    this.params = { ...params };
    this.get(params);
  }

  resetForm() {
    this.form.patchValue({
      resident_id: null,
      block: null,
      apartment: null,
      code: null,
      date: null,
      delivered_date: null,
    })
  }

  print() {
    if (this.filtersToPrint) {
      this.filtersToPrint = { ...this.filtersToPrint, status: this.params.status };
      if (this.params.status && (this.filtersToPrint.startDeliveredDate || this.filtersToPrint.endDeliveredDate)) {
        delete this.filtersToPrint.startDeliveredDate;
        delete this.filtersToPrint.endDeliveredDate
      }
    }
    this.service.print(this.filtersToPrint || this.params)
      .subscribe((res: any) => {
        let file = new Blob([res], {
          type: res.type
        });

        //ABRIR EM OUTRA ABA
        const blob = window.URL.createObjectURL(file);
        window.open(blob);
      });
  }

  sortBy(event) {
    this.params.page = 1;
    let sort = {
      sortProperty: event.column.property,
      sortType: this.mapSortType(event.type)
    }
    this.parcels = [];
    this.sort = sort;
    const sortParams = {
      ...this.params,
      ...this.sort
    }
    this.get(sortParams);
  }

  mapSortType(type): string {
    if (type === 'ascending') {
      return 'asc';
    } else {
      return 'desc'
    }
  }

  resetParams() {
    this.params = {
      page: 1,
      term: '',
      status: this.form.get('status').value,
      limit: 200,
    }
  }


}
