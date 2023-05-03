/**
 * This module contains the functionality of the login component

Author: Will, Andrew

Date Modified: 2023-04-25
 */
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
  //inits the login form
  ngOnInit(): void {
    this.form = this.formBuilder.group({
      email: [''],
      password: ['']
    })
  }


  //sends a login request to the server with the form data
  async verifyLogin() {
    let payload = new User(
      this.form.value.email,
      this.form.value.password
    );
    this.userService.validateLogin(payload);
  }
}
