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
  errorText: string = "";

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
        confirmPassword: [''],
        admin: ['']
      })
  }

  checkLogin(): boolean {
    if(this.form.value.password != this.form.value.confirmPassword) {
      this.errorText = "Passwords do not match";
      return false;
    }
    if(this.form.value.username == "" || this.form.value.firstname == "" || this.form.value.lastname == "" || this.form.value.address == "" || this.form.value.zipcode == "" || this.form.value.phoneNumber == "" || this.form.value.email == "") {
      this.errorText = "Please fill out all fields";
      return false;
    }
    return true;
  }

  async register() {
    if(!this.checkLogin()) {
      return;
    }
    let payload: RegisterModel = {
      Username: this.form.value.username,
      FirstName: this.form.value.firstname,
      LastName: this.form.value.lastname,
      Address: this.form.value.address,
      ZipCode: this.form.value.zipcode,
      PhoneNumber: this.form.value.phoneNumber,
      Email: this.form.value.email,
      Password: this.form.value.password,
      Type: this.form.value.admin
    }
    let response = await this.loginService.register(payload);
    let responseJSON = JSON.parse(JSON.stringify(response));
    if (responseJSON['success'] == "true") {
      this.router.navigate(['/']);
    } else {
      this.errorText = "Username already exists"
    }
    

    this.router.navigate(['/']);
  }

}
