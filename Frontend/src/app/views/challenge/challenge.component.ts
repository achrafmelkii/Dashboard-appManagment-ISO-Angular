import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import {ChallengeService} from'../../services/challenge.service';
import { Challenge } from '../../models/challenge';
import { TableModule } from 'primeng/table';
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
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { UserApiResponse,User } from '../../models/user';
import { switchMap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [CommonModule,FormsModule,TableModule,ButtonModule,InputTextModule,ReactiveFormsModule,ToastModule,DialogModule,ToolbarModule,RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.scss',
  providers: [MessageService, ConfirmationService]

})
export class ChallengeComponent implements OnInit  {
 users: any[] = [
 
  ] ;
  user: Observable<User>  = new Observable<User> ;
  challengeToAssign : Challenge  | any;
  newChallenge: any = {};
  editingChallenge: Challenge | any;
  challenges: any[] = [];
  productDialog: boolean = false;
  flag: boolean = false;
   showAssignUserForm: boolean = false;
     constructor( private challengeService: ChallengeService ,  private userService: UserService,private messageService: MessageService, private confirmationService: ConfirmationService ) { }
  
    ngOnInit(): void {
      this.loadChallenges();
      this. loadUsers();
      }
   loadChallenges()
    {
      this.challengeService.getAllChallenges().subscribe(response => {
        if (response.success) {
          this.challenges = response.challenges ?? [];
        } else {
          console.error('Failed to fetch users:', response.error);
        }
      });

    }
    loadUsers()
    {
      this.userService.getAllUsers().subscribe(response => {
        if (response.success) {
          this.users = response.users ?? [];
          
        } else {
          console.error('Failed to fetch users:', response.error);
        }
      });

    }
    editChallenge(challenge : Challenge)
    {
      this.editingChallenge = { ...challenge };
    }
    deleteChallenge(id: string)
    {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete the selected challenge?',
        header: 'Confirm',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
            this.challengeService.deleteChallenge(id).subscribe(() => {
              this.loadChallenges();
              this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'user Deleted', life: 3000 });
            });
    }});
    }
    
    openNew() {
      this.newChallenge = {
        DaysNum: 0,
        Completed: false,
        Title: '',
        CarbPts: 0,
        Text: '',
        ExpPts: 0
      };
      this.productDialog = true;
    }

  addChallenge() {
    this.challengeService.createChallenge(this.newChallenge).subscribe(() => {
      this.loadChallenges();
      this.newChallenge = { ID: '', Title: '', Description: '' };  
    });
  }

  updateChallenge(id: string, updateChallenge: any) {
    this.challengeService.updateChallenge(id, updateChallenge).subscribe(() => {
      this.cancelEdit(); 
      this.loadChallenges();
    });
  }
  cancelEdit() {
    this.editingChallenge = null;
  }

  hideDialog() {
    this.productDialog = false;
}
hideDialogAssignUsers() {
  this.showAssignUserForm = false;
}
assignUser(challenge : Challenge){
  this.showAssignUserForm = true;
  this.challengeToAssign=challenge
 
}
assignUsersToChallenge(userId : string)
 {
  
this.challengeService.assignChallenge(userId,this.challengeToAssign.ID).subscribe(() => {
 this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Challenge Assigned', life: 3000 });
});

  }

 
 
  
  
}
