import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrologResponseComponent } from './prolog-response.component';

describe('PrologResponseComponent', () => {
  let component: PrologResponseComponent;
  let fixture: ComponentFixture<PrologResponseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrologResponseComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrologResponseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
