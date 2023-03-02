import { Component, Inject, Injectable, OnInit } from '@angular/core';
import { ProgramService } from '../services/program.service';
import { Program } from '../models/ProgramModel';
import { MatDialog, MatDialogModule, MatDialogRef,MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../services/user.service';
@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit{

  progForm !: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<AddProgramComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private userService: UserService,
    private programService: ProgramService,
    private formBuilder: FormBuilder    
  ) {}

  ngOnInit(): void {
    this.progForm = this.formBuilder.group({
    this.progForm = this.formBuilder.group({
      name: [''],
      description: [''],
      start: [''],
      end : [''],
      start: [''],
      end : [''],
      price: [''],
      location: [''],
      maxParticipants: [''],
      duration: ['']
    });
  }

  createProgram(): void {
    let prog = new Program(this.progForm.value.name as string,
                            this.progForm.value.description as string,
                            this.progForm.value.start + " - " + this.progForm.value.end as string,
                            this.progForm.value.price as number,
                            this.progForm.value.start as string,
                            this.progForm.value.maxParticipants as number,
                            0,
                            this.progForm.value.location as string,
                            //substute value for length rn
                            this.progForm.value.duration as number
                            );

    console.log(prog)
    this.dialogRef.beforeClosed().subscribe(()=>this.programService.addProgram(prog));
    this.dialogRef.close();
  }
}
