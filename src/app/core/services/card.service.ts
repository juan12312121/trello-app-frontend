import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Tarjeta } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CardService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getCards(boardId: number, listId: number): Observable<{success: boolean, data: Tarjeta[]}> {
    return this.http.get<{success: boolean, data: Tarjeta[]}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards`);
  }

  createCard(boardId: number, listId: number, card: Partial<Tarjeta>): Observable<{success: boolean, data: Tarjeta}> {
    return this.http.post<{success: boolean, data: Tarjeta}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards`, card);
  }

  reorderCards(boardId: number, listId: number, cards: any[]): Observable<any> {
    return this.http.patch(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/reorder`, { cards });
  }

  getCardById(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: Tarjeta}> {
    return this.http.get<{success: boolean, data: Tarjeta}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
  }

  updateCard(boardId: number, listId: number, cardId: number, card: Partial<Tarjeta>): Observable<{success: boolean, data: Tarjeta}> {
    return this.http.patch<{success: boolean, data: Tarjeta}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}`, card);
  }

  moveCard(boardId: number, listId: number, cardId: number, destListId: number, posicion: number): Observable<{success: boolean, data: Tarjeta}> {
    return this.http.patch<{success: boolean, data: Tarjeta}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}/move`, {
      listId: destListId,
      posicion
    });
  }

  deleteCard(boardId: number, listId: number, cardId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/lists/${listId}/cards/${cardId}`);
  }

  getAssignedCards(): Observable<{success: boolean, data: any[]}> {
    return this.http.get<{success: boolean, data: any[]}>(`${this.apiUrl}/cards/assigned/me`);
  }
}
