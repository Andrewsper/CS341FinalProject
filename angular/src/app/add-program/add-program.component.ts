import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-program',
  templateUrl: './add-program.component.html',
  styleUrls: ['./add-program.component.scss']
})
export class AddProgramComponent implements OnInit{

  form!: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      name: [''],
      description: [''],
      startDate: [''],
      endDate: [''],
      price: [''],
      location: [''],
      maxParticipants: ['']
    })
  }

  createProgram(): void {
    console.log(this.form.value);
  }
}
