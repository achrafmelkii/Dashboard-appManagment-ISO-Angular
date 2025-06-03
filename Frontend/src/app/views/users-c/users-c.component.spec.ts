import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersCComponent } from './users-c.component';

describe('UsersCComponent', () => {
  let component: UsersCComponent;
  let fixture: ComponentFixture<UsersCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UsersCComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(UsersCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
