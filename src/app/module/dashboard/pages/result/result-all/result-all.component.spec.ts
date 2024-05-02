import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResultAllComponent } from './result-all.component';

describe('ResultAllComponent', () => {
  let component: ResultAllComponent;
  let fixture: ComponentFixture<ResultAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ResultAllComponent]
    });
    fixture = TestBed.createComponent(ResultAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
