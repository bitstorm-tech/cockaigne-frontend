export interface Deal {
  id: number;
  account_id: number;
  title: string;
  description: string;
  category: string;
  duration: string;
  start: string;
  template: boolean;
  likes?: number;
}
