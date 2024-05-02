import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyUpdateComponent } from './party-update.component';

describe('PartyUpdateComponent', () => {
  let component: PartyUpdateComponent;
  let fixture: ComponentFixture<PartyUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyUpdateComponent]
    });
    fixture = TestBed.createComponent(PartyUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
