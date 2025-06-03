
export interface Question {
    Text: string;
    Options?: string[];
    CorrectAnswer: string;
    
  }
  export interface Challenge {
    DaysNum?: number;
    Completed: boolean;
    Title: string;
    CarbPts?: number;
    Text: string;
    ExpPts?: number;
  }

  export interface QuizApiResponse {
    success: boolean;
    quizsName: Question[];
    quizs: Record<string, Question>[];
    error?: string;
  }

  export interface OneQuizApiResponse {
    success: boolean;
    oneQuizs: Question
    error?: string;
  }

    export interface NewQuizApiResponse {
      success: boolean;
      createdQuiz:  Question;
      error?: string;
    }