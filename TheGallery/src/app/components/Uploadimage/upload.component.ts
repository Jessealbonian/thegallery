import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Observable, forkJoin, timer, Subscription } from 'rxjs';
import { FileUploadService } from '../../services/upload.service';
import { FormsModule } from '@angular/forms';

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

  constructor(private uploadService: FileUploadService) {}

  ngOnInit(): void {
    this.loadImages();

    this.keydownSubscription = new Observable<KeyboardEvent>(observer => {
      const handler = (event: KeyboardEvent) => observer.next(event);
      window.addEventListener('keydown', handler);
      return () => window.removeEventListener('keydown', handler);
    }).subscribe(event => this.onKeydown(event));
  }

  ngOnDestroy(): void {
    if (this.keydownSubscription) {
      this.keydownSubscription.unsubscribe();
    }
  }

  loadImages() {
    this.uploadService.getFiles().subscribe(
      (response: any) => {
        if (response.status === 'success') {
          this.imageInfos = response.data.map((image: any) => {
            return {
              ...image,
              img: `http://localhost/GalleryAPI/api/${image.img}`
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
            hasInvalidFiles = true;
            break; // Exit loop on invalid file
          }
        } else {
          this.validationError = 'Only image files are supported!';
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
      const uploadObservables: Observable<any>[] = [];
      this.selectedFiles.forEach(file => {
        uploadObservables.push(this.uploadService.upload(file));
      });

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
    document.body.style.overflow = 'hidden';
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
    let newIndex = currentIndex;

    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : this.imageInfos.length - 1;
    } else if (direction === 'next') {
      newIndex = currentIndex < this.imageInfos.length - 1 ? currentIndex + 1 : 0;
    }

    this.fullScreenImage = this.imageInfos[newIndex];
  }

  private onKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && this.fullScreenImage) {
      this.closeFullScreen();
    } else if (event.key === 'ArrowRight' && this.fullScreenImage) {
      this.navigateFullScreen('next');
    } else if (event.key === 'ArrowLeft' && this.fullScreenImage) {
      this.navigateFullScreen('prev');
    }
  }

  resetFileInput() {
    setTimeout(() => {
      this.fileInput.nativeElement.value = '';
      this.selectedFiles = [];
      this.previewThumbnails = [];
      this.validationError = '';
    }, 2000);
  }

  updateFileInput() {
    const dataTransfer = new DataTransfer();
    this.selectedFiles.forEach(file => dataTransfer.items.add(file));
    this.fileInput.nativeElement.files = dataTransfer.files;
  }
}
