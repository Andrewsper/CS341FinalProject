/**
 * This module contains the functionality of the manage users component

Author: Will, Andrew

Date Modified: 2023-04-25
 */

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

  //list of users
  userlist :Observable<User[]> =  this.userService.getAllUsers();
  //list of user programs
  userProgramList = new Map<String,Program[]>();
  //filter string
  filter = '';

  //gets user and program data
  ngOnInit(){
    this.updateData();

  }

  //gets the users programs
  updateData() {
    this.userService.getAllUsers().subscribe((users)=>{
      users.forEach((user)=>this.getUserProgramList(user.userid!));
    });
  }

  //toggles a users member status by making an api call to the server
  toggleMember(uid:String){
    this.userService.toggleMembership(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }
  //toggles a users active status by making an api call to the server
  toggleActive(uid:String){
    this.userService.toggleActive(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }

  //toggles a users staff status by making an api call to the server
  toggleStaff(uid:String){
    this.userService.toggleStaff(uid).subscribe(()=>{this.userlist= this.userService.getAllUsers()});
    this.updateData();
  }

  //gets the programs that a user has signed up for 
  getUserProgramList(uid : String){
    let programlist : Program[];
    this.userService.getUserPrograms(uid).subscribe((programs)=>{
        this.userProgramList.set(uid,programs);
    });
  }

  //filters the user list by lastname
  filterUser(user : User): boolean{
    if(this.filter==''){
      return true;
    }
    return user.lastName!.toLowerCase().includes(this.filter.toLowerCase());
  }
}
