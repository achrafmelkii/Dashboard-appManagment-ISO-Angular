import { Component, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';
import { AdminService } from '../../services/admin.service';
import { UserService } from '../../services/user.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UserApiResponse, User } from '../../models/user';
import { AdminApiResponse, Admin,Historique } from '../../models/user';
import { TableModule } from 'primeng/table'; // Import TableModule
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnimateModule } from 'primeng/animate';
import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
import { ScrollerModule } from 'primeng/scroller';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,FormsModule,TableModule,ButtonModule,InputTextModule,ReactiveFormsModule,ToastModule,DialogModule,ToolbarModule,
    RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule,ScrollerModule,CheckboxModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
  providers: [MessageService, ConfirmationService,DatePipe]
})
export class AdminComponent {
  admins: Admin[] = []; // Make users nullable
  newAdmin: any = {};
  history:Historique[] = []; 
  editingAdmin: Admin | any;
  hist:any = {};
  users!: any[];
  editingUser!: any;
  constructor(private authService:AuthService,private datePipe: DatePipe,private adminService: AdminService,private userService:UserService, private messageService: MessageService, private confirmationService: ConfirmationService) {}
  productDialog: boolean = false;
  editmode: boolean = false;
  historymode: boolean = false;
  ngOnInit() {
    this.authService.getCurrentUser().subscribe((user: firebase.User | null) => {
      if(!user) {return;}
      const uid = user.uid ;
      this.authService.checkSuperAdmin(uid).then(isSuperAdmin => {
        console.log('Is super admin:', isSuperAdmin);
       
        // Here you can do something with the isSuperAdmin value
      });
    });
    this.loadAdmins();
    this.loadUsers();
    this.loadHistory();
    this.editingUser = {};
  }
  openNew() {
    this.newAdmin = { email: '', isSuperAdmin: false};
    this.productDialog = true;
    this.editingUser = {};
}

  OpenHistory(){
    this.loadHistory();
    this.historymode = true;
  }
  CloseHistory(){
    this.historymode = false;
  
  }

  loadAdmins() {
    this.admins = [];
    this.editingAdmin = null;
    this.adminService.getAllAdmins().subscribe(response => {
      if (response.success) {
        this.admins = response.admins ?? [];
        console.log(this.admins);
      } else {
        if(response.error){
          console.error('Failed to fetch admins:', response.error);
          this.messageService.add({ severity: 'error', summary: 'Failed to fetch admins', detail: response.error });
        }
      }
    });
  }
  loadHistory() {
    this.history = [];
    this.adminService.getHistory().subscribe(response => {
      if (response.success) {
        this.history = response.history ?? [];
        console.log(this.history);
      } else {
        if(response.error){
          console.error('Failed to fetch history:', response.error);
          this.messageService.add({ severity: 'error', summary: 'Failed to fetch history', detail: response.error });
        }
      }
    });
  }

  loadUsers() {
    this.users = [];
    this.editingUser = null;
    this.adminService.getUsersEmails().subscribe(response => {
      if (response.success) {
        this.users = response.users ?? [];
        console.log(this.users);
      } else {
        if(response.error){
          console.error('Failed to fetch users:', response.error);
          this.messageService.add({ severity: 'error', summary: 'Failed to fetch users', detail: response.error });
        }
      }
    });
  }
 

  addAdmin() {

     console.log(this.editingUser);

    this.newAdmin = {  ID: this.editingUser.uid,email: this.editingUser.email , name: this.editingUser.displayName
      , isSuperAdmin: false };

    this.adminService.createAdmin(this.newAdmin).subscribe(response => {
      if(response.error){
        console.error('Failed to create the admin:', response.error);
        this.messageService.add({ severity: 'error', summary: 'Failed to create the admin', detail: response.error });
      }else
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'admin created successfully !', life: 3000 });
      this.loadAdmins();
      this.newAdmin = {  email: '', isSuperAdmin: false }; // Clear the form
    });
  }

  editAdmin(user: Admin) {
    this.editmode = true;
    this.editingAdmin = { ...user }; // Create a copy of the user to edit
  }

  updateAdmin(id: string, updatedUser: any) {
    this.adminService.updateAdmin(id, updatedUser).subscribe(response => {
      if(response.error){
        console.error('Failed to update the admin:', response.error);
        this.messageService.add({ severity: 'error', summary: 'Failed to update the admin', detail: response.error });
      }else
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'admin updated successfully !', life: 3000 });
      this.cancelEdit(); // Clear the editing state
      this.loadAdmins();
    });
  }

  cancelEdit() {
    this.editingAdmin = null;
    this.editmode = false;
    this.editingUser = null;
  }

  deleteAdmin(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected admin?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.adminService.deleteAdmin(id).subscribe(response => {
            this.loadAdmins();
            this.loadUsers();
            if(response.error){
              console.error('Failed to delete the admin:', response.error);
              this.messageService.add({ severity: 'error', summary: 'Failed to delete the admin', detail: response.error });
            }else
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'admin Deleted', life: 3000 });
          });
  }});
  }
  hideDialog() {
    this.productDialog = false;
    this.editingUser = null;
   // this.submitted = false;
}
}
