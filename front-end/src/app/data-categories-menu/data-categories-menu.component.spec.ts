import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataCategoriesMenuComponent } from './data-categories-menu.component';

describe('DataCategoriesMenuComponent', () => {
  let component: DataCategoriesMenuComponent;
  let fixture: ComponentFixture<DataCategoriesMenuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataCategoriesMenuComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataCategoriesMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
