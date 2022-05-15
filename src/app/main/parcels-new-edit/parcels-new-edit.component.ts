import { Component, OnInit, ChangeDetectionStrategy, OnDestroy, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoPageEditLiterals, PoNotificationService, PoModalComponent, PoModalAction, PoTableColumn, PoInputComponent } from '@po-ui/ng-components';
import { takeWhile } from 'rxjs/operators';
import { ParcelsService } from 'src/app/services/parcels/parcels.service';
import { ResidentsFilter } from 'src/app/services/residents/residents-filter';
import { ResidentsService } from 'src/app/services/residents/residents.service';
import * as moment from 'moment';

@Component({
  selector: 'app-parcels-new-edit',
  templateUrl: './parcels-new-edit.component.html',
  styleUrls: ['./parcels-new-edit.component.scss'],
})
export class ParcelsNewEditComponent implements OnInit, OnDestroy {
  @ViewChild('poModal', { static: true }) poModal: PoModalComponent;
  @ViewChild('block', { static: true }) block: PoInputComponent;

  tableItems = [];
  itemSelecteted: any;
  columns: Array<PoTableColumn> = [
    { property: 'name', label: 'Nome', width: "70%" },
    { property: 'cpf', label: 'CPF' },
  ];

  form: FormGroup;
  id: string;
  isListening = true;
  residentsList: any[];
  today = moment().format('YYYY-MM-DD');
  modalTitle = 'Moradores';
  newResident = '';

  customLiterals: PoPageEditLiterals = {
    cancel: 'Voltar',
    save: 'Confirmar',
  };

  localOptions = [
    { label: 'Prateleira', value: 1 },
    { label: 'Fundos', value: 2 }
  ];

  shippingCompanyOptions = [
    { label: 'Correios', value: 1 },
    { label: 'Direct', value: 2 },
    { label: 'Loggi', value: 3 },
    { label: 'Mercado Livre', value: 4 },
    { label: 'JadLog', value: 5 },
    { label: 'Outra (usar Obs)', value: 6 },
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
      this.confirmModal();
    },
    label: 'Confirmar',
  };

  constructor(
    public filter: ResidentsFilter,
    private formBuilder: FormBuilder,
    private service: ParcelsService,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    private residentsService: ResidentsService
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.setForm();
    this.residentsListener();
    this.getById();
    setTimeout(() => {
      this.block.focus();
    }, 300);
  }

  ngOnDestroy(): void {
    this.isListening = false;
  }

  setForm() {
    this.form = this.formBuilder.group({
      code: [null, Validators.required],
      date: [null, Validators.required],
      block: [null, Validators.required],
      apartment: [null, Validators.required],
      resident_id: [null, Validators.required],
      shipping_company: [1, Validators.required],
      local: [1, Validators.required],
      is_delivered: [false, Validators.required],
      delivered_date: [null],
      observations: [null]
    });
    this.observeIsDelivered();

    if (!this.id) {
      this.form.get('date').setValue(this.today);
    }
  }

  observeIsDelivered() {
    this.form.get('is_delivered').valueChanges
      .subscribe(value => {
        if (value) {
          this.form.get('delivered_date').setValue(this.today);
          this.form.get('delivered_date').setValidators([Validators.required]);
        } else {
          this.form.get('delivered_date').setValue(null);
          this.form.get('delivered_date').clearValidators();
        }
        this.form.get('delivered_date').updateValueAndValidity();
      });
  }

  openModalCheck() {
    if (
      this.form.get('apartment').value &&
      this.form.get('block').value &&
      !this.form.get('resident_id').value
    ) {
      const params = {
        apartment: this.form.get('apartment').value,
        block: this.form.get('block').value
      };
      this.service.getByAddress(params)
        .subscribe(res => {
          this.tableItems = [...res];
          this.confirm.disabled = !this.tableItems.length || !this.itemSelecteted;
          this.modalTitle = `Moradores (Bloco ${this.form.get('block').value} - Apartamento ${this.form.get('apartment').value})`;
          this.poModal.open();
        });
    }
  }

  residentsListener() {
    this.filter.emitResidentList
      .pipe(takeWhile(() => this.isListening))
      .subscribe((list) => {
        this.residentsList = [...list];
      });
  }

  changeResident(value): void {
    if (this.residentsList) {
      const item = this.residentsList.find(
        (item) => item.id === value
      );
      this.form.patchValue({
        apartment: item?.apartment || null,
        block: item?.block || null,
      })
    }
  }

  save() {
    this.id ? this.edit() : this.create();
  }

  create() {
    const data = this.prepareDates(this.form.value);
    this.service.create(data)
      .subscribe(
        () => {
          this.poNotification.success('Cadastrado com sucesso!');
          this.router.navigate(['/main/parcels']);
        },
        (err) => {
          this.poNotification.error(err?.error);
        }
      );
  }

  edit() {
    const data = this.prepareDates(this.form.value);
    this.service.update(data, this.id)
      .subscribe(() => {
        this.poNotification.success('Salvo com sucesso!');
        this.router.navigate(['/main/parcels']);
      });
  }

  getById() {
    if (!this.id) {
      return;
    }

    this.service.getById(this.id)
      .subscribe(data => {
        if (data.date) {
          data.date = data.date.split('T')[0];
        }
        if (data.delivered_date) {
          data.delivered_date = data.delivered_date.split('T')[0];
        }
        this.form.patchValue(data);
      })
  }

  cancel() {
    this.router.navigate(['/main/parcels']);
  }

  closeModal() {
    this.poModal.close();
  }

  confirmModal() {
    if (this.itemSelecteted) {
      this.form.patchValue({
        resident_id: this.itemSelecteted.id
      })
      this.poModal.close();
    }
  }

  selected(event) {
    this.itemSelecteted = event;
    if (this.itemSelecteted.$selected) {
      this.confirm.disabled = false;
    } else {
      this.confirm.disabled = true;
    }
  }

  createNewResident() {
    const data = {
      name: this.newResident,
      block: this.form.get('block').value,
      apartment: this.form.get('apartment').value,
    }

    console.log('novo morador ->', data);
    this.residentsService.create(data)
      .subscribe(() => {
        this.poNotification.success('Cadastrado com sucesso!');
        this.reloadResidents();
      });
  }

  reloadResidents() {
    const params = {
      apartment: this.form.get('apartment').value,
      block: this.form.get('block').value
    };
    this.service.getByAddress(params)
      .subscribe(res => {
        this.tableItems = [...res];
        this.newResident = '';
      });
  }

  private prepareDates(form) {
    return {
      ...form,
      date: form.date || null,
      delivered_date: form.delivered_date || null,
    }
  }

}
