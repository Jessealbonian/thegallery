import { TestBed } from '@angular/core/testing';

import { DataService } from '../../services/data.service';

describe('DataserviceService', () => {
  let service: DataService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DataService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});