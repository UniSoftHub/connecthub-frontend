import { IUserResponse } from './user';

export interface IProjectsResponse {
  pages: number;
  projects: IProjectResponse[];
}

export interface IProjectResponse {
  id: number;
  name: string;
  description: string;
  repositoryUrl: string;
  imageUrl: string;
  technologies: string[];
  countViews: number;
  createdAt: string;
  author: IUserResponse;
}

export interface IProjectRequest {
  name: string;
  description: string;
  repositoryUrl: string;
  imageUrl: string;
  technologies: string[];
  authorId: number;
}

export interface IProjectCreateRequest {
  name: string;
  description: string;
  repositoryUrl: string;
  imageUrl?: string;
  technologies: string[];
  authorId: number;
}

export interface IProjectUpdateRequest {
  name?: string;
  description?: string;
  repositoryUrl?: string;
  imageUrl?: string;
  technologies?: string[];
}
