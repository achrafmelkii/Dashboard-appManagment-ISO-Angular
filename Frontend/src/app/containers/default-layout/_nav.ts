import { INavData } from '@coreui/angular';
import { AdminsIcon,UsersIcon,ChallengeIcon,ImagesIcon,NotificationIcon,QuizIcon,SymboleIcon,URLIcon} from '../../views/icons/icon/icon.component';
import { iconSubset } from 'src/app/icons/icon-subset';

export const navItems: INavData[] = [
 
  {
    name: 'Users',
    url: '/users',
    //icon: iconSubset.cibCcAmex,
    
    iconComponent:{ content: UsersIcon },
   // icon: '<img src="assets/img/brand/logo.svg" alt="Icon">'
   
  },
  {
    name: 'Admins',
    url: '/admins',
    iconComponent: { content: AdminsIcon  }
  },
  {
    name: 'Symboles',
    url: '/symboles',
    iconComponent: { content: SymboleIcon }
  },
  {
    name: 'Images',
    url: '/images',
    iconComponent: { content: ImagesIcon }
  },
  {
    name: 'Notification',
    url: '/sendNotifcation',
    iconComponent: { content: NotificationIcon }
  },
  {
    name: 'Url',
    url: '/urls',
    iconComponent: { content: URLIcon }
  },
  {
    name: 'Quiz',
    url: '/quiz',
    iconComponent: { content: QuizIcon }
  },
  {
    name: 'Challenge',
    url: '/challenge',
    iconComponent: { content: ChallengeIcon }
   
  },
  // {
  //   name: 'Icons',
  //   iconComponent: { name: 'cil-star' },
  //   url: '/icons',
  //   children: [
  //     {
  //       name: 'CoreUI Free',
  //       url: '/icons/coreui-icons',
  //       badge: {
  //         color: 'success',
  //         text: 'FREE'
  //       }
  //     },
  //     {
  //       name: 'CoreUI Flags',
  //       url: '/icons/flags'
  //     },
  //     {
  //       name: 'CoreUI Brands',
  //       url: '/icons/brands'
  //     }
  //   ]
  // },
  // {
  //   name: 'Notifications',
  //   url: '/notifications',
  //   iconComponent: { name: 'cil-bell' },
  //   children: [
  //     {
  //       name: 'Alerts',
  //       url: '/notifications/alerts'
  //     },
  //     {
  //       name: 'Badges',
  //       url: '/notifications/badges'
  //     },
  //     {
  //       name: 'Modal',
  //       url: '/notifications/modal'
  //     },
  //     {
  //       name: 'Toast',
  //       url: '/notifications/toasts'
  //     }
  //   ]
  // },
  // {
  //   name: 'Widgets',
  //   url: '/widgets',
  //   iconComponent: { name: 'cil-calculator' },
  //   badge: {
  //     color: 'info',
  //     text: 'NEW'
  //   }
  // },
  // {
  //   title: true,
  //   name: 'Extras'
  // },
  // {
  //   name: 'Pages',
  //   url: '/login',
  //   iconComponent: { name: 'cil-star' },
  //   children: [
  //     {
  //       name: 'Login',
  //       url: '/login'
  //     },
  //     {
  //       name: 'Register',
  //       url: '/register'
  //     },
  //     {
  //       name: 'Error 404',
  //       url: '/404'
  //     },
  //     {
  //       name: 'Error 500',
  //       url: '/500'
  //     }
  //   ]
  // },
  // {
  //   title: true,
  //   name: 'Links',
  //   class: 'py-0'
  // },
  // {
  //   name: 'Docs',
  //   url: 'https://coreui.io/angular/docs/templates/installation',
  //   iconComponent: { name: 'cil-description' },
  //   attributes: { target: '_blank', class: '-text-dark' },
  //   class: 'mt-auto'
  // },
  // {
  //   name: 'Try CoreUI PRO',
  //   url: 'https://coreui.io/product/angular-dashboard-template/',
  //   iconComponent: { name: 'cil-layers' },
  //   attributes: { target: '_blank' }
  // }
];
