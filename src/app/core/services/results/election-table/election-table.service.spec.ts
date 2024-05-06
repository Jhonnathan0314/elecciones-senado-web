import { TestBed } from '@angular/core/testing';

import { ElectionTableService } from './election-table.service';

describe('ElectionTableService', () => {
  let service: ElectionTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ElectionTableService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
