import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WarnMessageComponent } from './warn-message.component';

describe('WarnMessageComponent', () => {
  let component: WarnMessageComponent;
  let fixture: ComponentFixture<WarnMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WarnMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarnMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
