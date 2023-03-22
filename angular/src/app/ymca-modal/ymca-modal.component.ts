import { Component, EventEmitter, Inject, Output } from '@angular/core';
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
  type: string = '';

  @Output() closeEvent = new EventEmitter();

  //this modal can be used for any purpose, so it takes in a title, content, and optional button text

  constructor(
    @Inject (MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<YmcaModalComponent>,
  ) { 
    this.content = data.content;
    this.title = data.title;
    this.buttonText = data.buttonText;
    this.type = data.type;
  }

  close() {
    this.dialogRef.close();
  }

  yes() {
    this.closeEvent.emit(true);
    this.close();
  }

  no() {
    this.closeEvent.emit(false);
    this.close();
  }

}
