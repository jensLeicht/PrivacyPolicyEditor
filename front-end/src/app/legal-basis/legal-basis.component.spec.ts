import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LegalBasisComponent } from './legal-basis.component';

describe('LegalBasisComponent', () => {
  let component: LegalBasisComponent;
  let fixture: ComponentFixture<LegalBasisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LegalBasisComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LegalBasisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
