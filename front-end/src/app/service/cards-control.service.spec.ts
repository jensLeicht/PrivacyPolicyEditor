import { TestBed } from '@angular/core/testing';

import { CardsControlService } from './cards-control.service';

describe('CardsControlService', () => {
  let service: CardsControlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CardsControlService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
