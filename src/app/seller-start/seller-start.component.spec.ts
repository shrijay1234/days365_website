import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerStartComponent } from './seller-start.component';

describe('SellerStartComponent', () => {
  let component: SellerStartComponent;
  let fixture: ComponentFixture<SellerStartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerStartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
