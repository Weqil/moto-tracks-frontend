import { TestBed } from '@angular/core/testing';

import { InputErrorService } from './input-error.service';

describe('InputErrorService', () => {
  let service: InputErrorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InputErrorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
