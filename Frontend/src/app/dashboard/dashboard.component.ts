import { Component, OnInit } from '@angular/core';
import { DataService } from '../services/data.service';
import { CommonModule } from '@angular/common';
import { UserService } from '../services/user.service';
import { AdminService } from '../services/admin.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UserApiResponse, User } from '../models/user';
import { TableModule } from 'primeng/table'; // Import TableModule
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnimateModule } from 'primeng/animate';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule,FormsModule,TableModule,ButtonModule,InputTextModule,ReactiveFormsModule,ToastModule,DialogModule,ToolbarModule,RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
  providers: [MessageService, ConfirmationService]
})
export class DashboardComponent implements OnInit {
  users: User[] = []; // Make users nullable
  newUser: any = {};
  editingUser: User | any;
  constructor(private userService: UserService, private messageService: MessageService, private confirmationService: ConfirmationService) {}
  productDialog: boolean = false;
  editing: boolean = false;
  ngOnInit() {
    this.loadUsers();
  }
  openNew() {
    this.newUser = { ID: '', Name: '', Score: 0, Index: 0, List: {}, Level: 0, ExpPts: 0, CarbPts: 0 };
    this.productDialog = true;
    this.editing = false;
}
  loadUsers() {
    this.userService.getAllUsers().subscribe(response => {
      if (response.success) {
        this.users = response.users ?? [];
      } else {
        console.error('Failed to fetch users:', response.error);
        this.messageService.add({ severity: 'error', summary: 'Failed to fetch users', detail: response.error });
      }
    });
  }

  addUser() {
    this.userService.createUser(this.newUser).subscribe(response => {
      if(response.error){
        console.error('Failed to add user:', response.error);
        this.messageService.add({ severity: 'error', summary: 'Failed to add user', detail: response.error });
      }else
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user created successfully !', life: 3000 });
      this.loadUsers();
      this.newUser = { ID: '', Name: '', Score: 0, Index: 0, List: {}, Level: 0, ExpPts: 0, CarbPts: 0 }; // Clear the form
    });
  }

  editUser(user: User) {
    this.editing = true;
    this.editingUser = { ...user }; // Create a copy of the user to edit
  }

  updateUser(id: string, updatedUser: any) {
    this.userService.updateUser(id, updatedUser).subscribe(response => {
      if(response.error){
        console.error('Failed to update user:', response.error);
        this.messageService.add({ severity: 'error', summary: 'Failed to update the user', detail: response.error });
      }else
      this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user updated successfully !', life: 3000 });
      this.cancelEdit(); // Clear the editing state
      this.loadUsers();
    });
  }

  cancelEdit() {
    this.editingUser = null;
    this.editing = false;
  }

  deleteUser(id: string) {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.userService.deleteUser(id).subscribe(response => {

            this.loadUsers();
            if(response.error){
              console.error('Failed to delete the user:', response.error);
              this.messageService.add({ severity: 'error', summary: 'Failed to delete the user', detail: response.error });
            }else
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000 });
          });
  }});
  }
  hideDialog() {
    this.productDialog = false;
    this.editing = false;
   // this.submitted = false;
}

}
