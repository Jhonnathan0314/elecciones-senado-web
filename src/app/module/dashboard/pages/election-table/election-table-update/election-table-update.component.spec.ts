import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ElectionTableUpdateComponent } from './election-table-update.component';

describe('ElectionTableUpdateComponent', () => {
  let component: ElectionTableUpdateComponent;
  let fixture: ComponentFixture<ElectionTableUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ElectionTableUpdateComponent]
    });
    fixture = TestBed.createComponent(ElectionTableUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
