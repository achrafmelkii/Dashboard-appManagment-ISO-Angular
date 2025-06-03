import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SymboleService {
  private apiUrl = 'http://localhost:3000/api';

  constructor(private http: HttpClient) {}

  getAllSymboles(): Observable<any> {
    return this.http.get(`${this.apiUrl}/symbols`);
  }

  createSymbole(image: File, title: string, desc: string): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', title);
    formData.append('desc', desc);
    return this.http.post(`${this.apiUrl}/symbols`, formData);
  }

  updateSymbole(image: File, updatedImage:any): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);
    formData.append('title', updatedImage.title);
    formData.append('desc', updatedImage.desc);
    return this.http.put(`${this.apiUrl}/symbols/${updatedImage.ID}`, formData);
  }

  deleteSymbole(id : string,imageName: string): Observable<any> {
    const formData = new FormData();
    formData.append('imageName', imageName);
    return this.http.delete(`${this.apiUrl}/symbols/${id}`,{ body: formData });
  }
}
