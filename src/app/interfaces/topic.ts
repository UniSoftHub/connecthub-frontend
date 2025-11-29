import { ICourseResponse } from './course';
import { IUsersResponse } from './user';

export interface ITopicResponse {
  id: number;
  title: string;
  course: ICourseResponse;
  author: IUsersResponse;
  status: 'NOT_ANSWERED' | 'NOT_SOLVED' | 'SOLVED' | 'CLOSED';
  countViews: number;
  isActive: boolean;
}

export class INewTopicResponse {}

export interface INewTopicRequest {
  title: string;
  description: string;
  courseId: number;
  authorId: number;
}
