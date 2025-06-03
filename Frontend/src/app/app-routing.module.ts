import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LogoutComponent } from './views/logout/logout.component'
import { SymboleComponent } from './views/symbole/symbole.component'
import { DocUrlsComponent } from './views/doc-urls/doc-urls.component'
import { ImageUploadComponent } from './views/image-upload/image-upload.component'
import {ImageListComponent} from './views/image-list/image-list.component'
import {AdminComponent} from './views/admin/admin.component'
import {NotificationComponent} from './views/notification/notification.component'
import {QuizListComponent} from './views/quiz-list/quiz-list.component'
import{ChallengeComponent} from './views/challenge/challenge.component'
import { AuthGuard } from './auth.guard';
const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home'
    },
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule)
      },
      {
        path: 'theme',
        loadChildren: () =>
          import('./views/theme/theme.module').then((m) => m.ThemeModule)
      },
      {
        path: 'base',
        loadChildren: () =>
          import('./views/base/base.module').then((m) => m.BaseModule)
      },
      {
        path: 'buttons',
        loadChildren: () =>
          import('./views/buttons/buttons.module').then((m) => m.ButtonsModule)
      },
      {
        path: 'forms',
        loadChildren: () =>
          import('./views/forms/forms.module').then((m) => m.CoreUIFormsModule)
      },
      {
        path: 'charts',
        loadChildren: () =>
          import('./views/charts/charts.module').then((m) => m.ChartsModule)
      },
      {
        path: 'icons',
        loadChildren: () =>
          import('./views/icons/icons.module').then((m) => m.IconsModule)
      },
      {
        path: 'notifications',
        loadChildren: () =>
          import('./views/notifications/notifications.module').then((m) => m.NotificationsModule)
      },
      {
        path: 'widgets',
        loadChildren: () =>
          import('./views/widgets/widgets.module').then((m) => m.WidgetsModule)
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      {
        path: 'users',
        component: DashboardComponent,
        data: {
          title: 'Users'
        }
      },  
      {
        path: 'admins',
        component: AdminComponent,
        canActivate: [AuthGuard],
        data: {
          title: 'Admins'
        }
      },  
      {
        path: 'images',
        component: ImageListComponent,
        data: {
          title: 'Images'
        }
      },  
      {
        path: 'symboles',
        component: SymboleComponent,
        data: {
          title: 'symboles'
        }
      },      
      {
        path: 'urls',
        component: DocUrlsComponent,
        data: {
          title: 'urls'
        }
      },
      {
        path: 'sendNotifcation',
        component: NotificationComponent,
        data: {
          title: 'notification'
        }
      }, 
      {
        path: 'quiz',
        component: QuizListComponent,
        data: {
          title: 'Quiz'
        }
      },  
      {
        path: 'challenge',
        component: ChallengeComponent,
        data: {
          title: 'Challenge'
        }
      },     
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },

  {
    path: 'logout',
    component: LogoutComponent,
    data: {
      title: 'dash Page'
    }
  },  
  {
    path: 'upload',
    component: ImageUploadComponent,
    data: {
      title: 'dash Page'
    }
  },
  {path: '**', redirectTo: 'dashboard'}
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
