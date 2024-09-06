import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { Course } from '../../../Models/course.module';
import { CourseCardComponent } from '../course-card-component/course-card-component';
import { PageNotFoundComponent } from '../../page-no-found/page-no-found.component';
import { CourseService } from '../../../Services/course.service';
import { AddCourseComponent } from '../add-course/add-course.component';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { ThemeService } from '../../../Services/theme.service';

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
export class CoursesComponent implements OnInit {

    courses: Course[] = [];
    pagedCourses: Course[] = [];
    filteredCourses: Course[] = [];

    loadingData: boolean = false;
    searchTerm: string = '';
    themeColor: string = 'primary';
    themeSubscription!: Subscription;
    pageSize = 4;
    currentPage = 0;
    totalPages = 0;
    @ViewChild(MatPaginator) paginator!: MatPaginator;

    constructor(
        public dialog: MatDialog,
        private courseService: CourseService,
        public themeService: ThemeService
    ) { }

    ngOnInit(): void {
        this.loadCourses();
        this.applyFilter(this.searchTerm);
        this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
            this.themeColor = color;
        });
    }

    ngOnDestroy(): void  {
        if (this.themeSubscription) {
            this.themeSubscription.unsubscribe();
        }
    }

    // Dialog functions
    openDialog(): void {
        const dialogRef = this.dialog.open(AddCourseComponent, {
            width: '800px',
            height: "500px"
        });
        dialogRef.componentInstance.courseAdded.subscribe(() => {
            this.loadCourses();
        });
    }

    editCourse(course: Course): void {
        const dialogRef = this.dialog.open(AddCourseComponent, {
            width: '800px',
            height: "500px",
            data: course
        });
        dialogRef.componentInstance.courseAdded.subscribe(() => {
            this.loadCourses();
        });
    }

    // Course operations
    loadCourses(): void {
        this.loadingData = true;
        this.courseService.getAllCourses().subscribe(courses => {
            if (courses && courses.length) {
                this.courses = courses.map(course => ({
                    ...course,
                    id: course.id // Assuming id is already present in each course object
                }));
                this.loadingData = false;
                this.filteredCourses = this.courses;
                this.updatePagedCourses(); // Update the paged courses
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

    // Event handlers
    onCourseClicked(updatedCourses: Course[]): void {
        this.courses = updatedCourses;
        this.applyFilter(this.searchTerm);
    }

    // Utility
    getThemeColor(): any {
        return this.themeColor === 'primary' ? '#3f51b5' : '#e91e63';
    }
}
