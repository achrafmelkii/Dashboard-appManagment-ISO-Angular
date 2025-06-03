import { Component,OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { navItems } from './_nav';
import { iconData } from './iconData';

import { AuthService } from '../../services/auth.service';
import firebase from 'firebase/compat/app';
@Component({
  selector: 'app-dashboard',
  templateUrl: './default-layout.component.html',
  styleUrls: ['./default-layout.component.scss'],
})
export class DefaultLayoutComponent implements OnInit{

  public navItems = navItems;
  public iconData = iconData;
  isSuperAdmin:boolean = false;
  constructor(private authService:AuthService,private router: Router) {}
  ngOnInit(): void {
    this.authService.getCurrentUser().subscribe((user: firebase.User | null) => {
      if(!user) {return;}
      const uid = user.uid ;
      this.authService.checkSuperAdmin(uid).then(isSuperAdmin => {
        console.log('Is super admin:', isSuperAdmin);
        this.isSuperAdmin = isSuperAdmin;
        if(!isSuperAdmin)
        {
          this.navItems = navItems.filter(x => x.name !== 'Admins');
        }
        // Here you can do something with the isSuperAdmin value
      });
    });
  }
}
