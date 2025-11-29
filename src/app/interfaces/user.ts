export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'COORDINATOR';

export interface IUserBadge {
  id: number;
  badgeId: number;
  badgeName: string;
  earnedAt: string;
}

export interface IUsersResponse {
  pages: number;
  users: IUserResponse[];
}

export interface IUserResponse {
  id: number;
  name: string;
  email: string;
  CPF?: string;
  phone?: string;
  enrollmentId?: number;
  github?: string;
  linkedin?: string;
  avatarUrl?: string;
  role: UserRole;
  isActive: boolean;
  xp: number;
  level: number;
  createdAt: string;
}

export interface IUserCreateRequest {
  name: string;
  email: string;
  password: string;
  CPF?: string;
  phone?: string;
  enrollmentId?: number;
  github?: string;
  linkedin?: string;
  role: UserRole;
  isActive: boolean;
}

export interface IUserUpdateRequest {
  name?: string;
  CPF?: string;
  phone?: string;
  enrollmentId?: number;
  github?: string;
  linkedin?: string;
  role?: UserRole;
  isActive?: boolean;
}

export interface IUserFormData {
  name: string;
  CPF: string;
  phone: string;
  enrollmentId: number;
  lastUpdate: string;
  github: string;
  linkedin: string;
  role: UserRole;
  isActive: boolean;
}
