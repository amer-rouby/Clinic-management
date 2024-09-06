import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DateFormatDirective } from '../Directives/date-format.directive';
import { DisableRightClickDirective } from '../Directives/disable-right-click.directive';
import { TruncatePipe } from '../../app/pipes/truncate.pipe';

const modules = [
  CommonModule,
  FormsModule,
  ReactiveFormsModule,
  RouterModule,
  MatToolbarModule,
  MatButtonModule,
  MatFormFieldModule,
  MatSelectModule,
  MatIconModule,
  MatMenuModule,
  MatInputModule,
  MatCheckboxModule,
  MatTableModule,
  MatPaginatorModule,
  MatDatepickerModule,
  MatDividerModule,
  MatProgressSpinnerModule,
  MatDialogModule,
  MatCardModule,
  MatNativeDateModule,
  MatSidenavModule,
  MatListModule,
  TranslateModule,
  MatSlideToggleModule,
];

@NgModule({
  imports: modules,
  declarations: [DateFormatDirective, DisableRightClickDirective,TruncatePipe], // Declare the directive here
  exports: [...modules, DateFormatDirective, DisableRightClickDirective, TruncatePipe] // Export the directive if needed
})
export class SharedMaterialModule {}

