
import { Component, Input, ViewChild, ElementRef } from '@angular/core';
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

  pdfSrc: string | null = null;
  @ViewChild('pdfInput') pdfInput!: ElementRef<HTMLInputElement>;

  onPdfUploadClick(): void {
    if (this.pdfInput) {
      this.pdfInput.nativeElement.click();
    }
  }

  onPdfSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.pdfSrc = e.target.result;
        // renderowanie PDF będzie w osobnej metodzie
        setTimeout(() => this.renderPdf(), 100);
      };
      reader.readAsDataURL(file);
    }
  }

  async renderPdf(): Promise<void> {
    if (!this.pdfSrc) return;
    const canvas = document.querySelector<HTMLCanvasElement>("#pdfCanvas");
    if (canvas) {
      const { renderPdfToCanvas } = await import('./pdfjs-loader');
      await renderPdfToCanvas(this.pdfSrc, canvas);
    }
  }

  // Przelicz mm na px (1 mm ≈ 3.78 px przy 96dpi)
  mmToPx(mm: number): number {
    return mm * 3.78;
  }

  // Helper to generate array for ruler ticks in centimeters
  cmTicks(mmCount: number): number[] {
    return Array.from({ length: Math.floor(mmCount / 10) + 1 }, (_, i) => i);
  }
}
