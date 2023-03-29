import { Component,OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})
export class ManageUsersComponent {


  constructor(public userService : UserService){
    
  }

  userlist :Observable<User[]> =  this.userService.getAllUsers();


  ngOnInit(){

    this.userService.getAllUsers().subscribe();
  }

  toggleMember(uid:String){
    this.userService.toggleMembership(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    
  }
  toggleActive(uid:String){
    this.userService.toggleActive(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});;
  }
  toggleStaff(uid:String){
    this.userService.toggleStaff(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});;
  }
}
