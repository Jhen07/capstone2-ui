import { TestBed } from '@angular/core/testing';

import { EldersService } from './elders.service';

describe('EldersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EldersService = TestBed.get(EldersService);
    expect(service).toBeTruthy();
  });
});
