import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrivacyModelListComponent } from './privacy-model-list.component';

describe('PrivacyModelListComponent', () => {
  let component: PrivacyModelListComponent;
  let fixture: ComponentFixture<PrivacyModelListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PrivacyModelListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PrivacyModelListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
