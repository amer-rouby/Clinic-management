import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { CourseService } from '../../../Services/course.service';
import { Course } from '../../../Models/course.module';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { ToastrService } from '../../../Services/toastr.service';
import { TranslateService } from '../../../Services/translate.service';
import { CategoryService } from '../../../Services/category.service';

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './add-course.component.html',
  styleUrls: ['./add-course.scss'],
})
export class AddCourseComponent implements OnInit {
  addCourseForm!: FormGroup;
  courseData: Course;
  ADD_OR_MODIFY_BUTTON = 'ADD_BUTTON';
  categoryList: any[] = [];
  @Output() courseAdded = new EventEmitter<Course>();

  constructor(
    private dialogRef: MatDialogRef<AddCourseComponent>,
    private fb: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService,
    private translate: TranslateService,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: Course
  ) {
    this.courseData = { ...data };
  }

  ngOnInit(): void {
    const defaultImgUrl = '../../assets/images/';
    this.initForm(defaultImgUrl);
    this.ADD_OR_MODIFY_BUTTON = this.courseData.id ? 'EDIT_BUTTON' : 'ADD_BUTTON';
    this.categoryList = this.categoryService.getCategoryTypes();
  }

  private initForm(defaultImgUrl: string): void {
    this.addCourseForm = this.fb.group({
      firstName: [this.courseData.firstName || '', Validators.required],
      lastName: [this.courseData.lastName || '', Validators.required],
      coursePrice: [this.courseData.coursePrice || null, [Validators.required, Validators.min(0)]],
      experienceInTheField: [
        this.courseData.experienceInTheField || null,
        [Validators.required, Validators.min(0)],
      ],
      description: [this.courseData.description || '', Validators.required],
      category: [this.courseData.category || null, [Validators.required, Validators.min(1)]],
      imgUrl: [this.courseData.imgUrl || defaultImgUrl, Validators.required],
    });
  }

  submitForm(): void {
    if (this.addCourseForm.valid) {
      const formData = { ...this.courseData, ...this.addCourseForm.value };

      const request = this.courseData.id
        ? this.courseService.updateCourse(formData)
        : this.courseService.addCourse(formData);

      request.subscribe({
        next: (response) => {
          const messageKey = this.courseData.id ? 'COURSE_UPDATED_SUCCESS' : 'COURSE_ADDED_SUCCESS';
          this.toastr.success(this.translate.instant(messageKey));
          this.courseAdded.emit(response);
          this.closeDialog();
        },
        error: (error) => console.error(error),
      });
    }
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
