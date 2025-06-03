import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Challenge, NewQuizApiResponse, OneQuizApiResponse, Question, QuizApiResponse } from '../models/quiz'; // Adjust the path based on your project structure
@Injectable({
  providedIn: 'root',
})
export class QuizService {
    private apiUrl = 'http://localhost:3000/api/quizs';
  
    constructor(private http: HttpClient) {}
  
    getAllQuizes(): Observable<QuizApiResponse> {
      return this.http.get<QuizApiResponse>(this.apiUrl); //added []
    }
    

    getQuizById(quizName: string): Observable<OneQuizApiResponse> {
      const url = `${this.apiUrl}/${quizName}`;
      return this.http.get<OneQuizApiResponse>(url);
    }

    deleteQuiz(quizName: string): Observable<any> {
      return this.http.delete<any>(`${this.apiUrl}/${quizName}`);
    }

    updateQuiz(id: string, updatedQuiz: Question): Observable<any> {
      return this.http.put<Question>(`${this.apiUrl}/${id}`, updatedQuiz);
    }

    createQuiz(quizId: Record<string, Question>): Observable<NewQuizApiResponse> {
      return this.http.post<NewQuizApiResponse>(this.apiUrl, quizId);
    }
}
