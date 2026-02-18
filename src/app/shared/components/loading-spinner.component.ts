import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'sc-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex flex-col items-center justify-center gap-3" [class]="containerClass">
      <div class="spinner w-10 h-10"></div>
      <p *ngIf="message" class="text-sm text-gray-500">{{ message }}</p>
    </div>
  `,
})
export class LoadingSpinnerComponent {
  @Input() message = '';
  @Input() containerClass = 'py-16';
}
