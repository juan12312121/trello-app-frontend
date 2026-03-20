import { Component, inject, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartType, Chart, registerables } from 'chart.js';
import { BoardService } from '../../core/services/board.service';

// Register all chart controllers, elements, scales, plugins to prevent "not a registered controller" error
Chart.register(...registerables);

@Component({
  selector: 'app-analiticas',
  standalone: true,
  imports: [CommonModule, BaseChartDirective],
  templateUrl: './analiticas.html',
  styleUrl: './analiticas.css'
})
export class AnaliticasComponent {
  private boardService = inject(BoardService);
  
  activities = input<any[]>([]);
  pendientes = input<any[]>([]);

  // KPIs
  totalBoards = computed(() => this.boardService.boards().length);
  totalCards = computed(() => this.boardService.boards().reduce((s, b) => s + (b.total_tarjetas || 0), 0));
  totalReminders = computed(() => this.pendientes().length);

  public doughnutChartType: ChartType = 'doughnut';
  public barChartType: ChartType = 'bar';
  public lineChartType: ChartType = 'line';
  
  public chartData = computed(() => {
    const boards = this.boardService.boards().slice(0, 10);
    const labels = boards.map(b => b.nombre);
    const data = boards.map(b => b.total_tarjetas || 0);
    
    return {
      labels: labels.length ? labels : ['Sin datos'],
      datasets: [
        {
          data: data.length ? data : [1],
          backgroundColor: [
            '#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#f43f5e', '#06b6d4', '#ec4899', '#14b8a6', '#f97316', '#84cc16'
          ],
          borderWidth: 0
        }
      ]
    };
  });

  public barChartData = computed(() => {
    const boards = this.boardService.boards().slice(0, 10);
    const labels = boards.map(b => b.nombre);
    const listsData = boards.map(b => b.total_columnas || 0);
    
    return {
      labels: labels.length ? labels : ['Sin datos'],
      datasets: [
        {
          data: listsData.length ? listsData : [1],
          label: 'Columnas',
          backgroundColor: '#3b82f6',
          borderRadius: 4
        }
      ]
    };
  });

  public lineChartData = computed(() => {
    let acts = this.activities();
    
    // Fallback: Si el backend devuelve un objeto en lugar de un array directamente
    if (!Array.isArray(acts)) {
      acts = (acts && (acts as any).activity && Array.isArray((acts as any).activity)) 
        ? (acts as any).activity 
        : [];
    }

    const last7Days = Array.from({length: 7}, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split('T')[0];
    });
    
    const counts = last7Days.map(dateStr => {
      return acts.filter(a => {
        if (!a.fecha) return false;
        try {
          return new Date(a.fecha).toISOString().split('T')[0] === dateStr;
        } catch(e) { return false; }
      }).length;
    });

    return {
      labels: last7Days.map(d => {
        const [, m, day] = d.split('-');
        return `${day}/${m}`;
      }),
      datasets: [
        {
          data: counts,
          label: 'Acciones',
          borderColor: '#8b5cf6',
          backgroundColor: 'rgba(139, 92, 246, 0.1)',
          borderWidth: 2,
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#8b5cf6',
          pointBorderColor: '#ffffff'
        }
      ]
    };
  });
  
  public chartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
        labels: { color: '#94a3b8', font: { family: "'DM Sans', sans-serif" } }
      }
    }
  };

  public barChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { ticks: { color: '#94a3b8' }, grid: { color: 'rgba(148, 163, 184, 0.1)' } },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
    }
  };

  public lineChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { stepSize: 1, color: '#94a3b8' }, 
        grid: { color: 'rgba(148, 163, 184, 0.1)' } 
      },
      x: { ticks: { color: '#94a3b8' }, grid: { display: false } }
    }
  };
}
