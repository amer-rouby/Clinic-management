import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DentalClinic } from '../../../Models/DentalClinic.module';

import { noFutureDateValidator } from '../../../../Shared/Date-Validator/FutureDateValidator';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { DentalClinicService } from '../../../Services/dental-clinic.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-add-dental-clinic',
  standalone:true,
  imports: [SharedMaterialModule],
  templateUrl: './add-dental-clinic.component.html',
  styleUrls: ['./add-dental-clinic.component.scss']
})
export class AddDentalClinicComponent implements OnInit {
  addDentalForm: FormGroup;
  loadingData: boolean = false;
  @Output() dentalClinicAdded = new EventEmitter<DentalClinic>();
  isEdit: boolean = false;
  dental: DentalClinic | null = null;
  ADD_OR_MODIFY_BUTTON = "ADD_BUTTON";

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

    if (data && data.dental) {
      this.isEdit = true;
      this.dental = data.dental;
      this.ADD_OR_MODIFY_BUTTON = 'EDIT_BUTTON'
    }
  }

  ngOnInit() {
    if (this.dental) {
      this.addDentalForm.patchValue({
        title: this.dental.title,
        phoneNumber: this.dental.phoneNumber,
        description: this.dental.description,
        date: this.dental.date,
        completed: this.dental.completed,
      });
    }
  }

  addDentalClinic() {
    this.loadingData = true;

    if (this.addDentalForm.valid) {
      if (this.isEdit && this.dental) {
        const updatedDental: DentalClinic = { ...this.dental, ...this.addDentalForm.value };
        this.dentalClinicService.updateDentalClinic(this.dental.id, updatedDental).subscribe({
          next: (response: any) => {
            this.dentalClinicAdded.emit(response);
            this.onClose();
            this.loadingData = false;
            this.toastr.success(this.translate.instant('DENTAL_CLINIC_UPDATED_SUCCESS'));
          },
          error: (error) => {
            console.error(error);
            this.loadingData = false;
          },
        });
      } else {
        this.dentalClinicService.addDentalClinic(this.addDentalForm.value).subscribe({
          next: (response) => {
            this.dentalClinicAdded.emit(response);
            this.onClose();
            this.loadingData = false;
            this.toastr.success(this.translate.instant('DENTAL_CLINIC_ADDED_SUCCESS'));
          },
          error: (error) => {
            console.error(error);
            this.loadingData = false;
          },
        });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
