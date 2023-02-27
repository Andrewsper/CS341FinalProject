import { Component, Inject } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';

@Component({
  selector: 'app-ymca-modal',
  templateUrl: './ymca-modal.component.html',
  styleUrls: ['./ymca-modal.component.scss']
})
export class YmcaModalComponent {

  content: string = '';
  title: string = '';
  buttonText: string = 'Ok';

  //this modal can be used for any purpose, so it takes in a title, content, and optional button text

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<YmcaModalComponent>,
  ) { 
    this.content = data.content;
    this.title = data.title;
    this.buttonText = data.buttonText;
  }

  close() {
    this.dialogRef.close();
  }

}
