import {
  Component,
  OnInit,
  Input,
  ChangeDetectorRef,
  ViewChild,
} from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table'; // Import TableModule
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';
import { RippleModule } from 'primeng/ripple';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnimateModule } from 'primeng/animate';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { IconModule } from '@coreui/icons-angular';
import {
  NewQuizApiResponse,
  OneQuizApiResponse,
  Question,
  QuizApiResponse,
} from 'src/app/models/quiz';
import { DropdownModule } from 'primeng/dropdown';

import { Table } from 'primeng/table';

import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-quiz-list',
  standalone: true,
  imports: [
    IconModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    ToastModule,
    DialogModule,
    ToolbarModule,
    RippleModule,
    ConfirmPopupModule,
    ConfirmDialogModule,
    AnimateModule,
    ImageModule,DropdownModule,ProgressSpinnerModule
  ],
  providers: [MessageService, ConfirmationService],
  templateUrl: './quiz-list.component.html',
  styleUrl: './quiz-list.component.scss',
})
export class QuizListComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  // (!) to tell TypeScript that you are confident that the property will be initialized before it's used
  choices : string[] | undefined;
  editingQuiz: Question | any;
  isEditing:boolean = false;
  isLoading :boolean = true;

  quizzes: Record<string, Question>[] = [];
  combinedData: { question: Question, key: string }[] = [];

  questionsArray: Question[] = [];
  quizzesKeys:string[]=[];

  quiz: Question = {
    Text: '',
    Options: [],
    CorrectAnswer: '',
  };

  quizId: string = '';

  quizIdToDelete = '';
  mess: string = '';

  x = 0;
  newquiz: Record<string, Question> = {
    [`${this.x}`]: {
      Text: '',
      Options: ['', '', ''],
      CorrectAnswer: '',
    },
  };
  option1: string = '';
  option2: string = '';
  option3: string = '';
  Text: string = '';
  CorrectA: string = '';
  QName:number= 0;
  productDialog: boolean = false;
  constructor(
    private quizService: QuizService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    private cdRef: ChangeDetectorRef
  ) {
    this.combinedData = [];
  }

  ngOnInit(): void {
    this.getAllQuizes();
    this.choices = ['a','b','c','d'];
    this.combinedData = [];
  }
  
  closeNew() {
    this.productDialog = false;
  }
  openNew() {
    this.quiz = { Text: '', Options: [], CorrectAnswer: '' };
    this.productDialog = true;
  }

  updateQuestion(id:string,question:Question){
    question.Options![0] =  this.option1 ;
    question.Options![1] = this.option2;
    question.Options![2] =  this.option3;
    question.CorrectAnswer = this.CorrectA ;
    this.quizService.updateQuiz(id, question).subscribe(response => {
      if (response.success) {
        console.log(response.message)
      }
      this.cancelEdit(); // Clear the editing state
      this.getAllQuizes();
      this.cdRef.detectChanges();
    });
}
truncateLink(link: string): string {
  const maxLength = 70; // Maximum length of the displayed link
  if (link.length > maxLength) {
    return link.substring(0, maxLength - 3) + '...'; // Truncate and add ellipsis
  } else {
    return link;
  }
}
cancelEdit(){
  this.editingQuiz=null;
  this.isEditing=false;
  this.quizId='';
  this.option1 = '';
  this.option2 = '';
  this.option3 = '';
  this.Text = '';
  this.CorrectA= '';
}

editQuestion(questionId:string,CurrentQuiz:any){
  this.editingQuiz = {...CurrentQuiz};
  this.isEditing=true;
  this.Text = CurrentQuiz.Text;
  this.quiz
  this.option1 = CurrentQuiz.Options[0];
  this.option2 = CurrentQuiz.Options[1];
  this.option3= CurrentQuiz.Options[2];
  this.CorrectA = CurrentQuiz.CorrectAnswer;
  this.quizId = questionId;

}


  getAllQuizes() {
    this.isLoading = true;
    this.combinedData = [];
    this.quizService.getAllQuizes().subscribe(
      (response: QuizApiResponse) => {
        if (response.success) {
          this.quizzes = response.quizs;

          // Loop through each quiz
          for (const quizName in this.quizzes) {
            if (this.quizzes.hasOwnProperty(quizName)) {
              const currentNumber = +((quizName.match(/\d+/) || [])[0] || 0); 
              if (this.QName < currentNumber){
              this.QName=currentNumber;
              }
              const quiz = this.quizzes[quizName];

              if (quiz) {
                const newQuestion: Question = {
                  Text: '' + quiz['Text'],
                  Options: quiz['Options'] as unknown as string[],
                  CorrectAnswer: '' + quiz['CorrectAnswer'],
                  // Add other properties as needed
                };
                if(newQuestion&&quizName){
                  this.combinedData.push({ question: newQuestion, key: quizName });
                }
               
                this.questionsArray.push(newQuestion);
                this.quizzesKeys.push(quizName);
                this.isLoading=false;
              }
              
            }
          }
        } else {
          console.error('Error fetching quizzes:', response.error);
        }
      },
      (error) => {
        console.error('Error fetching quizzes:', error);
      }
    );
   
  }

  getQuiz() {
    this.quizService.getQuizById(this.quizId).subscribe(
      (response) => {
        if (response.success) {
          this.quiz = response.oneQuizs;
          console.log(this.quiz);
        }
      },
      (error) => {
        console.error('Error fetching quiz:', error);
      }
    );
  }

  deleteQuiz(delId:string) {

    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected user?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
    this.quizService.deleteQuiz(delId).subscribe((response) => {
      if (response.success) {
        this.getAllQuizes();
        this.cdRef.detectChanges();
   
     
        this.mess = 'done';
        console.log('Quiz deleted successfully:', response);
      } else {
        this.mess = 'Error';
        console.error('Error deleting quiz:', response.error);
      }
    });
   
  }});
  }

  createQuiz() {
    // Extract the numeric part from QName and increment it by 1
    // const currentNumber = +((.match(/\d+/) || [])[0] || 0); //if match returns null or the array is empty, it defaults to 0
     this.QName +=1;
    if (
      this.Text &&
      this.option1 &&
      this.option2 &&
      this.option3 &&
      this.CorrectA
    ) {
      this.newquiz = {
        [ this.QName]: {
          Text: this.Text,
          Options: [this.option1, this.option2, this.option3],
          CorrectAnswer: this.CorrectA,
        },
      };

      this.quizService.createQuiz(this.newquiz).subscribe(
        (response) => {
          if (response.success) {
          
            this.getAllQuizes();
            this.cdRef.detectChanges();
            this.productDialog = false;
            console.log('Quiz created successfully:', response);

            this.Text = '';
            this.option1 = '';
            this.option2 = '';
            this.option3 = '';
            this.CorrectA = '';
            // Optionally, you can reload the quizzes after creating a new one

          
          }
          // else {
          //   console.error('Error creating quiz:', response.error);
          // }
        },
        (error) => {
          console.error('Error creating quiz:', error);
        }
      );
    }
  }
}
