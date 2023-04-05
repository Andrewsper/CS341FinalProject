import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { ProgramModalComponent } from '../program-modal/program-modal.component';
import { UserService } from '../services/user.service';
import { AddProgramComponent } from '../add-program/add-program.component';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs?: Program [];
  userPrograms?: number[][] = [];

  constructor(
    private programService: ProgramService,
    public dialog: MatDialog,
    public userService: UserService,
  ) {

  }

  ngOnInit(): void {
    this.getProg();
    this.userService.getUserProgramsRel();
  }

  async showCreateProgramModal(){
    this.dialog.open(AddProgramComponent,{height:'600px',width:'800px'}).afterClosed().subscribe(result => {
        this.getProg();
    });
  }

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
      this.getProg();
    });
}

async getProg(){
  this.programs = await this.programService.getAllPrograms().toPromise();
}
  
userSignedUp(programID: number): boolean {
  if (!this.userService.curUser.classesTaken) {
    return false;
  } else if (this.userService.curUser.classesTaken.length == 0) {
    return false;
  }
  return this.userService.curUser.classesTaken.some((program) => program[0] == programID);
}

}

