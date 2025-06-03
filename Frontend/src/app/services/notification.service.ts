// notification.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private apiUrl = 'http://localhost:3000/api/users/sendNotification';

  constructor(private http: HttpClient) {}

  sendNotification(message: string,title : string, datetime?: string): Observable<any> {
    const formData = new FormData();
    formData.append('message', message);
    formData.append('title', title);
    console.log(title)
    if(datetime){
      return this.http.post(this.apiUrl, {message,title,datetime});
    }else
    return this.http.post(this.apiUrl, {message,title});
  }
}
