import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GuestMonitoringComponent } from './guest-monitoring.component';

describe('GuestMonitoringComponent', () => {
  let component: GuestMonitoringComponent;
  let fixture: ComponentFixture<GuestMonitoringComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GuestMonitoringComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GuestMonitoringComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
