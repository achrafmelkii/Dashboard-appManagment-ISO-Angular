import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { analytics} from '../models/analytics';

@Injectable({
  providedIn: 'root'
})
export class AnalyticsService {
  private apiUrl = 'http://localhost:3000/api/';
  
    constructor(private http: HttpClient) {}
  
     getAnalyticsData(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/getAnalytics`);
  }
}
  