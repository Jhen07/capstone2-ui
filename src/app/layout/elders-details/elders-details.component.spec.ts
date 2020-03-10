import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldersDetailsComponent } from './elders-details.component';

describe('EldersDetailsComponent', () => {
  let component: EldersDetailsComponent;
  let fixture: ComponentFixture<EldersDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldersDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldersDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
