import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Observable } from 'rxjs';
import { FileUploadService } from '../../services/upload.service'; // Adjust the path as needed
import { ImageUploadComponent } from '../Uploadimage/upload.component';
import { ApiResponse } from './api-response.model'; // Adjust path as needed


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterOutlet, ImageUploadComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginFormModel = { username: '', password: '' };
  signUpFormModel = { email: '', username: '', password: '' };
  loginPrompt: string = '';
  showModal: boolean = false;
  hidePassword: boolean = true;
  loggedIn: boolean = false;

  constructor(private uploadService: FileUploadService) {}

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

  signUp() {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const body = { action: 'signup', ...this.signUpFormModel };
    this.http.post<any>('http://localhost/GallyAPI/api/', body, { headers }).subscribe({
      next: (response) => {
        if (response.success) {
          this.hideSignUpModal();
        } else {
          alert('Sign up failed. Please try again.');
        }
      },
      error: () => {
        alert('An error occurred. Please try again.');
      }
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  showSignUpModal() {
    this.showModal = true;
  }

  hideSignUpModal() {
    this.showModal = false;
  }
}
