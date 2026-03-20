import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Comentario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CommentService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getComments(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: Comentario[]}> {
    return this.http.get<{success: boolean, data: Comentario[]}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`);
  }

  addComment(boardId: number, listId: number, cardId: number, texto: string): Observable<{success: boolean, data: Comentario}> {
    return this.http.post<{success: boolean, data: Comentario}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/comments`, { texto });
  }

  updateComment(boardId: number, listId: number, cardId: number, commentId: number, texto: string): Observable<{success: boolean, data: Comentario}> {
    return this.http.patch<{success: boolean, data: Comentario}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/comments/${commentId}`, { texto });
  }

  deleteComment(boardId: number, listId: number, cardId: number, commentId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/comments/${commentId}`);
  }
}
