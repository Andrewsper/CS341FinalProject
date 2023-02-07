
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LoginModel } from '../models/LoginModel';

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
    private loginService: LoginService,
    private router: Router
  ) {

  }

  ngOnInit(): void {
      this.form = this.formBuilder.group({
        username: [''],
        password: ['']
      })
  }

  async verifyLogin() {
    let payload: LoginModel = {
      username: this.form.value.username,
      password: this.form.value.password,
      authenticated: false
    }
    let response = await this.loginService.validateLogin(payload);
    let responseJSON = JSON.parse(JSON.stringify(response));
    if (responseJSON['authenticated'] == "true") {
      this.router.navigate(['/']);
    } else {
      this.incorrectLogin = true;
    }
  }
}
