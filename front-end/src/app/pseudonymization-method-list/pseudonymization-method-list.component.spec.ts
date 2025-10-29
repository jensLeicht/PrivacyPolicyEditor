import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PseudonymizationMethodListComponent } from './pseudonymization-method-list.component';

describe('PseudonymizationMethodListComponent', () => {
  let component: PseudonymizationMethodListComponent;
  let fixture: ComponentFixture<PseudonymizationMethodListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PseudonymizationMethodListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PseudonymizationMethodListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
