export interface TemplateObject {
  id: string;
  type: string;
  x: number;
  y: number;
  width: number;
  height: number;
  // Dla tekstów
  text?: string;
  // Dla obrazów
  src?: string;
  // Dla tabel
  rows?: number;
  cols?: number;
}

export interface Template {
  objects: TemplateObject[];
  page: {
    width: number;
    height: number;
    margin?: number;
    marginTop?: number;
    marginLeft?: number;
    marginBottom?: number;
    marginRight?: number;
  };
}

export interface ValidationResult {
  warnings: string[];
  problematicIds: string[];
}