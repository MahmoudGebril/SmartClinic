import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sc-stat-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card flex items-center gap-4">
      <div class="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center"
           [ngClass]="iconBgClass">
        <svg class="w-6 h-6" [ngClass]="iconClass" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="iconPath"/>
        </svg>
      </div>
      <div class="flex-1 min-w-0">
        <p class="text-sm font-medium text-gray-500 truncate">{{ label }}</p>
        <p class="text-2xl font-bold text-gray-800 mt-0.5">{{ displayValue }}</p>
        <p *ngIf="subLabel" class="text-xs text-gray-400 mt-0.5">{{ subLabel }}</p>
      </div>
      <div *ngIf="trend !== null" class="flex-shrink-0 text-sm font-medium"
           [ngClass]="trend >= 0 ? 'text-emerald-600' : 'text-red-500'">
        {{ trend >= 0 ? '↑' : '↓' }} {{ Math.abs(trend) }}%
      </div>
    </div>
  `,
})
export class StatCardComponent {
  @Input() label = '';
  @Input() value: number = 0;
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() subLabel = '';
  @Input() trend: number | null = null;
  @Input() iconPath = '';
  @Input() iconBgClass = 'bg-primary-50';
  @Input() iconClass = 'text-primary-600';

  Math = Math;

  get displayValue(): string {
    if (this.prefix === '$') {
      return `$${this.value.toLocaleString()}`;
    }
    return `${this.prefix}${this.value.toLocaleString()}${this.suffix}`;
  }
}
