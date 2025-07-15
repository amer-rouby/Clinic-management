import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { PatientInstallmentService } from '../../../Services/PatientInstallment.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-edit-installment-dialog',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './add-patient-installments.component.html',
  styleUrls: ['./add-patient-installments.component.scss']
})
export class AddEditInstallmentDialogComponent {
  installmentForm: FormGroup;
  isEdit: boolean;

  constructor(
    public dialogRef: MatDialogRef<AddEditInstallmentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private patientInstallmentService: PatientInstallmentService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.isEdit = !!data.installment;
    this.installmentForm = this.fb.group({
      patientName: [data.installment?.patientName || '', Validators.required],
      amount: [data.installment?.amount || '', [Validators.required, Validators.min(0)]],
      dueDate: [data.installment?.dueDate || null, [Validators.required]],
      description: [data.installment?.description || '']
    });
  }

  save() {
    if (this.installmentForm.valid) {
      const installmentData = this.installmentForm.value;
      if (this.isEdit) {
        this.patientInstallmentService.updateInstallment(this.data.installment.id, installmentData).subscribe(response => {
          this.toastr.success(this.translate.instant('INSTALLMENT_UPDATED_SUCCESS'));
          this.dialogRef.close({ success: true, id: this.data.installment.id });
        });
      } else {
        this.patientInstallmentService.addInstallment(installmentData).subscribe(response => {
          if (response) {
            this.toastr.success(this.translate.instant('INSTALLMENT_ADDED_SUCCESS'));
            this.dialogRef.close({ success: true, id: response.id });
          }
        });
      }
    }
  }

  close() {
    this.dialogRef.close();
  }
}
