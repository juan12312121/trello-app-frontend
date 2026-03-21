import { Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Board } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class BoardService extends BaseService {

  // Signals para estado global de tableros.
  boards = signal<Board[]>([]);
  activeBoard = signal<Board | null>(null);
  boardSearchQuery = signal<string>('');

  // ── Tableros ──────────────────────────────────────────────────────────

  getBoards(): Observable<{success: boolean, data: Board[]}> {
    return this.get<{success: boolean, data: Board[]}>('/boards').pipe(
      tap(res => {
        if (res.success) {
          this.boards.set(Array.isArray(res.data) ? res.data : []);
        }
      })
    );
  }

  getBoardById(id: number | string): Observable<{success: boolean, data: Board}> {
    return this.get<{success: boolean, data: Board}>(`/boards/${id}`).pipe(
      tap(res => {
        if (res.success) this.activeBoard.set(res.data);
      })
    );
  }

  createBoard(board: Partial<Board>): Observable<{success: boolean, data: Board}> {
    return this.post<{success: boolean, data: Board}>('/boards', board).pipe(
      tap(res => {
        if (res.success) this.boards.update(prev => [...prev, res.data]);
      })
    );
  }

  updateBoard(boardId: number, board: Partial<Board>): Observable<{success: boolean, data: Board}> {
    return this.patch<{success: boolean, data: Board}>(`/boards/${boardId}`, board).pipe(
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
    return this.patch<{success: boolean, data: Board}>(`/boards/${boardId}`, formData);
  }

  archiveBoard(boardId: number): Observable<{success: boolean}> {
    return this.patch<{success: boolean}>(`/boards/${boardId}/archive`, {});
  }

  deleteBoard(boardId: number): Observable<{success: boolean}> {
    return this.delete<{success: boolean}>(`/boards/${boardId}`).pipe(
      tap(res => {
        if (res.success) {
          this.boards.update(prev => prev.filter(b => b.id !== boardId));
        }
      })
    );
  }
}
