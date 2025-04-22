import { TestBed } from '@angular/core/testing';

import { NavbarVisibleService } from './navbar-visible.service';

describe('NavbarVisibleService', () => {
  let service: NavbarVisibleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NavbarVisibleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
