import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListedBrandsComponent } from './listed-brands.component';

describe('ListedBrandsComponent', () => {
  let component: ListedBrandsComponent;
  let fixture: ComponentFixture<ListedBrandsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListedBrandsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListedBrandsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
