import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { ILoginRequest, IAuthResponse, IJwtPayload } from '../interfaces/auth';
import { IUserCreateRequest, IUserResponse } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly API_URL = `${environment.apiUrl}/auth`;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';
  private readonly USER_KEY = 'auth_user';

  private currentUserSubject = new BehaviorSubject<IUserResponse | null>(this.getUserFromStorage());
  public currentUser$ = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(credentials: ILoginRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.API_URL}/login`, credentials).pipe(
      map((response) => {
        this.saveAuthData(response);
        return response;
      }),
    );
  }

  register(data: IUserCreateRequest): Observable<IAuthResponse> {
    return this.http.post<IAuthResponse>(`${this.API_URL}/register`, data).pipe(
      map((response) => {
        this.saveAuthData(response);
        return response;
      }),
    );
  }

  refreshToken(): Observable<IAuthResponse> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    return this.http.post<IAuthResponse>(`${this.API_URL}/refresh`, { refreshToken }).pipe(
      map((response) => {
        this.saveAuthData(response);
        return response;
      }),
    );
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
    this.currentUserSubject.next(null);
    this.router.navigate(['/auth']);
  }

  private saveAuthData(response: IAuthResponse): void {
    localStorage.setItem(this.TOKEN_KEY, response.token);
    localStorage.setItem(this.REFRESH_TOKEN_KEY, response.refreshToken);
    localStorage.setItem(this.USER_KEY, JSON.stringify(response.user));
    this.currentUserSubject.next(response.user);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY) || '';
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY) || '';
  }

  getCurrentUser(): IUserResponse | null {
    return this.currentUserSubject.value;
  }

  getCurrentUserId(): number {
    const user = this.getCurrentUser();
    if (!user) {
      throw new Error('Nenhum usuário autenticado');
    }
    return user.id;
  }

  getCurrentUserIdOrNull(): number | null {
    const user = this.getCurrentUser();
    return user?.id || null;
  }

  getCurrentUserName(): string {
    const user = this.getCurrentUser();
    return user?.name || 'Usuário';
  }

  getCurrentUserAvatar(): string {
    const user = this.getCurrentUser();
    return user?.avatarUrl || '';
  }

  getCurrentUserEmail(): string {
    const user = this.getCurrentUser();
    return user?.email || '';
  }

  clearToken(): void {
    localStorage.removeItem('token');
  }

  private getUserFromStorage(): IUserResponse | null {
    const userJson = localStorage.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson) : null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  requireAuth(): void {
    if (!this.isAuthenticated()) {
      this.router.navigate(['/auth']);
      throw new Error('Autenticação necessária');
    }
  }

  decodeToken(token: string): IJwtPayload | null {
    try {
      const base64Url = token.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join(''),
      );
      return JSON.parse(jsonPayload);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  isTokenExpired(token: string): boolean {
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return true;
    const expirationDate = new Date(decoded.exp * 1000);
    return expirationDate < new Date();
  }

  shouldRefreshToken(): boolean {
    const token = this.getToken();
    if (!token) return false;
    const decoded = this.decodeToken(token);
    if (!decoded || !decoded.exp) return false;
    const expirationDate = new Date(decoded.exp * 1000);
    const fiveMinutesFromNow = new Date(Date.now() + 5 * 60 * 1000);
    return expirationDate < fiveMinutesFromNow;
  }
}
