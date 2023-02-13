import { Component , OnInit} from '@angular/core';
import { TestService } from './services/test.service';
import { UserService } from './services/user.service';
import { User } from './models/User';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{

  testString = "notChanged";

  constructor(public userService: UserService) {}

  ngOnInit( ): void{
    this.userService.validateLogin(new User('',''));
  }
}
