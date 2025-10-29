import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyModelAttributeComponent } from './privacy-model-attribute.component';

describe('PrivacyModelAttributeComponent', () => {
  let component: PrivacyModelAttributeComponent;
  let fixture: ComponentFixture<PrivacyModelAttributeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyModelAttributeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyModelAttributeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
