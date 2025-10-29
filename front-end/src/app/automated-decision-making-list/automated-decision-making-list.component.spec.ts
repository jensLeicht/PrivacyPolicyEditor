import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AutomatedDecisionMakingListComponent } from './automated-decision-making-list.component';

describe('AutomatedDecisionMakingListComponent', () => {
  let component: AutomatedDecisionMakingListComponent;
  let fixture: ComponentFixture<AutomatedDecisionMakingListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AutomatedDecisionMakingListComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AutomatedDecisionMakingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
