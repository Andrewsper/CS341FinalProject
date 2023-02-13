
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { User } from '../models/User';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  form!: FormGroup;
  public incorrectLogin: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }

  async verifyLogin() {
    let payload = new User(
      this.form.value.email,
      this.form.value.password
    );
    this.userService.validateLogin(payload);
  }
}
