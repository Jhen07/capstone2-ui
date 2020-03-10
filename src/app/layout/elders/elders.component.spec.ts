import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldersComponent } from './elders.component';

describe('EldersComponent', () => {
  let component: EldersComponent;
  let fixture: ComponentFixture<EldersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
