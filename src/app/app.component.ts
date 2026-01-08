
import { Component } from '@angular/core';
import { TemplateContainerComponent } from './template-container/template-container.component';

@Component({
  selector: 'app-root',
  imports: [TemplateContainerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'mhcStudio';
}
