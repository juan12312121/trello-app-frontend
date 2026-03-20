import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Checklist, ChecklistItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ChecklistService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getChecklists(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: Checklist[]}> {
    return this.http.get<{success: boolean, data: Checklist[]}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists`);
  }

  addChecklist(boardId: number, listId: number, cardId: number, titulo: string): Observable<{success: boolean, data: Checklist}> {
    return this.http.post<{success: boolean, data: Checklist}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists`, { titulo });
  }

  deleteChecklist(boardId: number, listId: number, cardId: number, checklistId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists/${checklistId}`);
  }

  addChecklistItem(boardId: number, listId: number, cardId: number, checklistId: number, texto: string): Observable<{success: boolean, data: ChecklistItem}> {
    return this.http.post<{success: boolean, data: ChecklistItem}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists/${checklistId}/items`, { texto });
  }

  updateChecklistItem(boardId: number, listId: number, cardId: number, checklistId: number, itemId: number, data: Partial<ChecklistItem>): Observable<{success: boolean, data: ChecklistItem}> {
    return this.http.patch<{success: boolean, data: ChecklistItem}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`, data);
  }

  deleteChecklistItem(boardId: number, listId: number, cardId: number, checklistId: number, itemId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/checklists/${checklistId}/items/${itemId}`);
  }
}
