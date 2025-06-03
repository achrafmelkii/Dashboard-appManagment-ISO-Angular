// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Challenge, ChallengeApiResponse } from '../models/challenge';
import { map } from 'rxjs/operators'; 
@Injectable({
  providedIn: 'root'
})
export class ChallengeService {

  private apiUrl = 'http://localhost:3000/api/challenge';

  constructor(private http: HttpClient) {}        

  getAllChallenges(): Observable<ChallengeApiResponse> {
    return this.http.get<ChallengeApiResponse>(`${this.apiUrl}/getChallenges`);
  }
  
  updateChallenge(id: string, challenge: Challenge): Observable<Challenge> {
    return this.http.put<Challenge>(`${this.apiUrl}/updateChallenge/${id}`, challenge);  
  }

  createChallenge(challenge: Challenge): Observable<Challenge> {
    
    return this.http.post<Challenge>(`${this.apiUrl}/addChallenge`, challenge);

  }

  deleteChallenge(id: string): Observable<any> {

    return this.http.delete<any>(`${this.apiUrl}/deleteChallenge/${id}`);
  }
    
  assignChallenge(userId: string, challengeId: string): Observable<any> {   
 
   return  this.http.post<any>(`${this.apiUrl}/assignChallenge/${userId}/${challengeId}`, {}) 
   }
  
   


  /*
  getUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  

  updateUser(id: string, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}`, user);
  }

 
  */
}
