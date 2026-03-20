import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tag } from '../models';

@Injectable({
  providedIn: 'root'
})
export class TagService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getTags(boardId: number): Observable<{success: boolean, data: { tags: Tag[] }}> {
    return this.http.get<{success: boolean, data: { tags: Tag[] }}>(`${this.apiUrl}/boards/${boardId}/tags`);
  }

  createTag(boardId: number, tag: Partial<Tag>): Observable<{success: boolean, data: Tag}> {
    return this.http.post<{success: boolean, data: Tag}>(`${this.apiUrl}/boards/${boardId}/tags`, tag);
  }

  updateTag(boardId: number, tagId: number, tag: Partial<Tag>): Observable<{success: boolean, data: Tag}> {
    return this.http.patch<{success: boolean, data: Tag}>(`${this.apiUrl}/boards/${boardId}/tags/${tagId}`, tag);
  }

  deleteTag(boardId: number, tagId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/tags/${tagId}`);
  }

  getCardTags(boardId: number, cardId: number): Observable<{success: boolean, data: Tag[]}> {
    return this.http.get<{success: boolean, data: Tag[]}>(`${this.apiUrl}/boards/${boardId}/tags/card/${cardId}`);
  }

  assignTagToCard(boardId: number, cardId: number, tagId: number): Observable<{success: boolean}> {
    return this.http.post<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/tags/card/${cardId}/${tagId}`, {});
  }

  removeTagFromCard(boardId: number, cardId: number, tagId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/tags/card/${cardId}/${tagId}`);
  }
}
