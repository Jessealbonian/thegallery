import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { ImageUploadComponent } from './components/Uploadimage/upload.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, LoginComponent, ImageUploadComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  loggedIn = false;

  constructor() {
    // Here you can add logic to check if the user is logged in
    // For example, check a token or session status
  }

  handleLoginSuccess() {
    this.loggedIn = true;
  }
}
