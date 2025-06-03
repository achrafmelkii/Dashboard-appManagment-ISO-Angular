import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {NotificationComponent} from '../notification/notification.component'
@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  standalone: true,
  imports: [FormsModule,NotificationComponent],
  styleUrls: ['./image-upload.component.scss']
})
export class ImageUploadComponent {
  imageName: string;
  selectedFile: File;
  private apiUrl = 'http://localhost:3000/api/upload'; 
  constructor(private http: HttpClient) {
    this.imageName = '';
    this.selectedFile = new File([], ''); 

  }

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  uploadImage(): void {
    const formData = new FormData();
    formData.append('name', this.imageName);
    formData.append('image', this.selectedFile);
    console.log(this.imageName);
    this.http.post(this.apiUrl, formData)
      .subscribe(response => {
        console.log(response);
        // Handle response from the server
      });
  }
}
