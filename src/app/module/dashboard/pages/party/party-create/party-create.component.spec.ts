import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PartyCreateComponent } from './party-create.component';

describe('PartyCreateComponent', () => {
  let component: PartyCreateComponent;
  let fixture: ComponentFixture<PartyCreateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PartyCreateComponent]
    });
    fixture = TestBed.createComponent(PartyCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
