export interface CreateApiDto {
  name: string;
  description: string;
  host: string;
  username: string;
  password: string;
  token: string;
  lastModifiedBy: string;
}

export interface UpdateApiDto {
  name?: string;
  description?: string;
  host?: string;
  username?: string;
  password?: string;
  token?: string;
  lastModifiedBy?: string;
}

export interface ApiIntegration {
  id: number;
  name: string;
  description: string;
  host: string;
  username: string;
  password: string;
  token: string;
  createdAt: Date;
  updatedAt: Date;
  lastModifiedBy: string;
  users: User[];
}

export interface User {
  id: number;
  username: string;
  email?: string;
  role: string;
}