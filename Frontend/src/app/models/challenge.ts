 
export class Challenge {
 
    DaysNum!: number;
     Title!: string;
    CarbPts!: number;
    Text!: string;
    ExpPts!: number;
  
  
}
export class ChallengeApiResponse {
 
  success?: boolean;
  challenges?: Challenge[];
  error?: string;
}

 
 