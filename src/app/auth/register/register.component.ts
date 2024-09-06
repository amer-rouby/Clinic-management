import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../Services/Auth.service';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';

@Component({
  selector: 'app-register',
  standalone:true,
  imports:[SharedMaterialModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword = true;
  loadingData: boolean = false;
  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    }, { validator: this.passwordMatchValidator });
  }

  register(): void {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authService.signUp(username, password).subscribe(
        res => {
          console.log(res);
          // Handle successful registration here
        },
        error => {
          console.error(error);
          // Handle registration error here
        }
      );
    }
  }

  passwordMatchValidator(form: FormGroup) {
    return form.get('password')!.value === form.get('confirmPassword')!.value
      ? null : { mismatch: true };
  }

  onSubmit(): void {
    this.loadingData = true;
    setTimeout(() => {
      this.register();
      this.registerForm.reset()
      this.loadingData = false;
    }, 500);
;
  }
}
