import { TestBed } from '@angular/core/testing';

import { DocUrlsService } from './doc-urls.service';

describe('DocUrlsService', () => {
  let service: DocUrlsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DocUrlsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
