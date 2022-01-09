import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCateogryFormComponent } from './select-cateogry-form.component';

describe('SelectCateogryFormComponent', () => {
  let component: SelectCateogryFormComponent;
  let fixture: ComponentFixture<SelectCateogryFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCateogryFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCateogryFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
