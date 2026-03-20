import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getAttachments(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: { attachments: any[] }}> {
    return this.http.get<{success: boolean, data: { attachments: any[] }}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/attachments`);
  }

  uploadAttachment(boardId: number, listId: number, cardId: number, file: File): Observable<{success: boolean, data: any}> {
    const formData = new FormData();
    formData.append('archivo', file);
    return this.http.post<{success: boolean, data: any}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/attachments`, formData);
  }

  downloadAttachment(boardId: number, listId: number, cardId: number, attachmentId: number, fileName: string): void {
    const url = `${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/attachments/${attachmentId}/download`;
    this.http.get(url, { responseType: 'blob' }).subscribe(blob => {
      const a = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      a.href = objectUrl;
      a.download = fileName;
      a.click();
      URL.revokeObjectURL(objectUrl);
    });
  }

  deleteAttachment(boardId: number, listId: number, cardId: number, attachmentId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/attachments/${attachmentId}`);
  }
}
