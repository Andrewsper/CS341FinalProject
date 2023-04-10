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

  ngOnInit(): void {
    this.getUserProgramList();
    this.userService.getUserProgramsRel();
  }
 async getUserProgramList(){
    this.programs= await this.userService.getUserPrograms(this.userService.curUser.userid!).toPromise();
  }

  userSignedUp(programID: number): boolean {
    if (!this.userService.curUser.classesTaken) {
      return false;
    } else if (this.userService.curUser.classesTaken.length == 0) {
      return false;
    }
    return this.userService.curUser.classesTaken.some((program) => program[0] == programID);
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
      this.getUserProgramList();
    });
}
}
