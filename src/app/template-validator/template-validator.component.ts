import { Component, Input, Output, EventEmitter, OnChanges } from '@angular/core';
import { Template, ValidationResult, TemplateObject } from '../template.model';

@Component({
  selector: 'app-template-validator',
  template: ''
})
export class TemplateValidatorComponent implements OnChanges {
  @Input() template: Template | null = null;
  @Output() validationResult = new EventEmitter<ValidationResult>();

  ngOnChanges() {
    if (this.template) {
      this.validationResult.emit(this.validate(this.template));
    }
  }

  validate(template: Template): ValidationResult {
    const warnings: string[] = [];
    const problematicIds: string[] = [];
    const { objects, page } = template;

    // Obsługa indywidualnych marginesów
    const marginTop = page.marginTop ?? page.margin ?? 0;
    const marginLeft = page.marginLeft ?? page.margin ?? 0;
    const marginBottom = page.marginBottom ?? page.margin ?? 0;
    const marginRight = page.marginRight ?? page.margin ?? 0;

    for (const obj of objects) {
      if (
        obj.x < marginLeft ||
        obj.y < marginTop ||
        obj.x + obj.width > page.width - marginRight ||
        obj.y + obj.height > page.height - marginBottom
      ) {
        warnings.push(`Obiekt ${obj.id} wychodzi poza marginesy`);
        problematicIds.push(obj.id);
      }
    }
    for (let i = 0; i < objects.length; i++) {
      for (let j = i + 1; j < objects.length; j++) {
        if (this.isOverlapping(objects[i], objects[j])) {
          warnings.push(`Obiekty ${objects[i].id} i ${objects[j].id} nachodzą na siebie`);
          problematicIds.push(objects[i].id, objects[j].id);
        }
      }
    }
    return { warnings, problematicIds: Array.from(new Set(problematicIds)) };
  }

  isOverlapping(a: TemplateObject, b: TemplateObject): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }
}