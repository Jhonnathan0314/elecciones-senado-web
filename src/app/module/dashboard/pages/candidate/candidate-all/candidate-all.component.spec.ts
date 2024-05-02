import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CandidateAllComponent } from './candidate-all.component';

describe('CandidateAllComponent', () => {
  let component: CandidateAllComponent;
  let fixture: ComponentFixture<CandidateAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CandidateAllComponent]
    });
    fixture = TestBed.createComponent(CandidateAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
