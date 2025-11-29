import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, catchError, map, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { IApiResponse } from '../interfaces/api-response.interface';
import {
  IUserResponse,
  IUserCreateRequest,
  IUserUpdateRequest,
  UserRole,
  IUsersResponse,
} from '../interfaces/user';
import { NGXLogger } from 'ngx-logger';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly API_URL = `${environment.apiUrl}/users`;

  constructor(
    private http: HttpClient,
    private logger: NGXLogger,
  ) {}

  // Listar todos os usuários
  getUsers(page: number = 1, size: number = 10): Observable<IUsersResponse> {
    this.logger.debug(`Fetching users - Page: ${page}, Size: ${size}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http.get<IApiResponse<IUsersResponse>>(this.API_URL, { params }).pipe(
      tap((response) => {
        this.logger.info('✅ Users API Response:', response);
        this.logger.info('📦 Users Data:', response.data);
      }),
      map((response) => response.data),
      tap((data) => {
        this.logger.info('🎯 Final Users Data:', data);
        console.log('🔍 Users in Console:', data);
      }),
      catchError((error) => {
        this.logger.error('❌ Error fetching users:', error);
        throw error;
      }),
    );
  }

  // Listar todos os usuários ativos
  getActiveUsers(page: number = 1, size: number = 10): Observable<IUsersResponse> {
    this.logger.debug(`Fetching active users - Page: ${page}, Size: ${size}`);
    const params = new HttpParams().set('page', page.toString()).set('size', size.toString());

    return this.http
      .get<IApiResponse<IUsersResponse>>(`${this.API_URL}/active`, { params })
      .pipe(map((response) => response.data));
  }

  // Buscar usuário por ID
  getUserById(id: number): Observable<IUserResponse> {
    this.logger.debug(`Fetching user by ID: ${id}`);
    return this.http
      .get<IApiResponse<IUserResponse>>(`${this.API_URL}/${id}`)
      .pipe(map((response) => response.data));
  }

  // Criar usuário
  createUser(user: IUserCreateRequest): Observable<IUserResponse> {
    this.logger.debug('Creating new user', user);
    return this.http
      .post<IApiResponse<IUserResponse>>(this.API_URL, user)
      .pipe(map((response) => response.data));
  }

  // Atualizar usuário
  updateUser(id: number, user: IUserUpdateRequest): Observable<IUserResponse> {
    this.logger.debug(`Updating user ID: ${id}`, user);
    return this.http
      .patch<IApiResponse<IUserResponse>>(`${this.API_URL}/${id}`, user)
      .pipe(map((response) => response.data));
  }

  // Desativar usuário
  deactivateUser(id: number): Observable<void> {
    this.logger.debug(`Deactivating user ID: ${id}`);
    return this.http.delete<IApiResponse<void>>(`${this.API_URL}/${id}`).pipe(map(() => undefined));
  }

  // Desativar múltiplos usuários
  deactivateUsers(ids: number[]): Observable<void> {
    this.logger.debug(`Deactivating users with IDs: ${ids.join(', ')}`);
    return this.http
      .post<IApiResponse<void>>(`${this.API_URL}/deactivate-batch`, { ids })
      .pipe(map(() => undefined));
  }

  // Buscar por cargo
  getUsersByRole(role: UserRole, page: number = 1, size: number = 50): Observable<IUsersResponse> {
    this.logger.debug(`Fetching users by role: ${role} - Page: ${page}, Size: ${size}`);
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('role', role);

    return this.http
      .get<IApiResponse<IUsersResponse>>(`${this.API_URL}/by-role`, { params })
      .pipe(map((response) => response.data));
  }

  // Top usuários por XP
  getTopUsersByXp(limit: number = 10): Observable<IUserResponse[]> {
    this.logger.debug(`Fetching top ${limit} users by XP`);
    const params = new HttpParams().set('limit', limit.toString());

    return this.http
      .get<IApiResponse<IUserResponse[]>>(`${this.API_URL}/top-xp`, { params })
      .pipe(map((response) => response.data));
  }
}
