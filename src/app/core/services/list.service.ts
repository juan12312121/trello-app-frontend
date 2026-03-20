import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Lista } from '../models';

@Injectable({
  providedIn: 'root'
})
export class ListService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getLists(boardId: number): Observable<{success: boolean, data: Lista[]}> {
    return this.http.get<{success: boolean, data: Lista[]}>(`${this.apiUrl}/boards/${boardId}/lists`);
  }

  createList(boardId: number, list: Partial<Lista>): Observable<{success: boolean, data: Lista}> {
    return this.http.post<{success: boolean, data: Lista}>(`${this.apiUrl}/boards/${boardId}/lists`, list);
  }

  reorderLists(boardId: number, lists: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/boards/${boardId}/lists/reorder`, { lists });
  }

  updateList(boardId: number, listId: number, data: Partial<Lista>): Observable<{success: boolean, data: Lista}> {
    return this.http.patch<{success: boolean, data: Lista}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}`, data);
  }

  archiveList(boardId: number, listId: number): Observable<{success: boolean}> {
    return this.http.patch<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/archive`, {});
  }

  deleteList(boardId: number, listId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}`);
  }
}
