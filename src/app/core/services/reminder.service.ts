import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReminderService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getReminders(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: { reminders: any[] }}> {
    return this.http.get<{success: boolean, data: { reminders: any[] }}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/reminders`);
  }

  getPendingReminders(): Observable<{success: boolean, data: { reminders: any[] }}> {
    return this.http.get<{success: boolean, data: { reminders: any[] }}>(`${this.apiUrl}/reminders/pending`);
  }

  addReminder(boardId: number, listId: number, cardId: number, data: any): Observable<{success: boolean, data: any}> {
    return this.http.post<{success: boolean, data: any}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/reminders`, data);
  }

  updateReminder(boardId: number, listId: number, cardId: number, reminderId: number, data: any): Observable<{success: boolean, data: any}> {
    return this.http.patch<{success: boolean, data: any}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/reminders/${reminderId}`, data);
  }

  deleteReminder(boardId: number, listId: number, cardId: number, reminderId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/reminders/${reminderId}`);
  }
}
