import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';

import { Course } from '../../../Models/course.module';
import { CourseCardComponent } from '../course-card-component/course-card-component';
import { PageNotFoundComponent } from '../../page-no-found/page-no-found.component';
import { CourseService } from '../../../Services/course.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { ThemeService } from '../../../Services/theme.service';
import { DialogService } from '../../../Services/dialog.service';

@Component({
    selector: 'app-courses',
    standalone: true,
    imports: [
        SharedMaterialModule,
        CourseCardComponent,
        PageNotFoundComponent,
    ],
    templateUrl: './courses.component.html',
    styleUrls: ['./courses.scss']
})
export class CoursesComponent implements OnInit, OnDestroy {
    courses: Course[] = [];
    pagedCourses: Course[] = [];
    filteredCourses: Course[] = [];
    loadingData = false;
    searchTerm = '';
    themeColor = 'primary';
    pageSize = 4;
    currentPage = 0;
    totalPages = 0;

    @ViewChild(MatPaginator) paginator!: MatPaginator;
    private themeSubscription!: Subscription;

    constructor(
        private dialogService: DialogService,
        private courseService: CourseService,
        private themeService: ThemeService
    ) {}

    ngOnInit(): void {
        this.loadCourses();
        this.subscribeToThemeChanges();
    }

    ngOnDestroy(): void {
        this.unsubscribeFromThemeChanges();
    }

    // Dialog Functions
    openDialog(): void {
        this.dialogService.openDialog(AddCourseComponent, {}).subscribe(() => {
            this.loadCourses();
        });
    }

    editCourse(course: Course): void {
        this.dialogService.openDialog(AddCourseComponent, course).subscribe(() => {
            this.loadCourses();
        });
    }

    // Course Operations
    loadCourses(): void {
        this.loadingData = true;
        this.courseService.getAllCourses().subscribe(courses => {
            if (courses && courses.length) {
                this.courses = [...courses];  // Ensures new reference for change detection
                this.loadingData = false;
                this.filteredCourses = [...this.courses]; // Initialize filtered courses
                this.updatePagedCourses();
            }
        });
    }

    applyFilter(description: string): void {
        this.loadingData = true;
        this.courseService.searchCoursesByDescription(description).subscribe(results => {
            this.loadingData = false;
            this.filteredCourses = results;
            this.updatePagedCourses();
        });
    }

    updatePagedCourses(): void {
        const startIndex = this.currentPage * this.pageSize;
        const endIndex = Math.min(startIndex + this.pageSize, this.filteredCourses.length);
        this.pagedCourses = this.filteredCourses.slice(startIndex, endIndex);
    }

    // Pagination
    onPageChange(event: PageEvent): void {
        if (event) {
            this.pageSize = event.pageSize;
            this.currentPage = event.pageIndex;
            this.updatePagedCourses();
        }
    }

    // Event Handlers
    onCourseClicked(updatedCourses: Course[]): void {
        this.courses = updatedCourses;
        this.applyFilter(this.searchTerm);
    }

    // Utility
    getThemeColor(): string {
        return this.themeColor === 'primary' ? '#003366' : '#b03060';
    }

    // Private Methods for Theme Management
    private subscribeToThemeChanges(): void {
        this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
            this.themeColor = color;
        });
    }

    private unsubscribeFromThemeChanges(): void {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }
}
