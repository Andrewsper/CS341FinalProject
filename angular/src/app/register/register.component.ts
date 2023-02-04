import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterModel } from '../models/RegisterModel';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  form!: FormGroup;
  registrationError: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private router: Router) { }

  
    ngOnInit(): void {
      this.form = this.formBuilder.group({
        username: [''],
        firstname: [''],
        lastname: [''],
        address: [''],
        zipcode: [''],
        phoneNumber: [''],
        email: [''],
        password: [''],
        admin: ['']
      })
  }

  async register() {
    let payload: RegisterModel = {
      username: this.form.value.username,
      firstname: this.form.value.firstname,
      lastname: this.form.value.lastname,
      address: this.form.value.address,
      zipcode: this.form.value.zipcode,
      phoneNumber: this.form.value.phoneNumber,
      email: this.form.value.email,
      password: this.form.value.password,
      admin: this.form.value.admin
    }
    let response = await this.loginService.register(payload);
    let responseJSON = JSON.parse(JSON.stringify(response));
    if (responseJSON['success'] == "true") {
      this.router.navigate(['/']);
    } else {
      this.registrationError = false;
    }
    

    this.router.navigate(['/']);
  }

}
