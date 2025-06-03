import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DocUrlsService {

  private apiUrl = 'http://localhost:3000/api/urls';

  constructor(private http: HttpClient) {}

  getVideoUrl(): Observable<any> {
    return this.http.get(`${this.apiUrl}/video`);
  }

  updateVideoUrl(video: File): Observable<any> {
    const formData = new FormData();
    formData.append('video', video);
    return this.http.put(`${this.apiUrl}/video`, formData);
  }

  getFeedUrl(): Observable<any> {
    return this.http.get(`${this.apiUrl}/rss`);
  }

  updateFeedUrl(updatedUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/rss`, { url: updatedUrl });
  }

  getPolitiqueUrl(): Observable<any> {
    return this.http.get(`${this.apiUrl}/pdf`);
  }

  updatePolitiqueUrl(updatedUrl: string): Observable<any> {
    return this.http.put(`${this.apiUrl}/pdf`, { url: updatedUrl });
  }
}
