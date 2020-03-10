import { TestBed } from '@angular/core/testing';

import { MedicineInventoryService } from './medicine-inventory.service';

describe('MedicineInventoryService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MedicineInventoryService = TestBed.get(MedicineInventoryService);
    expect(service).toBeTruthy();
  });
});
