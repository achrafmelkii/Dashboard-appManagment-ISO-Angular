import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SymboleComponent } from './symbole.component';

describe('SymboleComponent', () => {
  let component: SymboleComponent;
  let fixture: ComponentFixture<SymboleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SymboleComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SymboleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
