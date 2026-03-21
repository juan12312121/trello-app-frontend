export function getInitials(name: string | undefined): string {
  if (!name) return '?';
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
}

export function fmtDate(d: any): string {
  if (!d) return '—';
  try {
    const date = new Date(d);
    if (typeof d === 'string' && d.length === 10 && d.includes('-')) {
      date.setHours(12, 0, 0, 0);
    }
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return '—';
  }
}

export function fmtTime(d: any): string {
  if (!d) return '—';
  try {
    const date = new Date(d);
    if (isNaN(date.getTime())) return '—';
    return date.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '—';
  }
}

export function getMemberInitials(name: string | undefined): string {
  return getInitials(name);
}

export function normalizeServerUrl(url: string | undefined | null, serverUrl: string): string {
  if (!url) return '';
  if (url.includes('localhost:3000')) {
    return url.replace('http://localhost:3000', serverUrl);
  }
  return url;
}

export function isImage(p: string | undefined | null): boolean {
  return !!p?.startsWith('url') || !!p?.startsWith('http') || !!p?.startsWith('data:image');
}

/** 
 * FUNCTIONAL PROGRAMMING UTILS 
 */

/** Filter items by a property value (Pure Function) */
export const filterByProp = <T>(items: T[], key: keyof T, value: any): T[] => 
  items.filter(item => item[key] === value);

/** Sort items by a property (Pure Function) */
export const sortByProp = <T>(items: T[], key: keyof T, desc = false): T[] => 
  [...items].sort((a, b) => {
    const valA = a[key];
    const valB = b[key];
    if (valA < valB) return desc ? 1 : -1;
    if (valA > valB) return desc ? -1 : 1;
    return 0;
  });

/** Calculate sum of a property in an array (Pure Function) */
export const sumByProp = <T>(items: T[], key: keyof T): number => 
  items.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);

/** Group items by a key (Pure Function) */
export const groupByProp = <T>(items: T[], key: keyof T): Record<string, T[]> => 
  items.reduce((acc, item) => {
    const val = String(item[key]);
    if (!acc[val]) acc[val] = [];
    acc[val].push(item);
    return acc;
  }, {} as any);
