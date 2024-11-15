export interface ApiKey {
  key: string;
  balance: number;
  createdAt: string;
}

export interface UserData {
  email: string;
  apiKeys: ApiKey[];
  isAdmin: boolean;
  createdAt: string;
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  url: string;
  createdAt: string;
  updatedAt: string;
}
