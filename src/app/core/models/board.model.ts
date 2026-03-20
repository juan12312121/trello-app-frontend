import { User } from './user.model';
import { Lista } from './lista.model';

export interface Board {
  id: number;
  nombre: string;
  descripcion?: string;
  usuario_propietario_id: number;
  portada?: string;
  fecha_creacion: string;
  fecha_actualizacion: string;
  archivado: boolean;
  lists?: Lista[]; 
  total_columnas?: number;
  total_tarjetas?: number;
  miembros?: User[];
}
