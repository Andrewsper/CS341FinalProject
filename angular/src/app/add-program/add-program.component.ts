/**
 * This module contains the functionality of the create program component

Author: Will, Andrew

Date Modified: 2023-04-25
 */

import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import { MatDialog, MatDialogModule, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormArray, FormBuilder, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
import { ModalService } from '../services/modal.service';
@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit{

  progForm !: FormGroup;
  daysSelected: string[];
  daysOfWeek: {name: string, checked: boolean}[];
  constructor(
    public dialogRef: MatDialogRef<AddProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private programService: ProgramService,
    private formBuilder: FormBuilder,
    private modalService: ModalService

  ) {
    this.daysOfWeek = [{name: 'Sunday', checked: false}, {name: 'Monday', checked: false}, 
    {name: 'Tuesday', checked: false}, {name: 'Wednesday', checked: false}, 
    {name: 'Thursday', checked: false}, {name: 'Friday', checked: false}, 
    {name: 'Saturday', checked: false}]
    this.daysSelected = [];
  }

//inits form data
  ngOnInit(): void {
    this.progForm = this.formBuilder.group({
      name: [''],
      description: [''],
      start: [''],
      end : [''],
      price: [''],
      location: [''],
      maxParticipants: [''],
      duration: [''],
      startTime: [''],
      daysOfWeek: new FormArray([])
    });

    this.addCheckboxes();

  }

  get daysOfWeekFormArray() {
    return this.progForm.get('daysOfWeek') as FormArray;
  }

  //adds check boxes for the form
  addCheckboxes() {
    this.daysOfWeek.forEach(() => this.daysOfWeekFormArray.push(new FormControl(false)));
  }

  //sends a create form request to the server
  createProgram(): void {
    if(new Date(this.progForm.value.start).getTime() > new Date(this.progForm.value.end).getTime()) {
      this.modalService.showModal("invalid date selection", "Error #0004");
      return;
    }
    this.daysSelected = this.progForm.value.daysOfWeek
      .map((checked: any, i: number) => checked ? this.daysOfWeek[i].name : null)
      .filter((v: any) => v !== null);
    let prog = new Program(this.progForm.value.name as string,
                            this.progForm.value.description as string,

                            this.progForm.value.end as Date,
                            this.progForm.value.start as Date,
                            this.progForm.value.startTime as string,
                            this.progForm.value.price as number,
                            this.progForm.value.maxParticipants as number,
                            0,
                            this.progForm.value.location as string,
                            //substute value for length rn
                            this.progForm.value.duration as number,
                            0,
                            this.daysSelected as string[]
                            );

    console.log(prog)
    this.dialogRef.beforeClosed().subscribe(()=>this.programService.addProgram(prog));
    this.dialogRef.close();
  }
}
