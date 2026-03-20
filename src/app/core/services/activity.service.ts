import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getActivity(boardId: number): Observable<{success: boolean, data: { activity: any[] }}> {
    return this.http.get<{success: boolean, data: { activity: any[] }}>(`${this.apiUrl}/boards/${boardId}/activity`);
  }

  getUserActivity(): Observable<{success: boolean, data: any[]}> {
    return this.http.get<any>(`${this.apiUrl}/activity/me`);
  }
}
