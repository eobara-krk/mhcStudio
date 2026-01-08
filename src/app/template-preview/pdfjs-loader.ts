function base64ToUint8Array(base64: string): Uint8Array {
  const raw = window.atob(base64);
  const uint8Array = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    uint8Array[i] = raw.charCodeAt(i);
  }
  return uint8Array;
}
// Loader PDF.js dla Angulara
// Instalacja: npm install pdfjs-dist
import { PDFDocumentProxy, getDocument, GlobalWorkerOptions } from 'pdfjs-dist';

// Konfiguracja workerSrc dla PDF.js
GlobalWorkerOptions.workerSrc = '/assets/pdf.worker.min.js';

export async function renderPdfToCanvas(pdfDataUrl: string, canvas: HTMLCanvasElement): Promise<void> {
  try {
    // Zamiana base64 na Uint8Array
    const base64 = pdfDataUrl.split(',')[1];
    const bytes = base64ToUint8Array(base64);
    const loadingTask = getDocument({ data: bytes });
    const pdf: PDFDocumentProxy = await loadingTask.promise;
    const page = await pdf.getPage(1);
    const viewport = page.getViewport({ scale: 1.5 });
    const context = canvas.getContext('2d');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context!, viewport, canvas }).promise;
  } catch (err) {
    console.error('PDF render error:', err);
  }
}
