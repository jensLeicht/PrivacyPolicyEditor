import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurposeHierarchyComponent } from './purpose-hierarchy.component';

describe('PurposeHierarchyComponent', () => {
  let component: PurposeHierarchyComponent;
  let fixture: ComponentFixture<PurposeHierarchyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurposeHierarchyComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PurposeHierarchyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
