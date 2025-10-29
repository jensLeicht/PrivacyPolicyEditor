import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NameOfDataComponent } from './name-of-data.component';

describe('NameOfDataComponent', () => {
  let component: NameOfDataComponent;
  let fixture: ComponentFixture<NameOfDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NameOfDataComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NameOfDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
