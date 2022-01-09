import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDaysComponent } from './product-days.component';

describe('ProductDaysComponent', () => {
  let component: ProductDaysComponent;
  let fixture: ComponentFixture<ProductDaysComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDaysComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDaysComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
