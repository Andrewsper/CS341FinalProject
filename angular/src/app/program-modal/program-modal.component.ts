import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Program } from '../models/ProgramModel';
import { ProgramService } from '../services/program.service';
import { UserService } from '../services/user.service';

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
  
  constructor(
    public dialogRef: MatDialogRef<ProgramModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private programService: ProgramService ) {
      this.program = {
        name: '',
        description: '',
        programID: 0,
        offeringPeriod: '',
        price: 0,
        length: 0,
        date: '',
        maximumCapacity: 0,
        currentCapacity: 0,
        location: ''
      };
      this.edit = data.edit;
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
    this.programService.signUp(this.data.programID);
    this.dialogRef.close();
  }

  cancelRegistration() {

    console.log(this.data.programID)
    if (this.programService.cancelRegistration(this.data.programID)) {
    }
    this.dialogRef.close();
  }

}
