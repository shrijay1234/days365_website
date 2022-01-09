import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductNotOnDays365Component } from './add-product-not-on-days365.component';

describe('AddProductNotOnDays365Component', () => {
  let component: AddProductNotOnDays365Component;
  let fixture: ComponentFixture<AddProductNotOnDays365Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductNotOnDays365Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductNotOnDays365Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
