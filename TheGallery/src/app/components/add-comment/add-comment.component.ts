import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http'; // Import HttpClient
import { SharedService } from '../../services/shared.service'; // Adjust path as needed

interface ApiResponse {
  status: string;
  message: string;
  data: any[];
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
  username: string | null = null; // Store username
  comments: any[] = []; // Store comments
  validationError: string | null = null;

  constructor(private router: Router, private sharedService: SharedService, private http: HttpClient) { // Inject HttpClient
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      this.image = navigation.extras.state['image'];
    }
  }

  ngOnInit() {
    this.username = this.sharedService.getUsername(); // Get the username from the shared service
    this.fetchComments(); // Fetch comments when the component initializes
  }

  fetchComments() {
    if (this.image && this.image.id) {
      this.http.get<ApiResponse>(`http://localhost/GallyAPI/api/getCommentsByImageId/${this.image.id}`).subscribe(
        (response) => {
          if (response.status === 'success') {
            this.comments = response.data;
          } else {
            this.validationError = response.message;
          }
        },
        (error) => {
          this.validationError = 'Failed to fetch comments. Please try again later.';
        }
      );
    }
  }

  submitComment() {
    if (!this.commentText.trim()) {
      this.validationError = 'Comment cannot be empty.';
      return;
    }

    const commentData = {
      image_id: this.image.id,
      comment: this.commentText,
      username: this.username
    };

    this.http.post<ApiResponse>('http://localhost/GallyAPI/api/addcomment', commentData).subscribe(
      (response) => {
        if (response.status === 'success') {
          this.comments.push({ username: this.username, comment: this.commentText });
          this.commentText = '';
          this.validationError = null;
        } else {
          this.validationError = response.message;
        }
      },
      (error) => {
        this.validationError = 'Failed to submit comment. Please try again later.';
      }
    );
  }

  PathBack(image: any, event: MouseEvent) {
    event.stopPropagation(); // Prevent closing the fullscreen view
    this.router.navigate(['/upload'], { state: { image } });
  }
}
