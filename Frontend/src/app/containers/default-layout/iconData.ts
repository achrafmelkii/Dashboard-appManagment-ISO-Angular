interface IIconData {
    name?: string;
    icon: string ;
    url:string;
}

export const iconData: IIconData[] = [
 
    {
      name: 'Users',
      url: '/users',
      icon: 'assets/img/icons/admins.svg'
    },
    {
      name: 'Admins',
      url: '/admins',
      icon: '  <img src="assets/img/brand/coreui-signet-white.svg" alt="Icon">'
    }
]