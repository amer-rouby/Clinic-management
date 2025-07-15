import { Component, EventEmitter, Output, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CourseService } from '../../../Services/course.service';
import { Course } from '../../../Models/course.module';
import { SharedMaterialModule } from '../../../../Shared/modules/shared.material.module';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

export const CategoryTypeData = [
  {
    id:1,
    arabic: "مبتدئين",
    english: "Beginners"
  },
  {
    id:2,
    arabic: "متوسط",
    english: "Intermediate"
  },
  {
    id:3,
    arabic: "متقدم",
    english: "Advanced"
  },
  {
    id:4,
    arabic: "أخرى",
    english: "Other"
  }
];

@Component({
  selector: 'app-add-course',
  standalone: true,
  imports: [
    SharedMaterialModule
  ],
  templateUrl: './add-course.component.html',
  styleUrls: ["./add-course.scss"]
})
export class AddCourseComponent implements OnInit {
  addCourseForm!: FormGroup;
  courseData: Course;
  ADD_OR_MODIFY_BUTTON = "ADD_BUTTON";
  categorys = CategoryTypeData;
  @Output() courseAdded = new EventEmitter<Course>();

  constructor(
    public dialogRef: MatDialogRef<AddCourseComponent>,
    private fb: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService,
    private translate: TranslateService,
    @Inject(MAT_DIALOG_DATA) public data: Course
  ) {
    this.courseData = { ...data };
  }

  ngOnInit(): void {
    const defaultImgUrl = '../../assets/images/';
    this.addCourseForm = this.fb.group({
      firstName: [this.courseData.firstName || '', Validators.required],
      lastName: [this.courseData.lastName || '', Validators.required],
      coursePrice: [this.courseData.coursePrice || null, [Validators.required, Validators.min(0)]],
      experienceInTheField: [this.courseData.experienceInTheField || null, [Validators.required, Validators.min(0)]],
      description: [this.courseData.description || '', Validators.required],
      category: [this.courseData.category || null, [Validators.required, Validators.min(0)]],
      imgUrl: [this.courseData.imgUrl || defaultImgUrl, Validators.required],
    });

    if (this.courseData.id) {
      this.ADD_OR_MODIFY_BUTTON = 'EDIT_BUTTON'
    }
  }

  addCourse() {
    if (this.addCourseForm.valid) {
      const formData = { ...this.courseData, ...this.addCourseForm.value };

      if (this.courseData.id) {
        this.courseService.updateCourse(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('COURSE_UPDATED_SUCCESS'));
            this.courseAdded.emit(response);
            this.onClose();
          },
          error: (error) => {
            console.error(error);
          },
        });
      } else {
        this.courseService.addCourse(formData).subscribe({
          next: (response) => {
            this.toastr.success(this.translate.instant('COURSE_ADDED_SUCCESS'));
            this.courseAdded.emit(response);
            this.onClose();
          },
          error: (error) => {
            console.error(error);
          },
        });
      }
    }
  }

  onClose(): void {
    this.dialogRef.close();
  }
}
