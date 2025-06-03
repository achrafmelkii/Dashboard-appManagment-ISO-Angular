import { Component, OnInit, Input,ChangeDetectorRef  } from '@angular/core';
import { ImageService } from '../../services/image.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
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
@Component({
  selector: 'app-image-list',
  templateUrl: './image-list.component.html',
  styleUrls: ['./image-list.component.scss'],
  standalone: true,
  imports: [CommonModule,FormsModule, ReactiveFormsModule,TableModule,ButtonModule,InputTextModule,
    ToastModule,DialogModule,ToolbarModule,RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule,ImageModule],
  providers: [MessageService, ConfirmationService]
})
export class ImageListComponent implements OnInit {
  images: any[] = [];
  @Input() imageName: string ="";
  Editing: boolean = false;
  image: any;
  newImage: File ;
  constructor(private imageService: ImageService, private cdRef: ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.newImage = new File([], ''); 

  }

  ngOnInit(): void {
    this.loadImages();
  }

  loadImages(): void {
    this.imageService.getAllImages().subscribe(
      (data) => {
        this.images = data.images;
        console.log(data.images);
      },
      (error) => {
        console.error('Error loading images:', error);
      }
    );
  }
  onFileSelected(event: any): void {
    this.newImage = event.target.files[0];

   
  }

  confirmEditing() : void {

    if(this.imageName == ""){
      console.error('Please select a new image.');
      return;
    }


     if (!this.newImage) {
      console.error('Please select a new image.');
      return;
    }

    this.imageService.editImage(this.imageName, this.newImage).subscribe(
      (data) => {
        console.log('Image updated successfully:', data);
        // Refresh the table after successful image update
        this.loadImages();
        // Manually trigger change detection to update the view
        this.cdRef.detectChanges();
        this.Editing = false;
      },
      (error) => {
        console.error('Error updating image:', error);
        this.Editing = false;
      }
    );
  }

 hideDialog() {
    this.Editing = false;
   // this.submitted = false;
}
  editImage(imageName: string): void {
   


    this.imageName = imageName;
    this.Editing = true;
    // if (!this.newImage) {
    //   console.error('Please select a new image.');
    //   return;
    // }

    // this.imageService.editImage(imageName, this.newImage).subscribe(
    //   (data) => {
    //     console.log('Image updated successfully:', data);
    //     // Refresh the table after successful image update
    //     this.loadImages();
    //     // Manually trigger change detection to update the view
    //     this.cdRef.detectChanges();
    //   },
    //   (error) => {
    //     console.error('Error updating image:', error);
    //   }
    // );
  }
}
