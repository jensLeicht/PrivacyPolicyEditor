import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectedDataRecipientComponent } from './selected-data-recipient.component';

describe('SelectedDataRecipientComponent', () => {
  let component: SelectedDataRecipientComponent;
  let fixture: ComponentFixture<SelectedDataRecipientComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SelectedDataRecipientComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectedDataRecipientComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
