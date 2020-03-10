import { TestBed } from '@angular/core/testing';

import { AccomplishmentsService } from './accomplishments.service';

describe('AccomplishmentsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccomplishmentsService = TestBed.get(AccomplishmentsService);
    expect(service).toBeTruthy();
  });
});
