export interface ChecklistItem {
  id: number;
  texto: string;
  completado: boolean;
}

export interface Checklist {
  id: number;
  titulo: string;
  items: ChecklistItem[];
}
