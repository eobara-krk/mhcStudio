import { PdfExportComponent } from './pdf-export.component';

describe('PdfExportComponent', () => {
  it('should create', () => {
    const component = new PdfExportComponent();
    expect(component).toBeTruthy();
  });

  it('should export PDF without error', () => {
    const component = new PdfExportComponent();
    spyOn(window, 'URL').and.returnValue('blob:url');
    expect(() => component.exportToPDF()).not.toThrow();
  });
});
