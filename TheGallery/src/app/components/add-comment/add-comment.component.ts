import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { SharedService } from '../../services/shared.service';

interface ApiResponse {
  status: any; // Adjusted to handle any status field structure
  message?: string; // Optional message field
  payload?: any[]; // Optional payload field
  timestamp?: any; // Optional timestamp field
  data?: any[]; // Fallback field for data
}

@Component({
  selector: 'app-add-comment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-comment.component.html',
  styleUrls: ['./add-comment.component.css'],
})
export class AddCommentComponent implements OnInit {
  image: any = null;
  commentText: string = '';
  username: string | null = null;
  comments: any[] = [];
  validationError: string | null = null;

  constructor(private router: Router, private sharedService: SharedService, private http: HttpClient) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.image = navigation.extras.state['image'];
      console.log('Image received:', this.image);
    }
  }

  ngOnInit() {
    this.username = this.sharedService.getUsername();
    console.log('Username:', this.username);
    this.fetchComments();
  }

  fetchComments() {
    if (this.image && this.image.id) {
      console.log('Fetching comments for image ID:', this.image.id);
      this.http.get<ApiResponse>(`http://localhost/GallyAPI/api/getCommentsByImageId/${this.image.id}`).subscribe(
        (response) => {
          console.log('Fetch comments raw response:', response);

          // Check for different possible structures
          if (response.status && response.status === 'success') {
            this.comments = response.payload || response.data || []; // Use payload or data
            console.log('Comments fetched:', this.comments);
          } else if (response.message) {
            this.validationError = response.message;
            console.error('Error fetching comments:', this.validationError);
          } else {
            this.validationError = 'Unexpected response format.';
            console.error('Error fetching comments:', this.validationError);
          }
        },
        (error: HttpErrorResponse) => {
          this.validationError = `Failed to fetch comments. Please try again later.`;
          console.error('Fetch comments error:', error);
        }
      );
    } else {
      console.error('Image ID is missing');
    }
  }

  submitComment() {
    if (!this.commentText.trim()) {
      this.validationError = 'Comment cannot be empty.';
      console.error('Validation error:', this.validationError);
      return;
    }

    const commentData = {
      image_id: this.image.id,
      comment: this.commentText,
      username: this.username
    };

    console.log('Submitting comment:', commentData);

    this.http.post<ApiResponse>('http://localhost/GallyAPI/api/addcomment', commentData).subscribe(
      (response) => {
        console.log('Submit comment raw response:', response);

        if (response.status && response.status === 'success') {
          console.log('Comment submitted successfully:', response);
          this.commentText = '';
          this.validationError = null;
          this.fetchComments(); // Fetch comments again to update the list
        } else if (response.message) {
          this.validationError = response.message;
          console.error('Submit comment error:', this.validationError);
        } else {
          this.validationError = 'Unexpected response format.';
          console.error('Submit comment error:', this.validationError);
        }
      },
      (error: HttpErrorResponse) => {
        if (error.error instanceof ErrorEvent) {
          this.validationError = `Client-side error: ${error.error.message}`;
        } else {
          this.validationError = `Server-side error: ${error.status} - ${error.message}`;
        }
        console.error('Submit comment error:', error);
      }
    );
  }

  PathBack(image: any, event: MouseEvent) {
    event.stopPropagation();
    this.router.navigate(['/upload'], { state: { image } });
  }
}
