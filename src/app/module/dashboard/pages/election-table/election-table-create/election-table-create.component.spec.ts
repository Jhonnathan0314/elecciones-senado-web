import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionTableCreateComponent } from './election-table-create.component';

describe('ElectionTableCreateComponent', () => {
  let component: ElectionTableCreateComponent;
  let fixture: ComponentFixture<ElectionTableCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionTableCreateComponent]
    });
    fixture = TestBed.createComponent(ElectionTableCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
