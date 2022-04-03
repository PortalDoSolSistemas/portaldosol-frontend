import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoNotificationService, PoPageEditLiterals } from '@po-ui/ng-components';
import { ResidentsService } from 'src/app/services/residents/residents.service';

@Component({
  selector: 'app-residents-new-edit',
  templateUrl: './residents-new-edit.component.html',
  styleUrls: ['./residents-new-edit.component.scss']
})
export class ResidentsNewEditComponent implements OnInit {

  form: FormGroup;
  id: string;

  customLiterals: PoPageEditLiterals = {
    cancel: 'Voltar',
    save: 'Confirmar',
  };

  constructor(
    private formBuilder: FormBuilder, 
    private service: ResidentsService,
    private route: ActivatedRoute,
    private router: Router,
    private poNotification: PoNotificationService,
    ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.setForm();
    this.getById();
  }

 setForm(){
   this.form = this.formBuilder.group({
     name: [null, Validators.required],
     email: [null, Validators.email],
     rg: [null],
     cpf: [null],
     apartment: [null, Validators.required],
     block: [null, Validators.required],
     birthdate: [null],
     tel: [null],
     cel: [null],
     keychain: [null],
     poolExpirationDate: [null],
     poolRegistrationDate: [null],
     rentStartDate: [null],
     rentFinalDate: [null]
   });
 }

  save() {
    this.id ? this.edit() : this.create();
  }

  getById() {
    if(!this.id) {
      return;
    }

    this.service.getById(this.id)
      .subscribe(data => {
        if(data.birthdate) {
          data.birthdate = data.birthdate.split('T')[0];
        }
        if(data.poolRegistrationDate) {
          data.poolRegistrationDate = data.poolRegistrationDate.split('T')[0];
        }
        if(data.poolExpirationDate) {
          data.poolExpirationDate = data.poolExpirationDate.split('T')[0];
        }
        if(data.rentStartDate) {
          data.rentStartDate = data.rentStartDate.split('T')[0];
        }
        if(data.rentFinalDate) {
          data.rentFinalDate = data.rentFinalDate.split('T')[0];
        }
        this.form.patchValue(data);
      })
  }

  create() {
    const data = this.prepareDates(this.form.value);
    this.service.create(data)
      .subscribe(() => {
        this.poNotification.success('Cadastrado com sucesso!');
        this.router.navigate(['/main/residents']);
      });
  }

  edit() {
    const data = this.prepareDates(this.form.value);
    this.service.update(data, this.id)
    .subscribe(() => {
      this.poNotification.success('Salvo com sucesso!');
      this.router.navigate(['/main/residents']);
    });
  }

  cancel(){
    this.router.navigate(['/main/residents']);
  }

  private prepareDates(form) {
   return {
      ...form,
      birthdate: form.birthdate || null,
      poolRegistrationDate: form.poolRegistrationDate || null,
      poolExpirationDate: form.poolExpirationDate || null,
      rentStartDate: form.rentStartDate || null,
      rentFinalDate: form.rentFinalDate || null, 
    }
  }

}
