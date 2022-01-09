import { TestBed } from '@angular/core/testing';

import { VendorDetailsService } from './vendor-details.service';

describe('VendorDetailsService', () => {
  let service: VendorDetailsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VendorDetailsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
