import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Admin,AdminApiResponse,AdminUserApiResponse, HistoryApiResponse } from '../models/user'; // Adjust the path based on your project structure

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private apiUrl = 'http://localhost:3000/api/admins';

  constructor(private http: HttpClient) {}

  getAllAdmins(): Observable<AdminApiResponse> {
    return this.http.get<AdminApiResponse>(this.apiUrl);
  }

  getUsersEmails(): Observable<AdminUserApiResponse> {
    return this.http.get<AdminUserApiResponse>(`${this.apiUrl}/users/`);
  }
  getAdminById(id: string): Observable<any> {
    return this.http.get<Admin>(`${this.apiUrl}/${id}`);
  }

  createAdmin(user: Admin): Observable<any> {
    console.log(user);
    return this.http.post<Admin>(this.apiUrl, user);
  }

  updateAdmin(id: string, user: Admin): Observable<any> {
    return this.http.put<Admin>(`${this.apiUrl}/${id}`, user);
  }

  deleteAdmin(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  getHistory(): Observable<HistoryApiResponse> {
    return this.http.get<HistoryApiResponse>(`${this.apiUrl}/history/`);
  }
}
