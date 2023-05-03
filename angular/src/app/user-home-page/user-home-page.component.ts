/**
 * This module contains the functionality of the home-page component

Author: Will, Andrew

Date Modified: 2023-04-25
 */

import { Component } from '@angular/core';
import { Program } from '../models/ProgramModel';
import { ProgramService } from '../services/program.service';
import { UserService } from '../services/user.service';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from '../program-modal/program-modal.component';

@Component({
  selector: 'app-user-home-page',
  templateUrl: './user-home-page.component.html',
  styleUrls: ['./user-home-page.component.scss']
})
export class UserHomePageComponent {
  programs?: Program [];

  constructor(
    private programService: ProgramService ,
    public userService: UserService,
    public dialog: MatDialog,


  ){}
    //inits the component
  ngOnInit(): void {
    this.getUserProgramList();
    this.userService.getUserProgramsRel();
  }

//gets all of the programs the current user is signed up for
 async getUserProgramList(){
    if (!this.userService.curUser) {
      return;
    }
    this.programs = await this.userService.getUserPrograms(this.userService.curUser.userid!).toPromise();
  }

  //boolean to see whether or not a user has signed up for a program
  userSignedUp(programID: number): boolean {
    if (!this.userService.curUser.classesTaken) {
      return false;
    } else if (this.userService.curUser.classesTaken.length == 0) {
      return false;
    }
    return this.userService.curUser.classesTaken.some((program) => program[0] == programID);
  }

  //shows sign up modal
  showSignupModal(programID: number, edit: boolean) {
    this.dialog.open(ProgramModalComponent, {
      height: '600px',
      width: '800px',
      data: {
        programID: programID,
        edit: edit,
        numRegistered: this.userService.getNumRegistered(programID)
      }
    }).afterClosed().subscribe(result => {
      
      this.userService.getUserProgramsRel();
      this.getUserProgramList();
    });
}
}
