import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service'; // Import your authentication service
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout.component.html',
  styleUrl: './logout.component.scss'
})
export class LogoutComponent {
  constructor(private authService: AuthService,private router: Router) {}

  // Function to handle logout
  logout() {
    this.authService.logout().subscribe(
      (response) => {
        console.log('Logout successful:', response);
        
        // Redirect or perform other actions upon successful logout
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Logout failed:', error);
        // Handle logout failure, show error message, etc.
      }
    );
  }
}
