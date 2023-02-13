
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { LoginService } from '../services/login.service';
import { Router } from '@angular/router';
import { LoginModel } from '../models/LoginModel';
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
      username: [''],
      password: ['']
    })
  }

  async verifyLogin() {
    let payload = new User(
      this.form.value.username,
      this.form.value.password
    );

    let response = await this.userService.validateLogin(payload);
    let responseJSON = JSON.parse(JSON.stringify(response));
    if (responseJSON['authenticated'] == "true") {
      this.router.navigate(['/']);
    } else {
      this.incorrectLogin = true;
    }
  }
}
