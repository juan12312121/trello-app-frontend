import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Invitacion {
  id: number;
  board_id: number;
  invitado_email: string;
  rol: string;
  estado: string;
  fecha_creacion: string;
  board_nombre: string;
  board_portada?: string;
  invitador_nombre: string;
  invitador_email: string;
}

@Injectable({
  providedIn: 'root'
})
export class InvitationService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  // Enviar invitación a un tablero
  inviteMember(boardId: number, email: string, rol: string): Observable<{success: boolean, data: any, message: string}> {
    return this.http.post<any>(`${this.apiUrl}/boards/${boardId}/invitations`, { email, rol });
  }

  // Ver invitaciones que he enviado a este tablero
  getBoardInvitations(boardId: number): Observable<{success: boolean, data: any[]}> {
    return this.http.get<any>(`${this.apiUrl}/boards/${boardId}/invitations`);
  }

  // Obtener MIS invitaciones pendientes (soy el invitado)
  getMyPendingInvitations(): Observable<{success: boolean, data: Invitacion[]}> {
    return this.http.get<any>(`${this.apiUrl}/invitations/pending`);
  }

  // Aceptar invitación a tablero
  acceptInvitation(invitationId: number): Observable<{success: boolean, data: {boardId: number}}> {
    return this.http.patch<any>(`${this.apiUrl}/invitations/${invitationId}/accept`, {});
  }

  // Rechazar invitación a tablero
  rejectInvitation(invitationId: number): Observable<{success: boolean}> {
    return this.http.patch<any>(`${this.apiUrl}/invitations/${invitationId}/reject`, {});
  }
}
