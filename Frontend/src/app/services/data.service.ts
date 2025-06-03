import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private apiUrl = 'http://localhost:3000/api'; // Update with your Node.js server URL

  constructor(private http: HttpClient) { }

  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}/data`);
  }


  createData(newData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/data`, newData);
  }
  updateData(dataId: string, updatedData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/data/${dataId}`, updatedData);
  }
  deleteData(dataId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/data/${dataId}`);
  }
      
}
