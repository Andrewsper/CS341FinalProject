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
    if(this.form.value.username == "" || this.form.value.firstname == "" || this.form.value.lastname == "" || this.form.value.address == "" || this.form.value.email == "" || this.form.value.password == "" || this.form.value.confirmPassword == "") {
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
      Username: this.form.value.username.trim(),
      FirstName: this.form.value.firstname.trim(),
      LastName: this.form.value.lastname.trim(),
      Address: this.form.value.address.trim(),
      ZipCode: this.form.value.zipcode.trim(),
      PhoneNumber: this.form.value.phoneNumber.trim(),
      Email: this.form.value.email.trim(),
      Password: this.form.value.password.trim(),
      Type: this.form.value.admin.trim()
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
