import { IUserResponse } from './user';

export interface IProjectCommentsResponse {
  pages: number;
  comments: IProjectCommentResponse[];
}

export interface IProjectCommentResponse {
  id: number;
  text: string;
  author: IUserResponse;
  createdAt: string;
  projectId: number;
}

export interface IProjectCommentCreateRequest {
  text: string;
  authorId: number;
  projectId: number;
}

export interface IProjectCommentUpdateRequest {
  text: string;
}
