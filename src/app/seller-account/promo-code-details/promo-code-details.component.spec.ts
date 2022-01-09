import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoCodeDetailsComponent } from './promo-code-details.component';

describe('PromoCodeDetailsComponent', () => {
  let component: PromoCodeDetailsComponent;
  let fixture: ComponentFixture<PromoCodeDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoCodeDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoCodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
