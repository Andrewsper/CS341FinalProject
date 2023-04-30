import { Component,OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/User';
import { UserService } from '../services/user.service';
import { Program } from '../models/ProgramModel';
import { PipeTransform, Pipe } from '@angular/core';

@Component({
  selector: 'app-manage-users',
  templateUrl: './manage-users.component.html',
  styleUrls: ['./manage-users.component.scss']
})

export class ManageUsersComponent {

  constructor(public userService : UserService){
    
  }

  userlist :Observable<User[]> =  this.userService.getAllUsers();
  userProgramList = new Map<String,Program[]>();
  filter = '';

  ngOnInit(){
    this.updateData();

  }

  updateData() {
    this.userService.getAllUsers().subscribe((users)=>{
      users.forEach((user)=>this.getUserProgramList(user.userid!));
    });
  }

  toggleMember(uid:String){
    this.userService.toggleMembership(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }
  toggleActive(uid:String){
    this.userService.toggleActive(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }
  toggleStaff(uid:String){
    this.userService.toggleStaff(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }

  getUserProgramList(uid : String){
    let programlist : Program[];
    this.userService.getUserPrograms(uid).subscribe((programs)=>{
        this.userProgramList.set(uid,programs);
    });
  }

  filterUser(user : User): boolean{
    if(this.filter==''){
      return true;
    }
    return user.lastName!.toLowerCase().includes(this.filter.toLowerCase());
  }
}
