import { ErrorHandler, Injectable, NgZone } from "@angular/core";
import { isString } from 'util';
import { MatDialog } from '@angular/material/dialog';
import { ErrorDialogComponent } from './error-dialog.component';
import { Router } from '@angular/router';
import { timer } from 'rxjs';

@Injectable()    
export class AppErrorHandler implements ErrorHandler {
    
    constructor(private dialog: MatDialog, private ngzone: NgZone){};
    
    handleError(e: any) {
        console.error(e)
        if (e instanceof Error) {
            let error = e as Error
            if (error.name === 'FirebaseError' || error.name === 'Error') {
                this.ngzone.run(() => {
                    this.dialog.open(ErrorDialogComponent, {data: {message: error.message}});
                }) 
            } 
        } 
    }
  }