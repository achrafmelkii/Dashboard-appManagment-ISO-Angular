import { Component, OnInit, Input,ChangeDetectorRef ,ViewChild  } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { SymboleService } from '../../services/symbole.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'; // Import TableModule
import { Table } from 'primeng/table';
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

@Component({
  selector: 'app-symbole',
  standalone: true,
  templateUrl: './symbole.component.html',
  styleUrl: './symbole.component.scss',
  imports: [CommonModule,FormsModule, ReactiveFormsModule,TableModule,ButtonModule,InputTextModule,
    ToastModule,DialogModule,ToolbarModule,RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule,ImageModule],
  providers: [MessageService, ConfirmationService]

})
export class SymboleComponent implements OnInit {
  @ViewChild('dt1') dt1!: Table;
  images: any[] = [];
  @Input() imageName: string ="";
  Editing: boolean = false;
  AddNew: boolean = false;
  image: any;
  newImg : any;
  newImage: File ;
  newTitle: string = '';
  newDesc: string = '';
  constructor( private symboleService: SymboleService, private cdRef: ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.newImage = new File([], ''); 

  }
  openNew() {


 
    this.newImage = new File([], ''); 
    this.newTitle = "";
    this.newDesc = "";
    this.AddNew = true;
    // this.newAdmin = { email: '', isSuperAdmin: false};
    // this.productDialog = true;
}
  ngOnInit(): void {
    this.loadSymbols();
  }

  loadSymbols(): void {
    this.symboleService.getAllSymboles().subscribe(
      (data) => {
        this.images = data.images;
      },
      (error) => {
       // console.error('Error loading symbols:', error);
        if(error){
          console.error('Error loading symbols:', error);
          this.messageService.add({ severity: 'error', summary: 'Error loading symbols:', detail: error.error });
        }
      }
    );
  }
 
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    const validExtensions = ['jpg', 'jpeg', 'png', 'gif'];
    const fileExtension = file?.name.split('.').pop().toLowerCase();
  
    if (!validExtensions.includes(fileExtension)) {
      this.messageService.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please select an image file.' });
      return;
    }
  
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      const mimeType = (fileReader.result as string).split(',')[0]?.split(':')[1].split(';')[0];
      if (!mimeType.startsWith('image/')) {
        this.messageService.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please select an image file.' });
        return;
      }
  
      this.newImage = file;
    }; 
  }

  confirmEditing() : void {

    if(!this.newImg.ID){
      console.error('Please select a new image.');
      return;
    }


     if (!this.newImage) {
      console.error('Please select a new image.');
      return;
    }

    this.symboleService.updateSymbole(this.newImage, this.newImg).subscribe(
      (data) => {
        console.log('Symbol updated successfully:', data);
        this.loadSymbols();
        this.cdRef.detectChanges();
        this.Editing = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Symbol updated successfully !', life: 3000 });
      },
      (error) => {
        //console.error('Error updating symbol:', error);
        if(error){
          console.error('Error updating symbol:', error);
          this.messageService.add({ severity: 'error', summary: 'Error updating symbol:', detail: error.error });
        }
        this.Editing = false;
      }
    );
  }
  confirmCreate(): void {
    if (!this.newImage) {
      console.error('Please select an image to create a symbol.');
      return;
    }

    this.symboleService.createSymbole(this.newImage, this.newTitle, this.newDesc).subscribe(
      (data) => {
        console.log('Symbol created successfully:', data);
        this.loadSymbols();
        this.cdRef.detectChanges();
        this.Editing = false;
        this.AddNew = false;
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Symbol created successfully !', life: 3000 });
      },
      (error) => {
        //console.error('Error creating symbol:', error);
        if(error){
          console.error('Error creating symbol:', error);
          this.messageService.add({ severity: 'error', summary: 'Error creating symbol:', detail: error.error });
        }
        this.Editing = false;
        this.AddNew = false;
      }
    );
  }

  confirmDelete(id: string,imageName: string): void {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete this symbol?',
      accept: () => {
        this.symboleService.deleteSymbole(id,imageName).subscribe(
          (data) => {
            console.log('Symbol deleted successfully:', data);
            this.loadSymbols();
            this.cdRef.detectChanges();
            this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Symbol deleted successfully !', life: 3000 });
          },
          (error) => {
            //console.error('Error deleting symbol:', error);
            if(error){
              console.error('Error deleting symbol:', error);
              this.messageService.add({ severity: 'error', summary: 'Error deleting symbol:', detail: error.error });
            }
            
          }
        );
      }
    });
  }
 hideDialog() {
    this.Editing = false;
    this.AddNew = false;
   // this.submitted = false;
}
  editImage(image: any): void {
    this.newImg = { ...image };
    this.Editing = true;
  }
}
