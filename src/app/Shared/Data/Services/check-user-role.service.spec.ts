import { TestBed } from '@angular/core/testing';

import { CheckUserRoleService } from './check-user-role.service';

describe('CheckUserRoleService', () => {
  let service: CheckUserRoleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CheckUserRoleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
