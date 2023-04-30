import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { YmcaModalComponent } from '../ymca-modal/ymca-modal.component';
import { Observable } from 'rxjs';

@Injectable()
export class ModalService {
    
    constructor(
        public dialog: MatDialog
    ) { }

    showModal(message: string, title: string, buttonText: string = 'Ok', type: string = 'info'): Observable<any> {
        let ret = false;
        return this.dialog.open(YmcaModalComponent, {
            height: '200px',
            width: '400px',
            data: {
                content: message,
                title: title,
                buttonText: buttonText,
                type: type
            }
        }).afterClosed();
        
    }



}