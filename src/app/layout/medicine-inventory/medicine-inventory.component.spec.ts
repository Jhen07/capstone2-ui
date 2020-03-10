import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicineInventoryComponent } from './medicine-inventory.component';

describe('MedicineInventoryComponent', () => {
  let component: MedicineInventoryComponent;
  let fixture: ComponentFixture<MedicineInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MedicineInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MedicineInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
