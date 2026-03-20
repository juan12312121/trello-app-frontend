import { Tarjeta } from './tarjeta.model';

export interface Lista {
  id: number;
  board_id?: number;
  nombre: string;
  posicion: number;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  archivada: boolean;
  cards: Tarjeta[];
}
