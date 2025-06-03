import { Component, OnInit, Input,ChangeDetectorRef } from '@angular/core';
import { DocUrlsService } from '../../services/doc-urls.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'
import { TableModule } from 'primeng/table'; // Import TableModule
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { InputTextModule } from 'primeng/inputtext';
import { ToastModule } from 'primeng/toast';
import { ConfirmationService, MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ToolbarModule } from 'primeng/toolbar';

import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AnimateModule } from 'primeng/animate';
import { ImageModule } from 'primeng/image';
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-doc-urls',
  standalone: true,
  templateUrl: './doc-urls.component.html',
  styleUrl: './doc-urls.component.scss',
  imports: [CommonModule,FormsModule, ReactiveFormsModule,TableModule,ButtonModule,InputTextModule,
    ToastModule,DialogModule,ToolbarModule,RippleModule,ConfirmPopupModule,ConfirmDialogModule,AnimateModule,ImageModule,ProgressSpinnerModule],
  providers: [MessageService, ConfirmationService]

})
export class DocUrlsComponent implements OnInit{
  videoUrl: string = '';
  feedUrl: string = '';
  politiqueUrl: string = '';
  NewVideo: File ;
  Editing: boolean = false;
  EditingPolitique: boolean = false;
  EditingRSS: boolean = false;
  isLoading :boolean = true;
  urls: any[] = [];
  url:any;
  newUrl:any;
  newVideoUrl:string = '';
  constructor(private urlService: DocUrlsService, private cdRef: ChangeDetectorRef, private messageService: MessageService, private confirmationService: ConfirmationService) {
    this.NewVideo = new File([], ''); 
    this.newUrl = {name: "",link:""};
    this.urls = [];
   }

  ngOnInit(): void {
    this.urls = [];
    this.loadUrls();
  }

  openNew() {
    this.NewVideo = new File([], ''); 
    this.Editing = true;
}

truncateLink(link: string): string {
  const maxLength = 70; // Maximum length of the displayed link
  if (link.length > maxLength) {
    return link.substring(0, maxLength - 3) + '...'; // Truncate and add ellipsis
  } else {
    return link;
  }
}


  loadUrls(): void {
    this.urls = [];
    this.isLoading = true;
    this.urlService.getVideoUrl().subscribe(
      (data) => {
        this.videoUrl = data.url;
        this.urls.push({name:"Video URL",link:data.url});
        if(this.urls.length > 2)
        this.isLoading = false;
      },
      (error) => {
        //console.error('Error loading video URL:', error);
        if(error){
          console.error('Error loading video URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error loading video URL:', detail: error });
        }
      }
    );

    this.urlService.getFeedUrl().subscribe(
      (data) => {
        this.feedUrl = data.link;
        this.urls.push({name:"Feed Url",link:data.link});
        if(this.urls.length > 2)
        this.isLoading = false;
      },
      (error) => {
       // console.error('Error loading feed URL:', error);
        if(error){
          console.error('Error loading feed URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error loading feed URL:', detail: error });
        }
      }
    );

    this.urlService.getPolitiqueUrl().subscribe(
      (data) => {
        this.politiqueUrl = data.url;
        this.urls.push({name:"politique Url",link:data.url});
        console.log(this.urls);
        if(this.urls.length > 2)
        this.isLoading = false;
      },
      (error) => {
       // console.error('Error loading politique URL:', error);
        if(error){
          console.error('Error loading politique URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error loading politique URL:', detail: error });
        }
        this.isLoading = false;
      }
    );
  }


  onFileSelected(event: any): void {
    const file = event.target.files[0];
  
    // Check if the file is not null
    if (!file) {
      return;
    }
  
    const validMimeTypes = ['video/mp4', 'video/mpeg', 'video/webm', 'video/ogg', 'video/quicktime'];
  
    // Check if the selected file's MIME type is in the list of valid video MIME types
    if (!validMimeTypes.includes(file.type)) {
      this.messageService.add({ severity: 'error', summary: 'Invalid File Type', detail: 'Please select a video file.' });
      return;
    }
  
    // Assign the selected file to the newImage property
    this.NewVideo = file;
    // Set the src attribute of the <video> tag to the URL of the selected video file
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      this.newVideoUrl = reader.result as string;
    };
  }


  
  editUrl(url:any):void{
    switch(url.name)
    {
      case "Video URL": {this.Editing = true;this.EditingPolitique = false; this.EditingRSS = false}; break;
      case "Feed Url": {this.Editing = false;this.EditingPolitique = false; this.EditingRSS = true}; break;
      case "politique Url": {this.Editing = false;this.EditingPolitique = true; this.EditingRSS = false}; break;
    }
    this.newUrl = { ...url };

  }




  confirmEditingVideo() : void {

     if (!this.NewVideo) {
      console.error('Please select a new video.');
      return;
    }

    this.urlService.updateVideoUrl(this.NewVideo).subscribe(
      (data) => {
        console.log('Video URL updated successfully:', data);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Video URL updated successfully !', life: 3000 });
        // Reload URLs after update
        this.loadUrls();
        this.cdRef.detectChanges();
        this.Editing = false;
        this.newVideoUrl = '';
      },
      (error) => {
        //console.error('Error updating video URL:', error);
        this.Editing = false;
        this.newVideoUrl = '';
        if(error){
          console.error('Error updating video URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error updating video URL:', detail: error });
        }
      }
    );
  }
  hideDialog() {
    this.Editing = false;
    this.EditingPolitique = false; 
    this.EditingRSS = false;
    this.newVideoUrl = '';
    this.newUrl = {name: "",link:""};
}

  updateFeedUrl(): void {
    if(!this.newUrl || this.newUrl.url == ""){
      return;
    } 

    this.urlService.updateFeedUrl(this.newUrl.url).subscribe(
      (data) => {
        console.log('Feed URL updated successfully:', data);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Feed URL updated successfully !', life: 3000 });
        // Reload URLs after update
        this.loadUrls();
      },
      (error) => {
        //console.error('Error updating feed URL:', error);
        if(error){
          console.error('Error updating feed URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error updating feed URL:', detail: error });
        }
      }
    );
  }

  updatePolitiqueUrl(): void {
    if(!this.newUrl || this.newUrl.url == ""){
      return;
    } 
    this.urlService.updatePolitiqueUrl(this.newUrl.url).subscribe(
      (data) => {
        console.log('Politique URL updated successfully:', data);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Politique URL updated successfully !', life: 3000 });
        // Reload URLs after update
        this.loadUrls();
      },
      (error) => {
        //console.error('Error updating politique URL:', error);
        if(error){
          console.error('Error updating politique URL:', error);
          this.messageService.add({ severity: 'error', summary: 'Error updating politique URL:', detail: error });
        }
      }
    );
  }
}
