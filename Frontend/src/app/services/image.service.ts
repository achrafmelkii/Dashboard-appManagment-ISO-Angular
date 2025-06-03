import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImageService {
  private apiUrl = 'http://localhost:3000/api/images';

  constructor(private http: HttpClient) {}

  getAllImages(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getAllImages`);
  }

  editImage(imageName: string, newImage: File): Observable<any> {
    const formData = new FormData();
    formData.append('newImage', newImage);

    return this.http.put(`${this.apiUrl}/editImage/${imageName}`, formData);
  }
}
