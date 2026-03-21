import { Component, Input, Output, EventEmitter, inject, signal, computed, ViewChild, ElementRef, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { getInitials, fmtTime } from '../../core/utils/functions';

export interface ChatReaction {
  emoji: string;
  userId: number;
}

export interface ChatMessage {
  id: string | number;
  userId: number;
  userName: string;
  text: string;
  timestamp: Date;
  reactions?: ChatReaction[];
}

@Component({
  selector: 'app-board-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './board-chat.html',
  styleUrl: './board-chat.css'
})
export class BoardChatComponent implements OnChanges, OnInit {
  @Input() boardId!: number;
  @Input() socket: any;
  @Output() close = new EventEmitter<void>();

  @ViewChild('msgList') private msgList!: ElementRef;
  @ViewChild('chatInput') private chatInput!: ElementRef;

  private auth = inject(AuthService);
  private http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl;

  messages = signal<ChatMessage[]>([]);
  onlineUsers = signal<any[]>([]);
  typingUser = signal<string | null>(null);
  searchQuery = signal('');
  
  filteredMessages = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    if (!q) return this.messages();
    return this.messages().filter(m => m.text.toLowerCase().includes(q));
  });

  newMessage = '';
  loading = signal(false);
  private socketListening = false;
  private typingTimeout: any;

  ngOnInit() {
    this.loadHistory();
    setTimeout(() => this.chatInput?.nativeElement.focus(), 500);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['socket'] && this.socket && !this.socketListening) {
      this.setupSocketListeners();
    }
  }

  private setupSocketListeners() {
    this.socket.on('board:message', (msg: any) => {
      const mapped: ChatMessage = { ...msg, timestamp: new Date(msg.timestamp) };
      this.messages.update(m => [...m, mapped]);
      this.scrollToBottom();
    });

    this.socket.on('board:typing', (data: any) => {
      this.typingUser.set(data.userName);
    });

    this.socket.on('board:stop_typing', () => {
      this.typingUser.set(null);
    });

    this.socket.on('board:presence', (users: any[]) => {
      this.onlineUsers.set(users);
    });

    this.socket.on('board:reaction_update', (data: any) => {
      this.messages.update(prev => prev.map(m => {
        if (m.id === data.messageId) {
          const reactions = m.reactions || [];
          if (data.action === 'added') {
            return {
              ...m,
              reactions: [...reactions, { emoji: data.emoji, userId: data.userId }]
            };
          } else {
            return {
              ...m,
              reactions: reactions.filter(r => !(r.emoji === data.emoji && r.userId === data.userId))
            };
          }
        }
        return m;
      }));
    });

    this.socketListening = true;
  }

  toggleReaction(messageId: string | number, emoji: string) {
    if (!this.socket || !this.currentUser) return;
    this.socket.emit('board:reaction', {
      boardId: this.boardId,
      messageId,
      userId: this.currentUser.id,
      emoji
    });
  }

  // Helper to group reactions by emoji for rendering
  getGroupedReactions(msg: ChatMessage) {
    if (!msg.reactions) return [];
    const groups: { emoji: string; count: number; users: number[]; me: boolean }[] = [];
    msg.reactions.forEach(r => {
      let group = groups.find(g => g.emoji === r.emoji);
      if (!group) {
        group = { emoji: r.emoji, count: 0, users: [], me: false };
        groups.push(group);
      }
      group.count++;
      group.users.push(r.userId);
      if (r.userId === this.currentUser?.id) group.me = true;
    });
    return groups;
  }

  loadHistory() {
    if (!this.boardId) return;
    this.loading.set(true);
    this.http.get<{ success: boolean; data: any[] }>(
      `${this.apiUrl}/boards/${this.boardId}/messages`
    ).subscribe({
      next: (res) => {
        if (res.success) {
          const mapped = res.data.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
          this.messages.set(mapped);
          this.scrollToBottom();
        }
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        console.warn('Chat history unavailable, real-time only mode.');
      }
    });
  }

  get currentUser() { return this.auth.currentUser(); }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text || !this.socket) return;

    this.socket.emit('board:message', {
      boardId: this.boardId,
      userId: this.currentUser?.id ?? 0,
      userName: this.currentUser?.nombre || 'Tú',
      text
    });
    this.newMessage = '';
    this.onStopTyping();
  }

  onKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      this.sendMessage();
    } else {
      this.onTyping();
    }
  }

  private onTyping() {
    if (!this.socket) return;
    this.socket.emit('board:typing', { boardId: this.boardId, userName: this.currentUser?.nombre });
    
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
    this.typingTimeout = setTimeout(() => this.onStopTyping(), 3000);
  }

  private onStopTyping() {
    if (!this.socket) return;
    this.socket.emit('board:stop_typing', { boardId: this.boardId });
    if (this.typingTimeout) clearTimeout(this.typingTimeout);
  }

  isOnline(userId: number): boolean {
    return this.onlineUsers().some(u => u.userId === userId);
  }

  isMine(msg: ChatMessage): boolean {
    return msg.userId === this.currentUser?.id;
  }

  public getInitials = getInitials;
  public fmtTime     = fmtTime;

  private scrollToBottom() {
    setTimeout(() => {
      if (this.msgList) {
        this.msgList.nativeElement.scrollTop = this.msgList.nativeElement.scrollHeight;
      }
    }, 100);
  }
}
