import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { ConfirmDialogComponent } from '../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DentalClinic } from '../../Models/DentalClinic.module';
import { AddDentalClinicComponent } from './add-dental-clinic/add-dental-clinic.component';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
import { DentalClinicService } from '../../Services/dental-clinic.service';
import { DialogService } from '../../Services/dialog.service';
import { ToastrService } from '../../Services/toastr.service';
import { TranslateService } from '../../Services/translate.service';

@Component({
  selector: 'app-dental-clinic',
  standalone: true,
  templateUrl: './dental-clinic.component.html',
  providers: [provideNativeDateAdapter()],
  imports: [SharedMaterialModule],
  styleUrls: ['./dental-clinic.component.scss']
})
export class DentalClinicComponent implements OnInit {
  dentalClinicForm: FormGroup;
  dentalClinics: DentalClinic[] = [];
  selectedDentalClinics: DentalClinic[] = [];
  loadingData = false;
  currentPage = 0;
  itemsPerPage = 9;

  dataSource = new MatTableDataSource<DentalClinic>(this.dentalClinics);
  displayedColumns = ['checkbox', 'title', 'description', 'phoneNumber', 'date', 'updateButton', 'deleteButton'];

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder,
    private dialogService: DialogService,
    private dentalClinicService: DentalClinicService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.dentalClinicForm = this.createDentalClinicForm();
  }

  ngOnInit() {
    this.loadDentalClinics();
    this.dataSource.paginator = this.paginator;
  }

  private createDentalClinicForm(): FormGroup {
    return this.fb.group({
      title: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: ['', Validators.required],
      date: ['', Validators.required]
    });
  }

  loadDentalClinics(): void {
    this.loadingData = true;
    this.dentalClinicService.getAllDentalClinic().subscribe(dental => {
      this.dentalClinics = dental.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.dataSource.data = this.dentalClinics;
      this.loadingData = false;
    });
  }

  openAddDentalClinicDialog(): void {
    const emptyDentalClinic = this.createEmptyDentalClinic();
    this.dialogService.openDialog(AddDentalClinicComponent, emptyDentalClinic).subscribe(() => this.loadDentalClinics());
  }

  openEditDentalClinicDialog(dentalClinic: DentalClinic): void {
    this.dialogService.openDialog(AddDentalClinicComponent, { dental: dentalClinic }).subscribe(() => this.loadDentalClinics());
  }

  confirmDelete(dentalId: string): void {
    this.dialogService.openDialog(ConfirmDialogComponent).subscribe(result => {
      if (result) {
        this.deleteDentalClinic(dentalId);
      }
    });
  }

  private deleteDentalClinic(dentalId: string): void {
    this.loadingData = true;
    this.dentalClinicService.deleteDentalClinic(dentalId).subscribe(() => {
      this.loadingData = false;
      this.loadDentalClinics();
      this.toastr.success(this.translate.instant('DENTAL_CLINIC_DELETED_SUCCESS'));
    });
  }

  isAllSelected(): boolean {
    return this.selectedDentalClinics.length === this.paginatedDentalClinics.length;
  }

  selectAll(event: any): void {
    if (event.checked) {
      this.selectedDentalClinics = [...this.paginatedDentalClinics];
      this.paginatedDentalClinics.forEach(dentalClinic => dentalClinic.completed = true);
    } else {
      this.selectedDentalClinics = [];
      this.paginatedDentalClinics.forEach(dentalClinic => dentalClinic.completed = false);
    }
  }

  toggleSelection(dental: DentalClinic): void {
    dental.completed = !dental.completed;
    this.selectedDentalClinics = dental.completed
      ? [...this.selectedDentalClinics, dental]
      : this.selectedDentalClinics.filter(t => t.id !== dental.id);
  }

  isSelected(dental: DentalClinic): boolean {
    return dental.completed;
  }

  onPageChange(event: any): void {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }

  private get paginatedDentalClinics(): DentalClinic[] {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.dentalClinics.slice(startIndex, endIndex);
  }

  private createEmptyDentalClinic(): DentalClinic {
    return { id: '', title: '', date: new Date(), completed: false, phoneNumber: '', description: '' };
  }
}
