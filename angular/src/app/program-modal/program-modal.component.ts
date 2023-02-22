import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import {MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Program } from '../models/ProgramModel';
import { ProgramService } from '../services/program.service';

@Component({
  selector: 'app-program-modal',
  templateUrl: './program-modal.component.html',
  styleUrls: ['./program-modal.component.scss']
})
export class ProgramModalComponent implements OnInit{

  program: Program;
  firstName: string = '';
  lastName: string = '';
  
  constructor(
    public dialogRef: MatDialogRef<ProgramModalComponent>,
    @Inject(MAT_DIALOG_DATA) public programID: number,
    private programService: ProgramService  ) {
      this.program = {
        Name: '',
        Description: '',
        ProgramID: 0,
        OfferingPeriod: '',
        Price: 0,
        Length: 0,
        Date: '',
        MaximumCapacity: 0,
        CurrentCapacity: 0
      };
    }

  ngOnInit(): void {
    //this.dialogRef.updatePosition({ top: (window.innerHeight/4).toString() + 'px', left: (window.innerWidth/4).toString() + 'px'})
    this.programService.getProgram(this.programID).subscribe(
      (data) => {
        this.program = data;
      }
    );
  }

  signUp() {
    this.programService.signUp(this.programID);
    this.dialogRef.close();
  }


}
