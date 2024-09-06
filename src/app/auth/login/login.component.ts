import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../Services/Auth.service';
import { SharedMaterialModule } from '../../../Shared/modules/shared.material.module';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [SharedMaterialModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;
  loginError = '';
  loadingData = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  login(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      this.authService.signIn(username, password).subscribe(
        res => {
          console.log(res);
          this.router.navigate(['/home']);
          this.loginError = '';
        },
        error => {
          console.error(error);
          this.loginError = 'Invalid email or password';
        }
      );
    }
  }

  onSubmit(): void {
    this.loadingData = true;
    setTimeout(() => {
      this.login();
      this.loadingData = false;
    }, 500);
  }
}
