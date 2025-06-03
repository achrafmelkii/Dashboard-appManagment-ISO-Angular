import { Component, Input,OnInit  } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
import { ClassToggleService, HeaderComponent } from '@coreui/angular';
import { AuthService } from '../../../services/auth.service';
import firebase from 'firebase/compat/app';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
@Component({
  selector: 'app-default-header',
  templateUrl: './default-header.component.html',
})
export class DefaultHeaderComponent extends HeaderComponent{

  @Input() sidebarId: string = "sidebar";
  currentUser: firebase.User | null = null;
  isSuperAdmin:boolean = false;
  superAdmin:string = "ROLE: Admin";
  photoUrl :string = "";
  hasPhoto: boolean = false;
  public newMessages = new Array(4)
  public newTasks = new Array(5)
  public newNotifications = new Array(5)
  Letter :string = "";
  constructor(private classToggler: ClassToggleService,private authService:AuthService,private router: Router) {
    super();
  }
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: firebase.User | null) => {
      this.currentUser = user;
      console.log('Current user:', this.currentUser);
      if(!user) {return;}
      if(user.photoURL){
        this.hasPhoto = true;
        this.photoUrl = user.photoURL;
      }
      const uid = user.uid ;
      this.Letter = user.displayName ? user.displayName.charAt(0).toUpperCase() : "";
      this.authService.checkSuperAdmin(uid).then(isSuperAdmin => {
        console.log('Is super admin:', isSuperAdmin);
        this.isSuperAdmin = isSuperAdmin;
        if(isSuperAdmin)
        this.superAdmin = "ROLE: Super Admin";
        // Here you can do something with the isSuperAdmin value
      });
    });
  }
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
