import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import {MatDialog, MatDialogModule, MatDialogRef} from '@angular/material/dialog';
import { ProgramModalComponent } from '../program-modal/program-modal.component';



@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs: Program[] = [];
  userPrograms: number[][] = [];

  constructor(
    private programService: ProgramService,
    public dialog: MatDialog
  ) {

  }

  ngOnInit(): void {
    this.programService.getAllPrograms().subscribe(
      (data) => {
        this.programs = data;
      },
      (err) => {
        console.log(err);
      }
    );
    this.programService.getUserPrograms().subscribe(
      (data) => {
        this.userPrograms = data;
      }
    );
  }

  showModal(programID: number) {
    this.dialog.open(ProgramModalComponent, {
      height: '600px',
      width: '800px',
      data: programID
    });
  }

  userSignedUp(programID: number): boolean {
   return this.userPrograms.findIndex((id) => id[0] == programID) != -1;
  }

}

