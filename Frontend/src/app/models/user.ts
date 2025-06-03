export interface UserApiResponse {
    success: boolean;
    users?: User[];
    error?: string;
    user?: User;
  }
  
  export interface User {
    Level: number;
    ID: string;
    Name: string;
    Score: number;
    Index: number;
    CarbPts: number;
    List: Record<string, Challenge>;
    ExpPts: number;
    email?:string;
    source?:string;
  }
  
  export interface Challenge {
    DaysNum: number;
    Completed: boolean;
    Title: string;
    CarbPts: number;
    Text: string;
    ExpPts: number;
  }

  export interface AdminApiResponse {
    success: boolean;
    admins?: Admin[];
    error?: string;
  }
  
  export interface AdminUserApiResponse {
    success: boolean;
    users?: any[];
    error?: string;
  }
  export interface HistoryApiResponse {
    success: boolean;
    history?: Historique[];
    error?: string;
  }

  export interface Historique {
    admin : string;
    action:string;
    data:string;
    endaction:string;
    date : Date;
  }
  export interface Admin {
    email:string;
    isSuperAdmin:boolean;
    ID:string;
    name?:string;
  }
  