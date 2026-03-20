import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { User } from '../models';

@Injectable({
  providedIn: 'root'
})
export class MemberService {
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  getMembers(boardId: number): Observable<{success: boolean, data: User[]}> {
    return this.http.get<{success: boolean, data: User[]}>(`${this.apiUrl}/boards/${boardId}/members`);
  }

  addMember(boardId: number, email: string, rol: string = 'miembro'): Observable<{success: boolean, data: User}> {
    return this.http.post<{success: boolean, data: User}>(`${this.apiUrl}/boards/${boardId}/members`, { email, rol });
  }

  updateMemberRole(boardId: number, userId: number, rol: string): Observable<{success: boolean}> {
    return this.http.patch<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/members/${userId}`, { rol });
  }

  removeMember(boardId: number, userId: number): Observable<{success: boolean}> {
    return this.http.delete<{success: boolean}>(`${this.apiUrl}/boards/${boardId}/members/${userId}`);
  }
}
