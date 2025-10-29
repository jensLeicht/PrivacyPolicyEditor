import { TestBed } from '@angular/core/testing';

import { StaticValidatorService } from './static-validator.service';

describe('DataValidatorService', () => {
  let service: StaticValidatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StaticValidatorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
