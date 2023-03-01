import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { YmcaModalComponent } from '../ymca-modal/ymca-modal.component';

@Injectable()
export class ModalService {
    
    constructor(
        public dialog: MatDialog
    ) { }

    showModal(message: string, title: string, buttonText: string = 'Ok') {
        this.dialog.open(YmcaModalComponent, {
            height: '200px',
            width: '400px',
            data: {
                content: message,
                title: title,
                buttonText: buttonText
            }
        });
    }



}