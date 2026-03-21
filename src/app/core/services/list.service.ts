import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Lista } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class ListService extends BaseService {

  getLists(boardId: number): Observable<{success: boolean, data: Lista[]}> {
    return this.get<{success: boolean, data: Lista[]}>(`/boards/${boardId}/lists`);
  }

  createList(boardId: number, list: Partial<Lista>): Observable<{success: boolean, data: Lista}> {
    return this.post<{success: boolean, data: Lista}>(`/boards/${boardId}/lists`, list);
  }

  reorderLists(boardId: number, lists: any[]): Observable<any> {
    return this.patch(`/boards/${boardId}/lists/reorder`, { lists });
  }

  updateList(boardId: number, listId: number, data: Partial<Lista>): Observable<{success: boolean, data: Lista}> {
    return this.patch<{success: boolean, data: Lista}>(`/boards/${boardId}/lists/${listId}`, data);
  }

  archiveList(boardId: number, listId: number): Observable<{success: boolean}> {
    return this.patch<{success: boolean}>(`/boards/${boardId}/lists/${listId}/archive`, {});
  }

  deleteList(boardId: number, listId: number): Observable<{success: boolean}> {
    return this.delete<{success: boolean}>(`/boards/${boardId}/lists/${listId}`);
  }
}
