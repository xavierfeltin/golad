import { TestBed, inject } from '@angular/core/testing';

import { IAService } from './ia.service';

describe('IaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IAService]
    });
  });

  it('should be created', inject([IAService], (service: IAService) => {
    expect(service).toBeTruthy();
  }));
});
