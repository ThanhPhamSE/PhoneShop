import { TestBed } from '@angular/core/testing';

import { CallAddressApiService } from './call-address-api.service';

describe('CallAddressApiService', () => {
  let service: CallAddressApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CallAddressApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
