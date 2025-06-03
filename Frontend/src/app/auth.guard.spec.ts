// import { TestBed } from '@angular/core/testing';
// import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
// import { AuthGuard } from './auth.guard';

// describe('AuthGuard', () => {
//   let guard: AuthGuard;

//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       providers: [AuthGuard]
//     });

//     guard = TestBed.inject(AuthGuard);
//   });

//   it('should be created', () => {
//     expect(guard).toBeTruthy();
//   });

//   it('should test canActivate method', (done) => {
//     const route = {} as ActivatedRouteSnapshot;
//     const state = {} as RouterStateSnapshot;
//     guard.canActivate(route, state).subscribe(isAuthenticated => {
//       expect(isAuthenticated).toBe(true); // or false, depending on your test setup
//       done();
//     });
//   });
// });
