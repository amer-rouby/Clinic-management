import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DentalClinic } from '../../Models/DentalClinic.module';
import { AddDentalClinicComponent } from './add-dental-clinic/add-dental-clinic.component';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';
import { DentalClinicService } from '../../Services/dental-clinic.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';


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
  dental: DentalClinic[] = [];
  newDental: DentalClinic = this.createEmptyDenta();
  currentPage: number = 0;
  itemsPerPage: number = 9;
  selectedDentalClinic: DentalClinic[] = [];
  loadingData: boolean = false;
  dataSource = new MatTableDataSource<DentalClinic>(this.dental);
  displayedColumns: string[] = [
    'checkbox', 'title', 'description',
    'phoneNumber', 'date', 'updateButton',
    'deleteButton'
  ];


  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;

  constructor(
    private fb: FormBuilder, 
    private dialog: MatDialog,
    private dentalClinicService: DentalClinicService,
    private toastr: ToastrService,
    private translate: TranslateService
  ) {
    this.dentalClinicForm = this.fb.group({
      title: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]+$')]],
      description: ['', Validators.required],
      date: ['', Validators.required],
    });
  }

  ngOnInit() {
    this.loadDental();
    this.dataSource.paginator = this.paginator;

  }

  createEmptyDenta(): DentalClinic {
    return { id: '', title: '', date: new Date(), completed: false, phoneNumber: '', description: '' };
  }

  loadDental() {
    this.loadingData = true;
    this.dentalClinicService.getAllDentalClinic().subscribe(dental => {
      this.dental = dental.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.dataSource.data = this.dental;
      this.loadingData = false;
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDentalClinicComponent, {
      width: '600px',
      height: "450px"
    });

    dialogRef.componentInstance.dentalClinicAdded.subscribe(() => this.loadDental());
  }

  editDentalClinicDialog(dentalClinic: DentalClinic) {
    const dialogRef = this.dialog.open(AddDentalClinicComponent, {
      width: '600px',
      height: '450px',
      data: { dental: dentalClinic }
    });
  
    dialogRef.componentInstance.dentalClinicAdded.subscribe(() => this.loadDental());
  }
  

  confirmDelete(dentalId: string) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deleteDenta(dentalId);
      }
    });
  }

  deleteDenta(dentalId: string) {
    this.loadingData = true;
    this.dentalClinicService.deleteDentalClinic(dentalId).subscribe(() => {
      this.loadingData = false;
      this.loadDental();
      this.toastr.success(this.translate.instant('DENTAL_CLINIC_DELETED_SUCCESS'));

    });
  }

  isAllSelected(): boolean {
    const numSelected = this.selectedDentalClinic.length;
    const numRows = this.paginatedDentalClinic.length;
    return numSelected === numRows;
  }

  selectAll(event: any) {
    if (event.checked) {
      this.selectedDentalClinic= [...this.paginatedDentalClinic];
      this.paginatedDentalClinic.forEach(dentalClinic => dentalClinic.completed = true);
    } else {
      this.selectedDentalClinic= [];
      this.paginatedDentalClinic.forEach(dentalClinic => dentalClinic.completed = false);
    }
  }

  toggleSelection(dental: DentalClinic) {
    dental.completed = !dental.completed;
    if (dental.completed) {
      this.selectedDentalClinic.push(dental);
    } else {
      this.selectedDentalClinic = this.selectedDentalClinic.filter(t => t.id !== dental.id);
    }
  }

  isSelected(dental: DentalClinic): boolean {
    return dental.completed;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }

  get paginatedDentalClinic(): DentalClinic[] {
    const startIndex = this.currentPage * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    return this.dental.slice(startIndex, endIndex);
  }


}
