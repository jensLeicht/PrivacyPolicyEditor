import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PseudonymizationMethodAttributeComponent } from './pseudonymization-method-attribute.component';

describe('PseudonymizationMethodAttributeComponent', () => {
  let component: PseudonymizationMethodAttributeComponent;
  let fixture: ComponentFixture<PseudonymizationMethodAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PseudonymizationMethodAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PseudonymizationMethodAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
