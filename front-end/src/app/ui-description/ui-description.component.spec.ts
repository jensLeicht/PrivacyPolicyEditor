import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UiDescriptionComponent } from './ui-description.component';

describe('UiDescriptionComponent', () => {
  let component: UiDescriptionComponent;
  let fixture: ComponentFixture<UiDescriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UiDescriptionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UiDescriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
