import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataSubjectRightComponent } from './data-subject-right.component';

describe('DataSubjectRightComponent', () => {
  let component: DataSubjectRightComponent;
  let fixture: ComponentFixture<DataSubjectRightComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataSubjectRightComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataSubjectRightComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
