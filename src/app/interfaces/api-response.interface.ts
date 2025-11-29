export interface IApiResponse<T> {
  message: string;
  data: T;
}

export interface IPaginatedResponse<T> {
  pages: number;
  items: T[];
}
