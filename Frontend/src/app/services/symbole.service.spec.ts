import { TestBed } from '@angular/core/testing';

import { SymboleService } from './symbole.service';

describe('SymboleService', () => {
  let service: SymboleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SymboleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
