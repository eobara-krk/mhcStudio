
import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import { Template } from '../template.model';

@Component({
  selector: 'app-pdf-export',
  templateUrl: './pdf-export.component.html',
  styleUrls: ['./pdf-export.component.css']
})

export class PdfExportComponent {
  @Input() template: Template | null = null;

  // Przelicz mm na jednostki PDF (jsPDF domyślnie: 1 unit = 1 pt, ale można ustawić mm)
  mmToPdf(mm: number): number {
    // jsPDF może pracować w mm, więc nie trzeba przeliczać
    return mm;
  }

  exportToPDF(): void {
    console.log('PDF export template:', this.template);
    const doc = new jsPDF({ unit: 'mm', format: [this.template?.page.width || 210, this.template?.page.height || 297] });

    if (this.template) {
      // Ramka marginesów strony
      doc.setDrawColor(0, 0, 255);
      doc.rect(
        this.mmToPdf(this.template.page.marginLeft ?? 0),
        this.mmToPdf(this.template.page.marginTop ?? 0),
        this.mmToPdf(this.template.page.width - (this.template.page.marginLeft ?? 0) - (this.template.page.marginRight ?? 0)),
        this.mmToPdf(this.template.page.height - (this.template.page.marginTop ?? 0) - (this.template.page.marginBottom ?? 0)),
        'S'
      );

      // Okienko adresowe
      doc.setDrawColor(191, 165, 0);
      doc.rect(this.mmToPdf(100), this.mmToPdf(31.2), this.mmToPdf(107.2), this.mmToPdf(61.2), 'S');

      // Obszar logo KRUK
      doc.setDrawColor(0, 119, 182);
      doc.rect(this.mmToPdf(174.4), this.mmToPdf(10), this.mmToPdf(25.6), this.mmToPdf(20), 'S');

      // Obszar kodu kreskowego
      doc.setDrawColor(215, 38, 61);
      doc.rect(this.mmToPdf(139.8), this.mmToPdf(46.4), this.mmToPdf(60.1), this.mmToPdf(7.6), 'S');

      // Obszar adresu klienta
      doc.setDrawColor(0, 158, 96);
      doc.rect(this.mmToPdf(120.9), this.mmToPdf(60.8), this.mmToPdf(72.9), this.mmToPdf(25), 'S');
    } else {
      doc.setTextColor(255, 0, 0);
      doc.text('Brak danych szablonu!', 10, 10);
    }

    doc.save('wynik.pdf');
  }
}
