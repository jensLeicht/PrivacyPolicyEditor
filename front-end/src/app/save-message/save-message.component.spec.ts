import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveMessageComponent } from './save-message.component';

describe('SaveMessageComponent', () => {
  let component: SaveMessageComponent;
  let fixture: ComponentFixture<SaveMessageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveMessageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
