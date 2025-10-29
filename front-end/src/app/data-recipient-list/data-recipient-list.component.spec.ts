import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DataRecipientListComponent } from './data-recipient-list.component';

describe('DataRecipientListComponent', () => {
  let component: DataRecipientListComponent;
  let fixture: ComponentFixture<DataRecipientListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DataRecipientListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DataRecipientListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
