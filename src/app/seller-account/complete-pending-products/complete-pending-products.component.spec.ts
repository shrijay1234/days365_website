import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletePendingProductsComponent } from './complete-pending-products.component';

describe('CompletePendingProductsComponent', () => {
  let component: CompletePendingProductsComponent;
  let fixture: ComponentFixture<CompletePendingProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompletePendingProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompletePendingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
