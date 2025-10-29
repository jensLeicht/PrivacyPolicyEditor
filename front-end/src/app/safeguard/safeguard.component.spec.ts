import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SafeguardComponent } from './safeguard.component';

describe('SafeguardComponent', () => {
  let component: SafeguardComponent;
  let fixture: ComponentFixture<SafeguardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SafeguardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SafeguardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
