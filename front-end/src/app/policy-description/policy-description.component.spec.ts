import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PolicyDescriptionComponent } from './policy-description.component';

describe('PolicyDescriptionComponent', () => {
  let component: PolicyDescriptionComponent;
  let fixture: ComponentFixture<PolicyDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PolicyDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PolicyDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
