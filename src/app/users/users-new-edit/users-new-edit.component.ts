import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoNotificationService, PoPageEditLiterals } from '@po-ui/ng-components';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-users-new-edit',
  templateUrl: './users-new-edit.component.html',
  styleUrls: ['./users-new-edit.component.scss']
})
export class UsersNewEditComponent implements OnInit {

  form: FormGroup;
  id: string;

  customLiterals: PoPageEditLiterals = {
    cancel: 'Voltar',
    save: 'Confirmar',
  };

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private service: UserService,
    private poNotification: PoNotificationService,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params.id;
    this.setForm();
    this.getById();
  }

  setForm(): void {
    this.form = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
      confirmPassword: [null, [Validators.required]],
      admin: [false, [Validators.required]],
    });
  }

  getById(): void {
    if (!this.id) {
      return;
    }

    this.service.getById(this.id)
      .subscribe(data => {
        this.removeValidators();
        this.form.patchValue(data);
      })
  }

  save() {
    this.id ? this.edit() : this.create();
  }

  cancel(): void {
    this.router.navigate(['/users']);
  }

  create(): void {
    this.service.create(this.form.value)
      .subscribe(
        () => {
          this.poNotification.success('Cadastrado com sucesso!');
          this.router.navigate(['/users']);
        },
        (err) => {
          this.poNotification.error(err.error);
        }
      );
  }

  edit(): void {
    let data = { ...this.form.value };
    if (!data.password) {
      delete data.password;
      delete data.confirmPassword;
    }
    this.service.update(data, this.id)
      .subscribe(
        () => {
          this.poNotification.success('Salvo com sucesso!');
          this.router.navigate(['/users']);
        },
        (err) => {
          this.poNotification.error(err.error);
        }
      );
  }

  private removeValidators(): void {
    this.form.get('password').clearValidators();
    this.form.get('confirmPassword').clearValidators();
    this.form.get('password').updateValueAndValidity();
    this.form.get('confirmPassword').updateValueAndValidity();
  }

}
