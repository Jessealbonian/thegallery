import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiResponse } from '../components/login/api-response.model'; // Adjust path as needed

@Injectable({
  providedIn: 'root'
})
export class FileUploadService {
  private baseUrl = 'http://localhost/GallyAPI/api';

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

  // Get users
  getUsers(): Observable<ApiResponse<any[]>> {
    return this.http.get<ApiResponse<any[]>>(`${this.baseUrl}/getUsers`).pipe(
      catchError(error => {
        console.error('Error fetching Users:', error);
        return throwError(error);
      })
    );
  }

  //signup
  signUp(signUpData: { email: string, username: string, password: string }): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<any>(`${this.baseUrl}/signup`, signUpData, { headers })
      .pipe(
        catchError(error => {
          console.error('Error signing up:', error);
          return throwError(error);
        })
      );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    let errorMessage = 'Unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Client-side error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Server-side error: ${error.status} - ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
