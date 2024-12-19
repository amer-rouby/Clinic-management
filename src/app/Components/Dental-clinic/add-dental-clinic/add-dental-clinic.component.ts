import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DentalClinic } from '../../../Models/DentalClinic.module';

import { noFutureDateValidator } from '../../../../Shared/Date-Validator/FutureDateValidator';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { DentalClinicService } from '../../../Services/dental-clinic.service';
import { ToastrService } from '../../../Services/toastr.service';
import { TranslateService } from '../../../Services/translate.service';

@Component({
  selector: 'app-add-dental-clinic',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './add-dental-clinic.component.html',
  styleUrls: ['./add-dental-clinic.component.scss']
})
export class AddDentalClinicComponent implements OnInit {
  addDentalForm: FormGroup;
  loadingData = false;
  @Output() dentalClinicAdded = new EventEmitter<DentalClinic>();
  isEdit = false;
  dental: DentalClinic | null = null;
  ADD_OR_MODIFY_BUTTON = 'ADD_BUTTON';

  constructor(
    public dialogRef: MatDialogRef<AddDentalClinicComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private dentalClinicService: DentalClinicService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.addDentalForm = this.fb.group({
      title: ['', Validators.required],
      phoneNumber: ['', [
        Validators.required,
        Validators.pattern('^\\+?[0-9]{10,12}$'),
        Validators.minLength(11),
        Validators.maxLength(11)
      ]],
      description: ['', Validators.required],
      date: [null, [Validators.required, noFutureDateValidator()]],
      completed: [false] // Initialize completed field
    });

    if (data?.dental) {
      this.isEdit = true;
      this.dental = data.dental;
      this.ADD_OR_MODIFY_BUTTON = 'EDIT_BUTTON';
    }
  }

  ngOnInit() {
    if (this.dental) {
      this.addDentalForm.patchValue(this.dental);
    }
  }

  addDentalClinic() {
    this.loadingData = true;
    if (this.addDentalForm.valid) {
      const dentalClinicData = this.addDentalForm.value;
      if (this.isEdit && this.dental) {
        const updatedDental: DentalClinic = { ...this.dental, ...dentalClinicData };
        this.updateDentalClinic(updatedDental);
      } else {
        this.createDentalClinic(dentalClinicData);
      }
    } else {
      this.loadingData = false;
    }
  }

  private updateDentalClinic(updatedDental: DentalClinic) {
    this.dentalClinicService.updateDentalClinic(this.dental!.id, updatedDental).subscribe({
      next: (response: any) => {
        this.handleSuccess(response, 'DENTAL_CLINIC_UPDATED_SUCCESS');
      },
      error: (error) => this.handleError(error),
    });
  }

  private createDentalClinic(dentalClinicData: any) {
    this.dentalClinicService.addDentalClinic(dentalClinicData).subscribe({
      next: (response) => {
        this.handleSuccess(response, 'DENTAL_CLINIC_ADDED_SUCCESS');
      },
      error: (error) => this.handleError(error),
    });
  }

  private handleSuccess(response: any, successMessage: string) {
    this.dentalClinicAdded.emit(response);
    this.onClose();
    this.loadingData = false;
    this.toastr.success(this.translate.instant(successMessage));
  }

  private handleError(error: any) {
    console.error(error);
    this.loadingData = false;
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
