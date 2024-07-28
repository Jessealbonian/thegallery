import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/upload.service'; // Adjust the path as needed
import { ApiResponse } from './api-response.model'; // Adjust path as needed


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFormModel = { username: '', password: '' };
  signUpFormModel = { email: '', username: '', password: '' };
  loginPrompt: string = '';
  showModal: boolean = false;
  signUpPrompt: string = '';
  hidePassword: boolean = true;
  loggedIn: boolean = false;

  constructor(private uploadService: FileUploadService, private router: Router) {}

  login() {
    this.uploadService.getUsers().subscribe({
      next: (response: ApiResponse<any[]>) => {
        console.log('API Response:', response);
        const users = response.data; // Extracting the data property from the response
        if (Array.isArray(users)) {
          const user = users.find(u => u.email === this.loginFormModel.username && u.password === this.loginFormModel.password);
          if (user) {
            this.loggedIn = true;
            this.loginPrompt = '';
            this.router.navigate(['/upload']);

          } else {
            this.loginPrompt = 'The credentials are wrong';
          }
        } else {
          this.loginPrompt = 'Unexpected response format';
        }
      },
      error: (error) => {
        console.error('Error fetching users:', error);
        this.loginPrompt = 'An error occurred. Please try again.';
      }
    });
  }

  //signUp here
  signUp() {
    const { email, username, password } = this.signUpFormModel;
    this.uploadService.signUp({ email, username, password }).subscribe({
      next: (response) => {
        console.log('Sign Up Response:', response); // Log the response to verify
        if (response.remarks === 'success') {
          this.SignUpModal();
          alert('Sign up successful! You can now log in.');
        } else {
          this.signUpPrompt = 'Sign up failed. ' + response.message;
        }
      },
      error: (error) => {
        console.error('Error signing up:', error);
        this.signUpPrompt = 'An error occurred during sign up: ' + error.message;
      }
    });
  }
  

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  showSignUpModal() {
    this.showModal = true;
  }

  SignUpModal() {
    this.showModal = false;
  }
}
