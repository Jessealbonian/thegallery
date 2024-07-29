import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin, timer, Subscription } from 'rxjs';
import { FileUploadService } from '../../services/upload.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SharedService } from '../../services/shared.service'; // Adjust path as needed

@Component({
  selector: 'app-image-upload',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css'],
})
export class ImageUploadComponent implements OnInit, OnDestroy {
  selectedFiles: File[] = [];
  previewThumbnails: string[] = [];
  @ViewChild('fileInput') fileInput!: ElementRef;
  
  message: string = '';
  imageInfos: any[] = [];
  fullScreenImage: any;
  private keydownSubscription: Subscription | undefined;
  validationError: string = '';
  username: string | null = null; // Store username

  constructor(private uploadService: FileUploadService, private router: Router, private sharedService: SharedService) {}

  ngOnInit(): void {
    this.username = this.sharedService.getUsername(); // Retrieve username
    this.loadImages();
    this.setupKeydownListener();
  }

  ngOnDestroy(): void {
    this.keydownSubscription?.unsubscribe();
  }

  loadImages() {
    this.uploadService.getFiles().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.imageInfos = response.data.map((image: any) => {
            return {
              ...image,
              img: `http://localhost/GallyAPI/api/${image.img}`, // Adjust path as needed
              id: image.id // Ensure the image ID is included
            };
          });
        } else {
          console.error('Failed to retrieve images:', response.message);
        }
      },
      (error: any) => {
        console.error('Error fetching images:', error);
      }
    );
  }

  onFileSelected(event: any) {
    this.validationError = ''; 
    const files: FileList = event.target.files;
    let hasInvalidFiles = false;

    if (files && files.length > 0) {
      for (let i = 0; i < files.length; i++) {
        const file = files.item(i);
        if (file && (file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif')) {
          if (file.size <= 10 * 1024 * 1024) { 
            this.selectedFiles.push(file);

            const reader = new FileReader();
            reader.onload = (e: any) => {
              this.previewThumbnails.push(e.target.result);
            };
            reader.readAsDataURL(file);
          } else {
            this.validationError = 'File size exceeds 10MB!';
            this.showValidationPopup();
            hasInvalidFiles = true;
            break; // Exit loop on invalid file
          }
        } else {
          this.validationError = 'Only image files are supported!';
          this.showValidationPopup();
          hasInvalidFiles = true;
          break; // Exit loop on invalid file
        }
      }

      if (hasInvalidFiles) {
        this.resetFileInput();
      } else {
        this.updateFileInput();
      }
    }
  }

  upload() {
    if (this.selectedFiles.length > 0) {
      const uploadObservables: Observable<any>[] = this.selectedFiles.map(file => this.uploadService.upload(file));
    
      forkJoin(uploadObservables).subscribe(
        (responses: any[]) => {
          console.log('All files uploaded successfully:', responses);
          this.message = 'Files uploaded successfully!';
          this.loadImages();

          this.selectedFiles = [];
          this.previewThumbnails = [];
          this.fileInput.nativeElement.value = '';

          timer(2000).subscribe(() => {
            this.message = '';
          });
        },
        (error: any) => {
          console.error('Error uploading files:', error);
          this.message = 'File upload failed!';
        }
      );
    }
  }

  trackByFn(index: number, item: any) {
    return item.imgName;
  }

  showFullScreen(image: any) {
    this.fullScreenImage = image;
    document.body.style.overflow = 'hidden'; // Prevent scrolling
  }

  closeFullScreen() {
    this.fullScreenImage = null;
    document.body.style.overflow = '';
  }

  removeSelectedFile(index: number) {
    this.selectedFiles.splice(index, 1);
    this.previewThumbnails.splice(index, 1);
    this.updateFileInput();
  }

  navigateFullScreen(direction: 'prev' | 'next') {
    const currentIndex = this.imageInfos.findIndex(img => img.img === this.fullScreenImage.img);

    let newIndex = direction === 'prev' ? currentIndex - 1 : currentIndex + 1;
    newIndex = (newIndex + this.imageInfos.length) % this.imageInfos.length;

    this.fullScreenImage = this.imageInfos[newIndex];
  }

  private setupKeydownListener() {
    this.keydownSubscription = new Observable<KeyboardEvent>(observer => {
      const handler = (event: KeyboardEvent) => observer.next(event);
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }).subscribe(event => this.handleKeydown(event));
  }

  private handleKeydown(event: KeyboardEvent) {
    if (this.fullScreenImage) {
      if (event.key === 'ArrowLeft') {
        this.navigateFullScreen('prev');
      } else if (event.key === 'ArrowRight') {
        this.navigateFullScreen('next');
      } else if (event.key === 'Escape') {
        this.closeFullScreen();
      }
    }
  }

  private showValidationPopup() {
    console.log('Showing validation popup');
    const alertElement = document.querySelector('.alert.alert-danger') as HTMLElement;
    if (alertElement) {
      alertElement.classList.add('show');
      setTimeout(() => {
        alertElement.classList.remove('show');
      }, 3000); // 3 seconds delay before hiding
    } else {
      console.error('Validation alert element not found');
    }
  }

  hideValidationPopup() {
    const alertElement = document.querySelector('.alert.alert-danger') as HTMLElement;
    
    if (alertElement) {
      alertElement.classList.remove('show');
    }
  }

  private resetFileInput() {
    this.fileInput.nativeElement.value = '';
  }

  private updateFileInput() {
    this.fileInput.nativeElement.files = new FileList();
  }

  navigateToAddComment(image: any, imageId: string, event: MouseEvent) {
    event.stopPropagation(); // Prevent closing the fullscreen view
    this.router.navigate(['/add-comment'], { state: { image, imageId } });
  }
}
