import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service'; // Import your authentication service
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { SpinnerModule } from 'primeng/spinner';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [MessageService],
  
})
export class LoginComponent {
  username: string = '';
  password: string = '';
  loginForm: FormGroup;
  loading :boolean = false;
  constructor(private authService: AuthService, private router: Router, private fb: FormBuilder,private messageService: MessageService) {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });

  }

  ngOnInit() {
    this.loginForm.get('username')?.valueChanges.subscribe((value) => {
      // You can perform real-time validation or update UI based on the value
      if (value.trim() === '') {
        // Username is empty
        console.log('Username is required in real-time');
        // You can also display an error notification to the user
      }
    });

    this.loginForm.get('password')?.valueChanges.subscribe((value) => {
      // You can perform real-time validation or update UI based on the value
      if (value.trim() === '') {
        // Password is empty
        console.log('Password is required in real-time');
        // You can also display an error notification to the user
      }
    });
  }


signIn() {
  this.loading = true;
  this.authService.loginMicro().subscribe(
    (response) => {
      console.log('Login successful:', response);
      this.loading = false;
      // Redirect or perform other actions upon successful login
      this.router.navigate(['/dashboard']);
    },
    (error) => {
      this.loading = false;
      //console.error('Login failed:', error);
      if(error){
        console.error('Login failed:', error);
        this.messageService.add({ severity: 'error', summary: 'Login failed:', detail: error.error });
      }
      // Handle login failure, show error message, etc.
    }
  );
  }

  onSubmit() {
    //event.preventDefault();
    // Check if the form is valid before attempting to login
    console.log("hello");
    if (this.loginForm.valid) {
      // Call the login method from your AuthService
      this.authService.loginEmail(this.loginForm.value.username, this.loginForm.value.password).subscribe(
        (response) => {
          console.log('Login successful:', response);
          // Redirect or perform other actions upon successful login
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          //console.error('Login failed:', error);
          if(error){
            console.error('Login failed:', error);
            this.messageService.add({ severity: 'error', summary: 'Login failed:', detail: error.error });
          }
          // Handle login failure, show error message, etc.
        }
      );
    }else {
      if (this.loginForm.get('username')?.hasError('required')) {
        // Username is empty, show an error message
        console.log('Username is required');
        // You can also display an error notification to the user
      }
  
      if (this.loginForm.get('password')?.hasError('required')) {
        // Password is empty, show an error message
        console.log('Password is required');
        // You can also display an error notification to the user
      }
      console.log('Form is invalid');
    }
  }
}
