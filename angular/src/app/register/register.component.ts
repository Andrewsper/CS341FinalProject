import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RegisterModel } from '../models/RegisterModel';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

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
    private userService: UserService,
    private router: Router) { }


  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      firstname: [''],
      lastname: [''],
      address: [''],
      zipCode: [''],
      phoneNumber: [''],
      password: [''],
      confirmPassword: [''],
      admin: ['']
    })
  }

  checkLogin(): boolean {
    if (this.form.value.password != this.form.value.confirmPassword) {
      this.errorText = "Passwords do not match";
      return false;
    }
    if (this.form.value.username == "" || this.form.value.firstname == "" || this.form.value.lastname == "" || this.form.value.address == "" || this.form.value.email == "" || this.form.value.password == "" || this.form.value.confirmPassword == "") {
      this.errorText = "Please fill out all fields";
      return false;
    }
    return true;
  }

  async register() {
    if (!this.checkLogin()) {
      return;
    }
    let payload: User = new User(this.form.value.email.trim(),
      this.form.value.password.trim(),
      this.form.value.firstname.trim(),
      this.form.value.lastname.trim(),
      0,
      this.form.value.phoneNumber.trim(),
      this.form.value.address.trim(),
      this.form.value.zipCode.trim(),
      false,
      false);

    this.userService.registerUser(payload);



    this.router.navigate(['/']);
  }

}
