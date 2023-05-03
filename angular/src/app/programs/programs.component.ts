/**
 * This module contains the functionality of the programs component

Author: Will, Andrew

Date Modified: 2023-04-25
 */



import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from '../program-modal/program-modal.component';
import { UserService } from '../services/user.service';
import { AddProgramComponent } from '../add-program/add-program.component';
import { Observable } from 'rxjs';
import { ModalService } from '../services/modal.service';
import { FamilyMember } from '../models/FamilyMemberModel';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs?: Program[];
  userPrograms?: number[][] = [];
  filter= '';

  constructor(
    private programService: ProgramService,
    public dialog: MatDialog,
    public userService: UserService,
    public modalService: ModalService
  ) {

  }
  //inits the component
  ngOnInit(): void {
    this.getProg();
    this.userService.getUserProgramsRel();
    this.filter = '';
    if(!this.programs){
      return;
    }
    for (let i = 0;i < this.programs!.length;i++) {
      this.programs[i].show = true;
    }
  }

  //shows the create program modal
  showCreateProgramModal(){
    this.dialog.open(AddProgramComponent,{height:'600px',width:'800px'}).afterClosed().subscribe(result => {
        this.getProg();
    });
  }
  //shows the signup modal
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
      
      this.getUserProgramsRelation();
      this.getFamPrograms();
      this.getProg();
    });
}

//gets the program data
async getProg(){
  this.programs = await this.programService.getAllPrograms().toPromise();
  this.filterPrograms()
}

//gets the family program data
async getFamPrograms() {
  await this.userService.updateFamilyMemberPrograms();
}

//gets the user programs relation
async getUserProgramsRelation(){
  await this.userService.getUserProgramsRel();
}

//returns whether or not a user is signed up for a program
userSignedUp(programID: number): boolean {
  var memList : FamilyMember[] = [];
  if (this.userService.curUser.Family != null) {
    memList = this.userService.curUser.Family;
  }
  for (let i = 0; i < memList.length; i++) {
    if (memList[i].Programs.includes(programID)) {
      return true;
    }
  }
  if (!this.userService.curUser.classesTaken) {
    return false;
  } else if (this.userService.curUser.classesTaken.length == 0) {
    return false;
  }
  return this.userService.curUser.classesTaken.some((program) => program[0] == programID);
}
//returns whether or not a family member is signed up for a program

famMemberSignedUp(programID: number): string[] {
  var memList : FamilyMember[] = [];

  if (this.userService.curUser == null) {
    return [];
  }

  if (this.userService.curUser.Family != null) {
    memList = this.userService.curUser.Family;
  }
  var res: string[] = [];
  for (let i = 0; i < memList.length; i++) {
    if (memList[i].Programs.includes(programID)) {
      res.push(memList[i].FirstName + " " + memList[i].LastName);
    }
  }
  return res;
}
//cancels a users program registration
cancelProgram(programID: number) {
  let deleted = false;
  this.modalService.showModal("Are you sure you want to cancel this program?", "Cancel Program", "", "confirm")
    .subscribe(result => { if(result) {this.programService.removeProgram(programID)} });
    console.log(deleted);

  this.getUserProgramsRelation();
  this.getProg();
}

//filters the programs by name
filterPrograms() {
  console.log("filtering");
  if(!this.programs) {
    return;
  }
  for(let i = 0;i < this.programs?.length;i++) {
    if( this.filter == '' || this.programs[i].name.toLowerCase().includes(this.filter.toLowerCase())) {
      this.programs[i].show = true;
    } else {
      this.programs[i].show = false;
    }
  }
}

}

