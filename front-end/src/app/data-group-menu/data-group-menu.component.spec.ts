import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataGroupMenuComponent } from './data-group-menu.component';

describe('DataGroupMenuComponent', () => {
  let component: DataGroupMenuComponent;
  let fixture: ComponentFixture<DataGroupMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataGroupMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataGroupMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
