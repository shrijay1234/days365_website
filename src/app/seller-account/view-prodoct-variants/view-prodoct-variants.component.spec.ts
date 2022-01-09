import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProdoctVariantsComponent } from './view-prodoct-variants.component';

describe('ViewProdoctVariantsComponent', () => {
  let component: ViewProdoctVariantsComponent;
  let fixture: ComponentFixture<ViewProdoctVariantsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewProdoctVariantsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewProdoctVariantsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
