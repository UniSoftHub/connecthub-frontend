import { Routes } from '@angular/router';
import { Layout } from './components/core/layout/layout';
import { Home } from './pages/home/home';
import { Discussions } from './pages/discussions/discussions';
import { NewDiscussion } from './pages/new-discussion/new-discussion';
import { Users } from './pages/users/users';
import { Auth } from './pages/auth/auth';
import { authGuard } from './guards/auth.guard';
import { loginAuthGuard } from './guards/login-auth-guard';
import { Projects } from './pages/projects/projects';
import { ProjectDetail } from './pages/project-detail/project-detail';

export const routes: Routes = [
  {
    path: 'auth',
    component: Auth,
    canActivate: [loginAuthGuard],
  },
  {
    path: '',
    component: Layout,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
      },
      {
        path: 'home',
        component: Home,
      },
      {
        path: 'discussoes',
        component: Discussions,
      },
      {
        path: 'discussoes/nova',
        component: NewDiscussion,
      },
      {
        path: 'usuarios',
        component: Users,
      },
      {
        path: 'projetos',
        component: Projects,
      },
      {
        path: 'projetos/:id',
        component: ProjectDetail,
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'home',
  },
];
