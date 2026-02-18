import { Component } from '@angular/core';

@Component({
  selector: 'sc-demo-banner',
  standalone: true,
  template: `
    <div class="bg-primary-600 text-white text-sm text-center py-2 px-4 flex items-center justify-center gap-2">
      <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
      </svg>
      <span>
        <strong>Demo Mode:</strong> This is a demonstration system using mock data. No real patient data is stored.
      </span>
    </div>
  `,
})
export class DemoBannerComponent {}
