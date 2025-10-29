import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataProtectionOfficerComponent } from './data-protection-officer.component';

describe('DataProtectionOfficerComponent', () => {
  let component: DataProtectionOfficerComponent;
  let fixture: ComponentFixture<DataProtectionOfficerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataProtectionOfficerComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataProtectionOfficerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
