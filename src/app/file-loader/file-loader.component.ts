

import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-file-loader',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './file-loader.component.html'
})
export class FileLoaderComponent {
  @Output() fileLoaded = new EventEmitter<any>();

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const text = reader.result as string;
      // Sprawdź czy to JSON
      if (file.name.endsWith('.json')) {
        try {
          const data = JSON.parse(text);
          this.fileLoaded.emit(data);
        } catch {
          alert('Błąd: nieprawidłowy plik JSON');
        }
        return;
      }
      // Sprawdź czy to XML/EPR/EPB
      if (file.name.endsWith('.epr') || file.name.endsWith('.epb') || text.trim().startsWith('<?xml')) {
        try {
          const parser = new DOMParser();
          const xml = parser.parseFromString(text, 'application/xml');
          // Wyciągnij rozmiar strony i marginesy
          const pageNode = xml.querySelector('fo\\:simple-page-master');
          let width = 210, height = 297;
          // Domyślne marginesy: 1 cm góra, 2 cm lewa, 1 cm dół, 1 cm prawa
          let marginTop = 10, marginLeft = 20, marginBottom = 10, marginRight = 10;
          if (pageNode) {
            const w = pageNode.getAttribute('page-width');
            const h = pageNode.getAttribute('page-height');
            width = this.parseLength(w) || width;
            height = this.parseLength(h) || height;
            // Marginesy z fo:region-body
            const regionBody = pageNode.querySelector('fo\\:region-body');
            if (regionBody) {
              // margin, margin-top, margin-left, margin-bottom, margin-right
              const m = regionBody.getAttribute('margin');
              const mt = regionBody.getAttribute('margin-top');
              const ml = regionBody.getAttribute('margin-left');
              const mb = regionBody.getAttribute('margin-bottom');
              const mr = regionBody.getAttribute('margin-right');
              if (m) {
                marginTop = marginLeft = marginBottom = marginRight = this.parseLength(m) || 10;
              }
              if (mt) marginTop = this.parseLength(mt) || marginTop;
              if (ml) marginLeft = this.parseLength(ml) || marginLeft;
              if (mb) marginBottom = this.parseLength(mb) || marginBottom;
              if (mr) marginRight = this.parseLength(mr) || marginRight;
            }
          }
          // Rekurencyjne wyszukiwanie obiektów
          const objects: any[] = [];
          let y = 20;
          let blockCount = 0, imgCount = 0, tableCount = 0;
          function walk(node: Element) {
            // Teksty
            if (node.localName === 'block' && node.namespaceURI?.includes('XSL/Format')) {
              const text = node.textContent?.trim() || '';
              if (text.length > 0) {
                objects.push({
                  id: text.length > 30 ? text.slice(0, 27) + '...' : text, // id to fragment treści
                  type: 'text',
                  x: 10,
                  y: y,
                  width: 200,
                  height: 30,
                  text
                });
                y += 40;
              }
            }
            // Obrazy
            if (node.localName === 'external-graphic' && node.namespaceURI?.includes('XSL/Format')) {
              objects.push({
                id: 'img' + (imgCount++),
                type: 'image',
                x: 220,
                y: 20 + imgCount * 60,
                width: 60,
                height: 60,
                src: node.getAttribute('src') || ''
              });
            }
            // Tabele
            if (node.localName === 'table' && node.namespaceURI?.includes('XSL/Format')) {
              objects.push({
                id: 'table' + (tableCount++),
                type: 'table',
                x: 10,
                y: y + tableCount * 80,
                width: 300,
                height: 60,
                rows: node.querySelectorAll('fo\\:table-row').length,
                cols: node.querySelectorAll('fo\\:table-column').length
              });
            }
            // Rekurencja po dzieciach
            Array.from(node.children).forEach(walk);
          }
          walk(xml.documentElement);
          const template = {
            objects,
            page: { width, height, marginTop, marginLeft, marginBottom, marginRight }
          };
          this.fileLoaded.emit(template);
        } catch (e) {
          alert('Błąd: nieprawidłowy plik EPR/XML');
        }
        return;
      }
      alert('Nieobsługiwany format pliku. Wczytaj plik .json lub .epr');
    };
    reader.readAsText(file);
  }

  // Pomocnicza: zamiana "8.5in" na mm
  parseLength(val: string | null): number | null {
    if (!val) return null;
    if (val.endsWith('mm')) return parseFloat(val);
    if (val.endsWith('cm')) return parseFloat(val) * 10;
    if (val.endsWith('in')) return parseFloat(val) * 25.4;
    return parseFloat(val);
  }
}
