import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable, Subscription } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { CourseService } from '../../../Services/course.service';
import { Course } from '../../../Models/course.module';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { ThemeService } from '../../../Services/theme.service';
import { PageNotFoundComponent } from '../../page-no-found/page-no-found.component';

@Component({
  selector: 'app-course-details',
  standalone: true,
  imports: [PageNotFoundComponent, SharedMaterialModule],
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.scss'],
})
export class CourseDetailsComponent implements OnInit, OnDestroy {
  courseData!: Course;
  loadingData = false;
  themeColor = 'THEME_PRIMARY';
  private themeSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private courseService: CourseService,
    private themeService: ThemeService
  ) {}

  ngOnInit(): void {
    this.loadCourseData();
    this.subscribeToThemeChanges();
  }

  private loadCourseData(): void {
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

  private subscribeToThemeChanges(): void {
    this.themeSubscription = this.themeService.themeColor$.subscribe(color => {
      this.themeColor = color;
    });
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }

  getThemeColor(): string {
    return this.themeColor === 'THEME_PRIMARY' ? '#003366' : '#b03060';
  }
}
