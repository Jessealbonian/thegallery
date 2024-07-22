import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost/GalleryAPI/api/modules';

  constructor(private http: HttpClient) {}

  // Upload a file
  upload(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('image', file, file.name);

    return this.http.post<any>(`${this.baseUrl}/upload`, formData).pipe(
      catchError(error => {
        console.error('Error uploading file:', error);
        return throwError(error);
      })
    );
  }

  // Get list of files
  getFiles(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/getimages`).pipe(
      catchError(error => {
        console.error('Error fetching images:', error);
        return throwError(error);
      })
    );
  }

  // Login
  login(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, { email, password }).pipe(
      catchError(error => {
        console.error('Error logging in:', error);
        return throwError(error);
      })
    );
  }

  // Sign up
  signUp(email: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, { email, password }).pipe(
      catchError(error => {
        console.error('Error signing up:', error);
        return throwError(error);
      })
    );
  }
}
