import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent {
  registerForm: FormGroup;

  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder) {
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  onSubmit(event: Event) {
    event.preventDefault();

    if (this.registerForm.valid) {
      // Check if passwords match
      const password = this.registerForm.value.password;
      const repeatPassword = this.registerForm.value.repeatPassword;

      if (password === repeatPassword) {
        // Call the registration method from your AuthService
        this.authService.register(this.registerForm.value.email,this.registerForm.value.password).subscribe(
          (response) => {
            console.log('Registration successful:', response);
            // Redirect or perform other actions upon successful registration
            this.router.navigate(['/dashboard']);
          },
          (error) => {
            console.error('Registration failed:', error);
            // Handle registration failure, show error message, etc.
          }
        );
      } else {
        console.log('Passwords do not match');
        // You can also display an error notification to the user
      }
    } else {
      console.log('Form is invalid');
      // Handle invalid form (if needed)
    }
  }
}
