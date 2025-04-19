export interface User {
  id: number;
  username: string;
  name: string;
  division_id: number;
  role: 'admin' | 'validator' | 'user';
}