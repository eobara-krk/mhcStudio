
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-template-warnings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './template-warnings.component.html'
})
export class TemplateWarningsComponent {
  @Input() warnings: string[] = [];
}
