import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EldersAddPageComponent } from './elders-add-page.component';

describe('EldersAddPageComponent', () => {
  let component: EldersAddPageComponent;
  let fixture: ComponentFixture<EldersAddPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EldersAddPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EldersAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
