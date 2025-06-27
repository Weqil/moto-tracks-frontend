import { TestBed } from '@angular/core/testing';

import { InAppNotificationService } from './in-app-notification.service';

describe('InAppNotificationService', () => {
  let service: InAppNotificationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InAppNotificationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
