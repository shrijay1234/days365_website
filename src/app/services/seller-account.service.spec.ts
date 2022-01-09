import { TestBed } from '@angular/core/testing';

import { SellerAccountService } from './seller-account.service';

describe('SellerAccountService', () => {
  let service: SellerAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SellerAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
