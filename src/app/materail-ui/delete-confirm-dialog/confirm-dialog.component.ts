
import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  standalone: true,
  imports: [SharedMaterialModule]
})
export class ConfirmDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmDialogComponent>) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}