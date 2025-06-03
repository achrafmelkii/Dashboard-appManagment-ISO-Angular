import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from 'src/app/services/notification.service';
import { FormsModule,ReactiveFormsModule,Validators,FormControl,FormGroup } from '@angular/forms';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { CardModule } from 'primeng/card';
@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule,FormsModule,ToastModule,ConfirmDialogModule,InputTextModule,ReactiveFormsModule,
    ButtonModule,RippleModule,CardModule],
  templateUrl: './notification.component.html',
  styleUrl: './notification.component.scss',
  providers: [MessageService, ConfirmationService]
})
export class NotificationComponent {
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    datetime: new FormControl('') 
  });
  message: string = ''; // Declare the 'message' property
  datetime: string = '';
  title : string = '';

  constructor(private notificationService: NotificationService,private messageService: MessageService, private confirmationService: ConfirmationService) {}

  sendMessage(): void {
    if(this.message == '' || this.title == ''){
      console.error('Message and title must not be empty.');
      this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Message and Title fields must not be empty.' });
      return;
    }
    this.confirmationService.confirm({
      message: 'Are you sure you want to send this notification to all users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        if (this.datetime) {
          // If datetime is provided, include it in the request
          this.notificationService.sendNotification(this.message, this.title, this.datetime)
            .subscribe(response => {
              console.log(response);
              if (response.error) {
                console.error('Failed to send the notification:', response.error);
                this.messageService.add({ severity: 'error', summary: 'Failed to send the notification:', detail: response.error });
              } else
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Notification Sent !', life: 3000 });
            },(error) => {
              console.error('Failed to send the notification:',error);
              this.messageService.add({ severity: 'error', summary: 'Failed to send the notification:', detail: error.error.error });
            });
        }else{
          this.notificationService.sendNotification(this.message, this.title)
        .subscribe((response) => {
          console.log(response);
          if(response.error){
            console.error('Failed to send the notification:', response.error);
            this.messageService.add({ severity: 'error', summary: 'Failed to send the notification:', detail: response.error });
          }else
          this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Notification Sent !', life: 3000 });
        },(error) => {
          this.messageService.add({ severity: 'error', summary: 'Failed to send the notification:', detail: error.error.error });
        });
      }
  }});
      
  }
}
