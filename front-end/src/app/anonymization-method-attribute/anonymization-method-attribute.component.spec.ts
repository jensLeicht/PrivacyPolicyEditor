import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymizationMethodAttributeComponent } from './anonymization-method-attribute.component';

describe('AnonymizationMethodAttributeComponent', () => {
  let component: AnonymizationMethodAttributeComponent;
  let fixture: ComponentFixture<AnonymizationMethodAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonymizationMethodAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymizationMethodAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
