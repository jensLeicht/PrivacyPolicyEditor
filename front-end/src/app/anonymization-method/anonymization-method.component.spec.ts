import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnonymizationMethodComponent } from './anonymization-method.component';

describe('AnonymizationMethodComponent', () => {
  let component: AnonymizationMethodComponent;
  let fixture: ComponentFixture<AnonymizationMethodComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AnonymizationMethodComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AnonymizationMethodComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
