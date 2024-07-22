import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageUploadComponent } from '../Uploadimage/upload.component'; // Correct path to your upload component

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ImageUploadComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  title = 'Login Gallery';
  loggedIn = true;
  showModal = false;
  loginForm = {
    username: '',
    password: ''
  };
  signUpForm = {
    email: '',
    password: ''
  };

  constructor(private http: HttpClient) {}

  login() {
    this.http.post('http://localhost/GalleryAPI/api/modules/login.php', this.loginForm).subscribe(
      (response: any) => {
        console.log('API Response:', response);
        if (response) {
          if (response.status === 'success') {
            this.loggedIn = true;
            console.log('Login successful');
          } else {
            console.error('Login failed:', response);
            alert('Login failed: ' + (response.message || 'Unknown error'));
          }
        } else {
          console.error('API Response is null');
          alert('Login failed: No response from server.');
        }
      },
      (error: any) => {
        console.error('Login error:', error);
        alert('An error occurred during login.');
      }
    );
  }

  showSignUpModal() {
    this.showModal = true;
  }

  hideSignUpModal() {
    this.showModal = false;
  }

  signUp() {
    this.http.post('http://localhost/GalleryAPI/api/modules/signup.php', this.signUpForm).subscribe(
      (response: any) => {
        console.log('Sign-Up Response:', response);
        if (response && response.status === 'success') {
          alert('Sign up successful. You can now log in.');
          this.hideSignUpModal();
        } else {
          console.error('Sign-Up failed:', response);
          alert('Sign-Up failed: ' + (response.message || 'Unknown error'));
        }
      },
      (error: any) => {
        console.error('Sign-Up error:', error);
        alert('An error occurred during sign-up.');
      }
    );
  }
}
