import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
import { PatientInstallmentService } from '../../Services/PatientInstallment.service';
import { AddEditInstallmentDialogComponent } from './add-patient-installments/add-patient-installments.component';
import { ConfirmDialogComponent } from '../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { ThemeService } from '../../Services/theme.service';
import { InstallmentDetailsDialogComponent } from './installment-details/installment-details-dialog.component';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-patient-installments',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './patient-installments.component.html',
  styleUrls: ['./patient-installments.component.scss']
})
export class PatientInstallmentsComponent implements OnInit, OnDestroy {
  installments: any[] = [];
  displayedColumns: string[] = ['index','patientName', 'amount', 'dueDate', 'description', 'actions', 'details'];
  dataSource = new MatTableDataSource<any>([]); // Update dataSource
  isLoading = false;
  searchTerm: string = '';
  themeColor: string = 'primary';
  themeSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private patientInstallmentService: PatientInstallmentService,
    private dialog: MatDialog,
    public themeService: ThemeService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadInstallments();
    this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
      this.themeColor = color;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  loadInstallments() {
    this.isLoading = true;
    this.patientInstallmentService.getAllInstallments().subscribe({
      next: (data) => {
        this.installments = data.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
        this.dataSource.data = this.installments; // Set dataSource data
        this.dataSource.paginator = this.paginator; // Set paginator
        this.isLoading = false;
      },
      error: (error) => {
        console.error(error);
        this.isLoading = false;
      }
    });
  }
  

  applyFilter() {
    this.isLoading = true;
    const searchTermLower = this.searchTerm.toLowerCase();
    this.dataSource.filter = searchTermLower; // Use built-in filter method
    this.isLoading = false;
  }

  openAddEditDialog(installment?: any) {
    const dialogRef = this.dialog.open(AddEditInstallmentDialogComponent, {
      data: { installment },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadInstallments();
      }
    });
  }

  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Are you sure you want to delete this installment?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteInstallment(id);
      }
    });
  }

  deleteInstallment(id: string) {
    this.isLoading = true;
    this.patientInstallmentService.deleteInstallment(id).subscribe({
      next: () => this.loadInstallments(),
      error: (error) => console.error('Error deleting installment', error),
    });
    this.toastr.success(this.translate.instant('INSTALLMENT_DELETED_SUCCESS')); 
    this.isLoading = false;
  }

  viewInstallmentDetails(element: any) {
    this.dialog.open(InstallmentDetailsDialogComponent, {
      data: { patientName: element.patientName, installments: this.installments.filter(i => i.patientName === element.patientName) },
      width: '100vw ',
      height: '100vh',
      panelClass: 'full-screen-dialog'  // استخدام اسم الفئة لأسلوب CSS
    });
  }
  
  getThemeColor(): any {
    return this.themeColor === 'primary' ? '#003366' : '#b03060';
  }
}
