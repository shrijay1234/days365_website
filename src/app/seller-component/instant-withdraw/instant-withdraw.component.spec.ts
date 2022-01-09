import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InstantWithdrawComponent } from './instant-withdraw.component';

describe('InstantWithdrawComponent', () => {
  let component: InstantWithdrawComponent;
  let fixture: ComponentFixture<InstantWithdrawComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InstantWithdrawComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstantWithdrawComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
