import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { Course } from '../Models/course.module';
import { FirebaseService } from './Firebase.service';

@Injectable({
    providedIn: 'root'
})
export class CourseService extends FirebaseService {

    getAllCourses(): Observable<Course[]> {
        return this.get<{ [key: string]: any }>('courses').pipe(
            map(data => {
                if (data && Object.keys(data).length) {
                    return Object.keys(data).map(key => {
                        let course = data[key];
                        course.id = key;
                        return course as Course;
                    });
                }
                return [];
            })
        );
    }

    addCourse(course: Course): Observable<Course> {
        return this.post<Course>('courses', course);
    }

    updateCourse(course: Course): Observable<Course> {
        const courseId = course.id;
        // Remove id property to prevent sending it to Firebase
        delete course.id;
        return this.put<Course>(`courses/${courseId}`, course).pipe(
            map(() => {
                course.id = courseId; // Restore id property after update
                return course;
            })
        );
    }

    deleteCourse(courseId: string): Observable<void> {
        return this.delete(`courses/${courseId}`);
    }

    searchCoursesByDescription(description: string): Observable<Course[]> {
        return this.getAllCourses().pipe(
            map(courses => {
                return courses.filter(course =>
                    course.description.toLowerCase().includes(description.toLowerCase())
                );
            })
        );
    }
}
