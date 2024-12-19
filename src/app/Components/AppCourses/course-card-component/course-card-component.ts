import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Router } from '@angular/router';
import { ConfirmDialogComponent } from '../../../materail-ui/delete-confirm-dialog/confirm-dialog.component';
import { CourseService } from '../../../Services/course.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';

import { DialogService } from '../../../Services/dialog.service';
import { ToastrService } from '../../../Services/toastr.service';
import { TranslateService } from '../../../Services/translate.service';

@Component({
    selector: 'app-course-card-component',
    standalone: true,
    imports: [
        SharedMaterialModule,
        AddCourseComponent
    ],
    templateUrl: './course-card-component.html',
    styleUrls: ["./course-card.scss"]
})
export class CourseCardComponent {
    @Input() course: any; // Represents a single course
    @Input() pagedCourses: any; // Represents a list of courses
    @Input() index!: number; // Index of the current course
    @Input() count!: number; // Total number of courses
    @Output() loadCourses = new EventEmitter<any>(); // Emits an event to reload courses

    constructor(
        private dialogService: DialogService,
        private router: Router,
        private courseService: CourseService,
        private toastr: ToastrService,
        private translate: TranslateService
    ) { }

    viewCourse(course: any): void {
        this.router.navigate(['course'], { queryParams: { id: course.id } });
    }

    editCourse(course: any): void {
        this.dialogService.openDialog(AddCourseComponent, course || null).subscribe(result => {
            if (result) {
                this.toastr.success(this.translate.instant('COURSE_UPDATED_SUCCESS'));
                this.loadCourses.emit();
            }
        });
    }

    deleteCourse(id: string): void {
        if (id) {
            this.courseService.deleteCourse(id).subscribe({
                next: () => {
                    this.toastr.success(this.translate.instant('COURSE_DELETED_SUCCESS'));
                    this.loadCourses.emit();
                },
                error: (err) => {
                    console.error(err);
                    this.toastr.error(this.translate.instant('COURSE_DELETE_ERROR'));
                }
            });
        }
    }

    confirmDelete(courseId: string): void {
        this.dialogService.openDialog(ConfirmDialogComponent, {}, '400px').subscribe(result => {
            if (result) {
                this.deleteCourse(courseId);
            }
        });
    }
}
