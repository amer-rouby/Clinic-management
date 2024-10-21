import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CourseService } from '../../../Services/course.service';
import { PageNotFoundComponent } from '../../page-no-found/page-no-found.component';
import { Course } from '../../../Models/course.module';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../../Services/theme.service';

@Component({
    selector: 'app-course-details',
    standalone: true,
    imports: [
        PageNotFoundComponent,
        SharedMaterialModule
    ],
    templateUrl: './course-details.component.html',
    styleUrls: ['./course-details.scss']
})
export class CourseDetailsComponent implements OnInit {
    courseData!: Course;
    loadingData: boolean = false;
    private themeSubscription!: Subscription;

    themeColor: string = 'primary';
    constructor(private activatedRoute: ActivatedRoute,
         private courseService: CourseService,
         private themeService: ThemeService, ) { }

    ngOnInit(): void {
        this.activatedRoute.queryParamMap.pipe(
            switchMap((params: ParamMap) => {
                const courseId = params.get('id');
                return this.getCourse(courseId);
            })
        ).subscribe((course: Course | undefined) => {
            if (course) {
                this.loadingData = false;
                this.courseData = course;
            }
        });
        this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
            this.themeColor = color;
        })
    }

    private getCourse(courseId: string | null): Observable<Course | undefined> {
        this.loadingData = true;
        if (!courseId) {
            return new Observable(observer => observer.next(undefined));
        }
        return this.courseService.getAllCourses().pipe(
            map(courses => courses.find((c: Course) => c.id === courseId))
        );

    }
    ngOnDestroy() {
        if (this.themeSubscription) {
          this.themeSubscription.unsubscribe();
        }
      }
      getThemeColor(): any {
        return this.themeColor === 'primary' ? '#003366' : '#b03060'; 
      }
}
