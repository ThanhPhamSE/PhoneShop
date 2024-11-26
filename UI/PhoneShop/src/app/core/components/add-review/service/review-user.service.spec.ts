import { TestBed } from '@angular/core/testing';

import { ReviewUserService } from './review-user.service';

describe('ReviewUserService', () => {
  let service: ReviewUserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewUserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
