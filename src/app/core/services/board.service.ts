import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Board, Lista, Tarjeta, Tag, User, Comentario, Checklist, ChecklistItem } from '../models';

@Injectable({
  providedIn: 'root'
})
export class BoardService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Signals para estado global de tableros.
  boards = signal<Board[]>([]);
  activeBoard = signal<Board | null>(null);
  boardSearchQuery = signal<string>('');

  // ── Tableros ──────────────────────────────────────────────────────────

  getBoards(): Observable<{success: boolean, data: Board[]}> {
    return this.http.get<{success: boolean, data: Board[]}>(`${this.apiUrl}/boards`).pipe(
      tap(res => {
        if (res.success) {
          this.boards.set(Array.isArray(res.data) ? res.data : []);
        }
      })
    );
  }

  getBoardById(id: number): Observable<{success: boolean, data: Board}> {
    return this.http.get<{success: boolean, data: Board}>(`${this.apiUrl}/boards/${id}`).pipe(
      tap(res => {
        if (res.success) this.activeBoard.set(res.data);
      })
    );
  }

  createBoard(board: Partial<Board>): Observable<{success: boolean, data: Board}> {
    return this.http.post<{success: boolean, data: Board}>(`${this.apiUrl}/boards`, board).pipe(
      tap(res => {
        if (res.success) this.boards.update(prev => [...prev, res.data]);
      })
    );
  }

  updateBoard(boardId: number, board: Partial<Board>): Observable<{success: boolean, data: Board}> {
    return this.http.patch<{success: boolean, data: Board}>(`${this.apiUrl}/boards/${boardId}`, board).pipe(
      tap(res => {
        if (res.success) {
          this.boards.update(prev => prev.map(b => b.id === boardId ? { ...b, ...board } : b));
        }
      })
    );
  }

  updateBoardBackground(boardId: number, file: File): Observable<{success: boolean, data: Board}> {
    const formData = new FormData();
    formData.append('portada', file);
    return this.http.patch<{success: boolean, data: Board}>(`${this.apiUrl}/boards/${boardId}`, formData);
  }

  archiveBoard(boardId: number): Observable<{success: boolean}> {
    return this.http.patch<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/archive`, {});
  }

  deleteBoard(boardId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}`).pipe(
      tap(res => {
        if (res.success) {
          this.boards.update(prev => prev.filter(b => b.id !== boardId));
        }
      })
    );
  }
}
