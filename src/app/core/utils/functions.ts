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
    return url.replace(/https?:\/\/localhost:3000/g, serverUrl);
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

/** 
 * UX MICRO-INTERACTIONS 
 */

export function playSuccessPop() {
  try {
    const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    if (audioCtx.state === 'suspended') audioCtx.resume();
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(800, audioCtx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.15);
    gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    oscillator.start();
    oscillator.stop(audioCtx.currentTime + 0.15);
  } catch (e) { }
}

export function fireConfetti() {
  try {
    if ((window as any).confetti) {
      (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
    } else {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/canvas-confetti@1.9.3/dist/confetti.browser.min.js';
      script.onload = () => {
        (window as any).confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
      };
      document.body.appendChild(script);
    }
  } catch (e) {}
}
