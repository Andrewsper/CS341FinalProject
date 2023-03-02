import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from '../program-modal/program-modal.component';
import { UserService } from '../services/user.service';
import { AddProgramComponent } from '../add-program/add-program.component';



@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs: Program[] = [];
  userPrograms?: number[] = [];

  constructor(
    private programService: ProgramService,
    public dialog: MatDialog,
    public userService: UserService
  ) {

  }

  ngOnInit(): void {
    this.updateAllPrograms()
    this.userPrograms = this.userService.getUserPrograms();
  }

  showCreateProgramModal(){
    this.dialog.open(AddProgramComponent,{height:'600px',width:'800px'})
  }

  showSignupModal(programID: number, edit: boolean) {
    this.dialog.open(ProgramModalComponent, {
      height: '600px',
      width: '800px',
      data: {
        programID: programID,
        edit: edit
      }
    }).beforeClosed().subscribe(() => {    
      this.updateAllPrograms();
      this.userPrograms = this.userService.getUserPrograms();
  });
}

updateAllPrograms(){
  this.programService.getAllPrograms().subscribe(
    (data) => {
      this.programs = data;
    },
    (err) => {
      console.log(err);
    });
  }
  
userSignedUp(programID: number): boolean {
  if (!this.userService.curUser.classesTaken) {
    return false;
  } else if (this.userService.curUser.classesTaken.length == 0) {
    return false;
  }
  return this.userService.curUser.classesTaken.indexOf(programID) != -1;
}

}

