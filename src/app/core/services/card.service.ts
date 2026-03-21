import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tarjeta } from '../models';
import { BaseService } from './base.service';

@Injectable({
  providedIn: 'root'
})
export class CardService extends BaseService {

  getCards(boardId: number, listId: number): Observable<{success: boolean, data: Tarjeta[]}> {
    return this.get<{success: boolean, data: Tarjeta[]}>(`/boards/${boardId}/lists/${listId}/cards`);
  }

  createCard(boardId: number, listId: number, card: Partial<Tarjeta>): Observable<{success: boolean, data: Tarjeta}> {
    return this.post<{success: boolean, data: Tarjeta}>(`/boards/${boardId}/lists/${listId}/cards`, card);
  }

  reorderCards(boardId: number, listId: number, cards: any[]): Observable<any> {
    return this.patch(`/boards/${boardId}/lists/${listId}/cards/reorder`, { cards });
  }

  getCardById(boardId: number, listId: number, cardId: number): Observable<{success: boolean, data: Tarjeta}> {
    return this.get<{success: boolean, data: Tarjeta}>(`/boards/${boardId}/lists/${listId}/cards/${cardId}`);
  }

  updateCard(boardId: number, listId: number, cardId: number, card: Partial<Tarjeta>): Observable<{success: boolean, data: Tarjeta}> {
    return this.patch<{success: boolean, data: Tarjeta}>(`/boards/${boardId}/lists/${listId}/cards/${cardId}`, card);
  }

  moveCard(boardId: number, listId: number, cardId: number, destListId: number, posicion: number): Observable<{success: boolean, data: Tarjeta}> {
    return this.patch<{success: boolean, data: Tarjeta}>(`/boards/${boardId}/lists/${listId}/cards/${cardId}/move`, {
      listId: destListId,
      posicion
    });
  }

  deleteCard(boardId: number, listId: number, cardId: number): Observable<{success: boolean}> {
    return this.delete<{success: boolean}>(`/boards/${boardId}/lists/${listId}/cards/${cardId}`);
  }

  getAssignedCards(): Observable<{success: boolean, data: any[]}> {
    return this.get<{success: boolean, data: any[]}>('/cards/assigned/me');
  }
}
