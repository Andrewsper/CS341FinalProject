import { Component } from '@angular/core';
import { UserService } from '../services/user.service';

@Component({
  selector: 'app-ymca-header',
  templateUrl: './ymca-header.component.html',
  styleUrls: ['./ymca-header.component.scss']
})
export class YmcaHeaderComponent {
  constructor(public userService : UserService){
    
  }
}
