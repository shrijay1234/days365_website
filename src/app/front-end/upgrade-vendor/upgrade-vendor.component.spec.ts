import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpgradeVendorComponent } from './upgrade-vendor.component';

describe('UpgradeVendorComponent', () => {
  let component: UpgradeVendorComponent;
  let fixture: ComponentFixture<UpgradeVendorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpgradeVendorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpgradeVendorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
