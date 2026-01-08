
import { Component } from '@angular/core';
import { Template, ValidationResult } from '../template.model';
import { FileLoaderComponent } from '../file-loader/file-loader.component';
import { TemplateValidatorComponent } from '../template-validator/template-validator.component';
import { TemplatePreviewComponent } from '../template-preview/template-preview.component';
import { TemplateWarningsComponent } from '../template-warnings/template-warnings.component';

import { PdfExportComponent } from '../pdf-export/pdf-export.component';

@Component({
  selector: 'app-template-container',
  standalone: true,
  imports: [
    FileLoaderComponent,
    TemplateValidatorComponent,
    TemplatePreviewComponent,
    TemplateWarningsComponent
    ,PdfExportComponent
  ],
  templateUrl: './template-container.component.html'
})
export class TemplateContainerComponent {
  template: Template | null = null;
  warnings: string[] = [];
  problematicIds: string[] = [];

  onFileLoaded(data: Template) {
    console.log('Loaded template:', data);
    this.template = data;
  }

  onValidationResult(result: ValidationResult) {
    this.warnings = result.warnings;
    this.problematicIds = result.problematicIds;
  }
}