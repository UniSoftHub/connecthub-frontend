import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { IApiResponse } from '../interfaces/api-response.interface';
import { NGXLogger } from 'ngx-logger';
import {
  IProjectCommentCreateRequest,
  IProjectCommentResponse,
  IProjectCommentsResponse,
  IProjectCommentUpdateRequest,
} from '../interfaces/project-comment';

@Injectable({
  providedIn: 'root',
})
export class ProjectCommentService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
  ) {}

  // Listar todos os comentários de um projeto específico
  getProjectComments(
    projectId: number,
    page: number = 1,
    size: number = 10,
  ): Observable<IProjectCommentsResponse> {
    this.logger.debug(`Fetching project ${projectId} comments - Page: ${page}, Size: ${size}`);

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    const url = `${this.API_URL}/${projectId}/comments`;

    return this.http.get<IApiResponse<IProjectCommentsResponse>>(url, { params }).pipe(
      tap((response) => {
        this.logger.info('✅ Project Comments API Response:', response);
        this.logger.info('📦 Project Comments Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Project Comments Data:', data);
        console.log('🔍 Project comments in Console:', data);
      }),
      catchError((error) => {
        this.logger.error('❌ Error fetching project comments:', error);
        throw error;
      }),
    );
  }

  // Buscar comentário específico por ID
  getCommentById(projectId: number, commentId: number): Observable<IProjectCommentResponse> {
    this.logger.debug(`Fetching comment ${commentId} from project ${projectId}`);

    const url = `${this.API_URL}/${projectId}/comments/${commentId}`;

    return this.http.get<IApiResponse<IProjectCommentResponse>>(url).pipe(
      tap((response) => {
        this.logger.info(`✅ Comment ${commentId} API Response:`, response);
        this.logger.info('📦 Comment Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Comment Data:', data);
        console.log(`🔍 Comment ${commentId} in Console:`, data);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error fetching comment ${commentId}:`, error);
        throw error;
      }),
    );
  }

  // Criar comentário em um projeto
  createComment(
    projectId: number,
    comment: Partial<IProjectCommentCreateRequest>,
  ): Observable<IProjectCommentResponse> {
    this.logger.debug(`Creating new comment in project ${projectId}`, comment);

    const url = `${this.API_URL}/${projectId}/comments`;

    return this.http.post<IApiResponse<IProjectCommentResponse>>(url, comment).pipe(
      tap((response) => {
        this.logger.info('✅ Create Comment API Response:', response);
        this.logger.info('📦 Created Comment Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Created Comment:', data);
        console.log('🔍 Created Comment in Console:', data);
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating comment:', error);
        throw error;
      }),
    );
  }

  // Atualizar comentário
  updateComment(
    commentId: number,
    comment: Partial<IProjectCommentUpdateRequest>,
  ): Observable<IProjectCommentResponse> {
    this.logger.debug(`Updating comment ${commentId}`, comment);

    const url = `${environment.apiUrl}/comments/${commentId}`;

    return this.http.patch<IApiResponse<IProjectCommentResponse>>(url, comment).pipe(
      tap((response) => {
        this.logger.info(`✅ Update Comment ${commentId} API Response:`, response);
        this.logger.info('📦 Updated Comment Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Updated Comment:', data);
        console.log(`🔍 Updated Comment ${commentId} in Console:`, data);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error updating comment ${commentId}:`, error);
        throw error;
      }),
    );
  }

  // Deletar/Desativar comentário
  deleteComment(commentId: number): Observable<void> {
    this.logger.debug(`Deleting comment ${commentId}`);

    const url = `${environment.apiUrl}/comments/${commentId}`;

    return this.http.delete<IApiResponse<void>>(url).pipe(
      tap((response) => {
        this.logger.info(`✅ Delete Comment ${commentId} Response:`, response);
      }),
      map(() => undefined),
      tap(() => {
        this.logger.info(`🎯 Comment ${commentId} deleted successfully`);
        console.log(`🔍 Comment ${commentId} deleted`);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error deleting comment ${commentId}:`, error);
        throw error;
      }),
    );
  }
}
