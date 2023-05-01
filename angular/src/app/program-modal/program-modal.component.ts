import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Program } from '../models/ProgramModel';
import { ProgramService } from '../services/program.service';
import { UserService } from '../services/user.service';
import { YmcaModalComponent } from '../ymca-modal/ymca-modal.component';
import { ModalService } from '../services/modal.service';
import {MatSelectModule} from '@angular/material/select';

@Component({
  selector: 'app-program-modal',
  templateUrl: './program-modal.component.html',
  styleUrls: ['./program-modal.component.scss']
})
export class ProgramModalComponent implements OnInit{

  program: Program;
  firstName: string = '';
  lastName: string = '';
  edit: boolean = false;
  numRegistered: number = 1;
  famMemberSelected: number = 0;
  
  constructor(
    public dialogRef: MatDialogRef<ProgramModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    public userService: UserService,
    private programService: ProgramService,
    private modalService: ModalService ) {
      this.program = {
        name: '',
        description: '',
        programID: 0,
        price: 0,
        length: 0,
        offeringDateFrom: new Date(),
        offeringDateTo: new Date(),
        startTime: '',
        daysOffered: [],
        maximumCapacity: 0,
        currentCapacity: 0,
        location: ''
      };
      this.edit = data.edit;
      this.numRegistered = data.numRegistered;
    }

  ngOnInit(): void {
    console.log(this.data.programID)

    this.programService.getProgram(this.data.programID).subscribe(
      (data) => {
        this.program = data;
      }
    );

  }

  signUp() {
    let error: boolean = false;
    if (this.numRegistered < 0){
      this.modalService.showModal("Number of registrants must be greater than 0", "Error #0002");
      error = true;
    }

    if(!error) {
      this.programService.signUp(this.data.programID, this.famMemberSelected);
    }

    this.dialogRef.close("result");
  }

  cancelRegistration() {
    let error: boolean = false;

    if (this.numRegistered < 0) {
      this.modalService.showModal("Number of registrants must be greater than zero", "Error #0002");
    }
    if (!error) {
      this.programService.updateRegistration(this.data.programID, this.famMemberSelected | 0);
    }
    this.dialogRef.close("result");
  }

  famMemberIsSignedUp() : boolean | undefined{
    return this.userService.curUser.Family?.find((famMember) => famMember.UserID == this.famMemberSelected)?.Programs?.includes(this.data.programID);
  }

}
