import { TestBed } from '@angular/core/testing';

import { ManageOrderService } from './manage-order.service';

describe('ManageOrderService', () => {
  let service: ManageOrderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ManageOrderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
