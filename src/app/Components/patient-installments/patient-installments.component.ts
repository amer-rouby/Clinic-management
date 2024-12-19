import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
import { PatientInstallmentService } from '../../Services/PatientInstallment.service';
import { AddEditInstallmentDialogComponent } from './add-patient-installments/add-patient-installments.component';
import { ConfirmDialogComponent } from '../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { ThemeService } from '../../Services/theme.service';
import { InstallmentDetailsDialogComponent } from './installment-details/installment-details-dialog.component';
import { ToastrService } from '../../Services/toastr.service';
import { TranslateService } from '../../Services/translate.service';
import { DialogService } from '../../Services/dialog.service';

@Component({
  selector: 'app-patient-installments',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './patient-installments.component.html',
  styleUrls: ['./patient-installments.component.scss']
})
export class PatientInstallmentsComponent implements OnInit, OnDestroy {
  installments: any[] = [];
  displayedColumns: string[] = ['index', 'patientName', 'amount', 'dueDate', 'description', 'actions', 'details'];
  dataSource = new MatTableDataSource<any>([]); // Data source
  isLoading = false;
  searchTerm = '';
  themeColor = 'primary';
  private themeSubscription!: Subscription;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private patientInstallmentService: PatientInstallmentService,
    private dialogService: DialogService,
    public themeService: ThemeService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.loadInstallments();
    this.subscribeToThemeChanges();
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
  }

  private subscribeToThemeChanges(): void {
    this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
      this.themeColor = color;
    });
  }

  private loadInstallments(): void {
    this.isLoading = true;
    this.patientInstallmentService.getAllInstallments().subscribe({
      next: (data) => {
        this.installments = this.sortInstallmentsByDueDate(data);
        this.updateDataSource();
      },
      error: (error) => this.handleError(error)
    });
  }

  private sortInstallmentsByDueDate(data: any[]): any[] {
    return data.sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());
  }

  private updateDataSource(): void {
    this.dataSource.data = this.installments;
    this.dataSource.paginator = this.paginator;
    this.isLoading = false;
  }

  private handleError(error: any): void {
    console.error(error);
    this.isLoading = false;
  }

  applyFilter(): void {
    this.isLoading = true;
    this.dataSource.filter = this.searchTerm.toLowerCase();
    this.isLoading = false;
  }

  openAddEditDialog(installment?: any): void {
    this.dialogService.openDialog(AddEditInstallmentDialogComponent, { installment }).subscribe(result => {
      if (result) {
        this.loadInstallments();
      }
    });
  }

  confirmDelete(id: string): void {
    this.dialogService.openDialog(ConfirmDialogComponent).subscribe(result => {
      if (result) {
        this.deleteInstallment(id);
      }
    });
  }

  private deleteInstallment(id: string): void {
    this.isLoading = true;
    this.patientInstallmentService.deleteInstallment(id).subscribe({
      next: () => {
        this.loadInstallments();
        this.toastr.success(this.translate.instant('INSTALLMENT_DELETED_SUCCESS'));
      },
      error: (error) => this.handleError(error)
    });
  }

  viewInstallmentDetails(element: any): void {
    const patientInstallments = this.installments.filter(i => i.patientName === element.patientName);
    this.dialogService.openDialog(InstallmentDetailsDialogComponent, 
      { patientName: element.patientName, installments: patientInstallments }, '80vw');
  }

  getThemeColor(): string {
    return this.themeColor === 'primary' ? '#003366' : '#b03060';
  }
}
