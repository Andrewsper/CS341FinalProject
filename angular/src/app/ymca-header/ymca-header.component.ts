/**
 * This module contains the functionality of the ymca header component

Author: Will, Andrew

Date Modified: 2023-04-25
 */

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
