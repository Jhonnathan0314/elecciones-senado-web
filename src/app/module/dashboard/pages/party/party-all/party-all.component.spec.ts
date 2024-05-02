import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyAllComponent } from './party-all.component';

describe('PartyAllComponent', () => {
  let component: PartyAllComponent;
  let fixture: ComponentFixture<PartyAllComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyAllComponent]
    });
    fixture = TestBed.createComponent(PartyAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
