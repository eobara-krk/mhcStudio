
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Template } from '../template.model';

@Component({
  selector: 'app-template-preview',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-preview.component.html',
  styleUrls: ['./template-preview.component.css']
})
export class TemplatePreviewComponent {
  @Input() template: Template | null = null;
  @Input() problematicIds: string[] = [];

  // Przelicz mm na px (1 mm ≈ 3.78 px przy 96dpi)
  mmToPx(mm: number): number {
    return mm * 3.78;
  }

  // Helper to generate array for ruler ticks in centimeters
  cmTicks(mmCount: number): number[] {
    return Array.from({ length: Math.floor(mmCount / 10) + 1 }, (_, i) => i);
  }
}
