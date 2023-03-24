import { Component,OnInit } from '@angular/core';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {

  userlist ?: User[]

  constructor(public userService : UserService){
    
  }

  ngOnInit(){

    this.userService.getAllUsers().subscribe((users)=>this.userlist=users);
  }

  toggleMember(uid:String){
    this.userService.toggleMembership(uid);
  }
}
