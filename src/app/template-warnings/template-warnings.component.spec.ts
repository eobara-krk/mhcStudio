import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateWarningsComponent } from './template-warnings.component';

describe('TemplateWarningsComponent', () => {
  let component: TemplateWarningsComponent;
  let fixture: ComponentFixture<TemplateWarningsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TemplateWarningsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateWarningsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
