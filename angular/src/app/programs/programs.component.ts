import { Component, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';



@Component({
  selector: 'app-programs',
  templateUrl: './programs.component.html',
  styleUrls: ['./programs.component.scss']
})
export class ProgramsComponent implements OnInit {

  programs: Program[] = [];

  constructor(
    private programService: ProgramService
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
  }

  showModal(programID: number) {
    
  }

}
