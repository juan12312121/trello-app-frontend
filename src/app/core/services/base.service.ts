import { inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/**
 * BaseService provided common HTTP logic for all services.
 * Implements standard error handling and URL resolution.
 */
export abstract class BaseService {
  protected readonly http = inject(HttpClient);
  protected readonly apiUrl = environment.apiUrl;

  /**
   * Generic error handler for all HTTP requests.
   */
  protected handleError(error: HttpErrorResponse): Observable<never> {
    const errorMsg = error.error?.message || error.statusText || 'Error desconocido del servidor';
    console.error('API Error:', { status: error.status, message: errorMsg });
    return throwError(() => new Error(errorMsg));
  }

  /**
   * Wrapper for GET requests with standard error handling.
   */
  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(`${this.apiUrl}${path}`).pipe(
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Wrapper for POST requests.
   */
  protected post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(`${this.apiUrl}${path}`, body).pipe(
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Wrapper for PUT/PATCH requests.
   */
  protected patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(`${this.apiUrl}${path}`, body).pipe(
      catchError(err => this.handleError(err))
    );
  }

  /**
   * Wrapper for DELETE requests.
   */
  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(`${this.apiUrl}${path}`).pipe(
      catchError(err => this.handleError(err))
    );
  }
}
