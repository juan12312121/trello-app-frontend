import { Checklist } from './checklist.model';
import { Comentario } from './comentario.model';

export interface Tarjeta {
  id: number;
  lista_id?: number;
  titulo: string;
  descripcion: string;
  posicion?: number;
  prioridad: 'baja' | 'media' | 'alta';
  fecha_vencimiento: string | null;
  usuario_asignado_id: number | null;
  completada: boolean;
  portada?: string | null;
  fecha_creacion?: string;
  fecha_actualizacion?: string;
  tags: number[]; // Las vistas esperan IDs habitualmente
  checklist: Checklist | null;
  comments: Comentario[];
  attachments: number; // En la vista kanban es un contador
  attachments_list?: any[]; // Para el detalle real
  total_checklists?: number;
  total_comentarios?: number;
  total_archivos?: number;
  tiempo_estimado?: number;
  tiempo_dedicado?: number;
}
