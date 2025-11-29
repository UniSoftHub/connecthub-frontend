import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, tap, catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { IApiResponse } from '../interfaces/api-response.interface';
import { NGXLogger } from 'ngx-logger';
import {
  IProjectCreateRequest,
  IProjectResponse,
  IProjectsResponse,
  IProjectUpdateRequest,
} from '../interfaces/project';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private readonly API_URL = `${environment.apiUrl}/projects`;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
  ) {}

  // Listar todos os projetos
  getProjects(page: number = 1, size: number = 10): Observable<IProjectsResponse> {
    this.logger.debug(`Fetching projects - Page: ${page}, Size: ${size}`);

    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<IApiResponse<IProjectsResponse>>(this.API_URL, { params }).pipe(
      tap((response) => {
        this.logger.info('✅ Projects API Response:', response);
        this.logger.info('📦 Projects Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Projects Data:', data);
        console.log('🔍 Projects in Console:', data);
      }),
      catchError((error) => {
        this.logger.error('❌ Error fetching projects:', error);
        throw error;
      }),
    );
  }

  // Buscar projeto por ID
  getProjectById(id: number): Observable<IProjectResponse> {
    this.logger.debug(`Fetching project by ID: ${id}`);

    return this.http.get<IApiResponse<IProjectResponse>>(`${this.API_URL}/${id}`).pipe(
      tap((response) => {
        this.logger.info(`✅ Project ${id} API Response:`, response);
        this.logger.info('📦 Project Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Project Data:', data);
        console.log(`🔍 Project ${id} in Console:`, data);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error fetching project ${id}:`, error);
        throw error;
      }),
    );
  }

  // Criar projeto
  createProject(project: Partial<IProjectCreateRequest>): Observable<IProjectResponse> {
    this.logger.debug('Creating new project', project);

    return this.http.post<IApiResponse<IProjectResponse>>(this.API_URL, project).pipe(
      tap((response) => {
        this.logger.info('✅ Create Project API Response:', response);
        this.logger.info('📦 Created Project Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Created Project:', data);
        console.log('🔍 Created Project in Console:', data);
      }),
      catchError((error) => {
        this.logger.error('❌ Error creating project:', error);
        throw error;
      }),
    );
  }

  // Atualizar projeto
  updateProject(id: number, project: Partial<IProjectUpdateRequest>): Observable<IProjectResponse> {
    this.logger.debug(`Updating project ID: ${id}`, project);

    return this.http.patch<IApiResponse<IProjectResponse>>(`${this.API_URL}/${id}`, project).pipe(
      tap((response) => {
        this.logger.info(`✅ Update Project ${id} API Response:`, response);
        this.logger.info('📦 Updated Project Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Updated Project:', data);
        console.log(`🔍 Updated Project ${id} in Console:`, data);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error updating project ${id}:`, error);
        throw error;
      }),
    );
  }

  // Desativar projeto
  deactivateProject(id: number): Observable<void> {
    this.logger.debug(`Deactivating project ID: ${id}`);

    return this.http.delete<IApiResponse<void>>(`${this.API_URL}/${id}`).pipe(
      tap((response) => {
        this.logger.info(`✅ Deactivate Project ${id} Response:`, response);
      }),
      map(() => undefined),
      tap(() => {
        this.logger.info(`🎯 Project ${id} deactivated successfully`);
        console.log(`🔍 Project ${id} deactivated`);
      }),
      catchError((error) => {
        this.logger.error(`❌ Error deactivating project ${id}:`, error);
        throw error;
      }),
    );
  }
}
