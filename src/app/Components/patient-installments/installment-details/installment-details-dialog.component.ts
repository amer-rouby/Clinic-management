import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { Installment } from '../../../Models/Installment.module';
import { AddInstallmentService } from '../../../Services/add-installment.service';
import { ConfirmDialogComponent } from '../../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { noFutureDateValidator } from '../../../../Shared/Date-Validator/FutureDateValidator';
import { ThemeService } from '../../../Services/theme.service';
import { Subscription } from 'rxjs';
import { ToastrService } from '../../../Services/toastr.service';
import { TranslateService } from '../../../Services/translate.service';

@Component({
  selector: 'app-installment-details-dialog',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './installment-details-dialog.component.html',
  styleUrls: ['./installment-details-dialog.component.scss']
})
export class InstallmentDetailsDialogComponent implements OnInit {
  installments: Installment[] = [];
  totalPaid: number = 0;
  remainingAmount: number = 0;
  installmentForm: FormGroup;
  isLoading = false;
  totalAmount: number;
  displayedColumns: string[] = ['dueDate', 'description', 'amount', 'actions'];
  isEditMode = false;
  showAddInstallment = false;
  themeColor: string = 'THEME_PRIMARY';
  currentInstallmentId: string | null = null;
  
  // Constants for button labels
  ADD_OR_EDIT = "ADD_BUTTON";
  ADD_OR_CANCEL = 'ADD_INSTALLMENT';

  private themeSubscription!: Subscription;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<InstallmentDetailsDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private addInstallmentService: AddInstallmentService,
    private dialog: MatDialog,
    public themeService: ThemeService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.totalAmount = data.totalAmount || 0;
    this.loadInstallments(data.patientName);

    this.installmentForm = this.fb.group({
      dueDate: ['', [Validators.required, noFutureDateValidator()]],
      amount: ['', [Validators.required, Validators.min(1)]],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
      this.themeColor = color;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  loadInstallments(patientName: string): void {
    this.isLoading = true;
    this.addInstallmentService.getInstallmentsByPatient(patientName).subscribe({
      next: (installments) => {
        this.installments = installments.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        this.calculateTotals();
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error fetching installments', error);
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalPaid = this.installments.reduce((total, installment) => total + (installment.amount || 0), 0);
    this.remainingAmount = this.totalAmount - this.totalPaid;
  }

  toggleAddInstallment(): void {
    this.showAddInstallment = !this.showAddInstallment;
    this.ADD_OR_CANCEL = this.showAddInstallment ? 'CANCEL' : 'ADD_INSTALLMENT';
    this.isEditMode = false; // Reset edit mode when toggling
    this.installmentForm.reset();
  }

  onSubmit(): void {
    if (this.installmentForm.valid) {
      this.isLoading = true;

      const newInstallment = this.getInstallmentFromForm();

      if (this.isEditMode && this.currentInstallmentId) {
        this.updateInstallment(newInstallment);
      } else {
        this.addInstallment(newInstallment);
      }
    }
  }

  getInstallmentFromForm(): any {
    return {
      dueDate: this.installmentForm.value.dueDate,
      amount: this.installmentForm.value.amount,
      description: this.installmentForm.value.description,
      patientName: this.data.patientName
    };
  }

  private addInstallment(newInstallment: any): void {
    this.addInstallmentService.addInstallment(newInstallment).subscribe({
      next: () => this.handleInstallmentSuccess(),
      error: (error) => this.handleInstallmentError(error)
    });
  }

  private updateInstallment(newInstallment: any): void {
    this.addInstallmentService.updateInstallment(this.currentInstallmentId!, newInstallment).subscribe({
      next: () => this.handleInstallmentSuccess(),
      error: (error) => this.handleInstallmentError(error)
    });
  }

  private handleInstallmentSuccess(): void {
    this.installmentForm.reset();
    this.loadInstallments(this.data.patientName);
    this.isLoading = false;
    this.showAddInstallment = false;
    this.ADD_OR_CANCEL = 'ADD_INSTALLMENT';
    this.toastr.success(this.translate.instant(this.isEditMode ? 'INSTALLMENT_UPDATED_SUCCESS' : 'INSTALLMENT_ADDED_SUCCESS'));
    this.isEditMode = false;
    this.currentInstallmentId = null;
  }

  private handleInstallmentError(error: any): void {
    console.error('Error adding/updating installment', error);
    this.isLoading = false;
  }

  editInstallment(installment: any): void {
    this.isEditMode = true;
    this.showAddInstallment = true;
    this.ADD_OR_CANCEL = 'ADD_INSTALLMENT';
    this.ADD_OR_EDIT = "ADD_BUTTON";
    this.currentInstallmentId = installment.id;
    this.installmentForm.patchValue({
      dueDate: installment.dueDate,
      amount: installment.amount,
      description: installment.description
    });
  }

  confirmDelete(id: string): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '500px',
      data: { message: 'هل انت متاكد من حذف هذا القسط؟' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteInstallment(id);
      }
    });
  }

  deleteInstallment(id: string): void {
    this.isLoading = true;
    this.addInstallmentService.deleteInstallment(id).subscribe({
      next: () => this.loadInstallments(this.data.patientName),
      error: (error) => this.handleInstallmentError(error),
      complete: () => this.isLoading = false
    });
    this.toastr.success(this.translate.instant('INSTALLMENT_DELETED_SUCCESS'));
  }

  onCloseClick(): void {
    this.dialogRef.close();
  }

  myFilter = (date: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date ? date >= today : false;
  };

  isEditModeButton(): boolean {
    return this.ADD_OR_EDIT === 'EDIT_BUTTON';
  }

  getThemeColor(): string {
    return this.themeColor === 'THEME_PRIMARY' ? '#003366' : '#b03060';
  }
}
