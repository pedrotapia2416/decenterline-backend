export interface UserAccount {
  username: string;
  passwordHash: string;
  roles: string[];
  active: boolean;
  createdAt: string;
  updatedAt: string;
}
