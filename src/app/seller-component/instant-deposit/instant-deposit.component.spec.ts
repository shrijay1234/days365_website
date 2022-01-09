import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantDepositComponent } from './instant-deposit.component';

describe('InstantDepositComponent', () => {
  let component: InstantDepositComponent;
  let fixture: ComponentFixture<InstantDepositComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantDepositComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
