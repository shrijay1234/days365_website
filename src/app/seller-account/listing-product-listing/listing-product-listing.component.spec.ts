import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListingProductListingComponent } from './listing-product-listing.component';

describe('ListingProductListingComponent', () => {
  let component: ListingProductListingComponent;
  let fixture: ComponentFixture<ListingProductListingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListingProductListingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListingProductListingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  


  it('should create the app', () => {
    const fixture = TestBed.createComponent(ListingProductListingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'angular-reactive-forms'`, () => {
    const fixture = TestBed.createComponent(ListingProductListingComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('angular-reactive-forms');
  });

  it('should render title in a h1 tag', () => {
    const fixture = TestBed.createComponent(ListingProductListingComponent);
    fixture.detectChanges();
    const compiled = fixture.debugElement.nativeElement;
    expect(compiled.querySelector('h1').textContent).toContain('Welcome to angular-reactive-forms!');
  })})
