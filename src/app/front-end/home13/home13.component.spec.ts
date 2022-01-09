import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Home13Component } from './home13.component';

describe('Home13Component', () => {
  let component: Home13Component;
  let fixture: ComponentFixture<Home13Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Home13Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Home13Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
