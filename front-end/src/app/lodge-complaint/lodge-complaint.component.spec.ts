import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LodgeComplaintComponent } from './lodge-complaint.component';

describe('LodgeComplaintComponent', () => {
  let component: LodgeComplaintComponent;
  let fixture: ComponentFixture<LodgeComplaintComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LodgeComplaintComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LodgeComplaintComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
