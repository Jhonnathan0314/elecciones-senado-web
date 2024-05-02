import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionTableAllComponent } from './election-table-all.component';

describe('ElectionTableAllComponent', () => {
  let component: ElectionTableAllComponent;
  let fixture: ComponentFixture<ElectionTableAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionTableAllComponent]
    });
    fixture = TestBed.createComponent(ElectionTableAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
