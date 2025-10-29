import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HierarchyEntityComponent } from './hierarchy-entity.component';

describe('HierarchyEntityComponent', () => {
  let component: HierarchyEntityComponent;
  let fixture: ComponentFixture<HierarchyEntityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ HierarchyEntityComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HierarchyEntityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
