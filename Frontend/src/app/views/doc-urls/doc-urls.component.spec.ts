import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUrlsComponent } from './doc-urls.component';

describe('DocUrlsComponent', () => {
  let component: DocUrlsComponent;
  let fixture: ComponentFixture<DocUrlsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DocUrlsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DocUrlsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
