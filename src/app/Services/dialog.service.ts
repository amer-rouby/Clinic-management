import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  constructor(private dialog: MatDialog) {}

  openDialog(
    component: any,
    data: any = {},
    width: string = '600px'
  ): Observable<any> {
    const dialogRef = this.dialog.open(component, {
      width,
      data,
    });

    return dialogRef.afterClosed();
  }
}
