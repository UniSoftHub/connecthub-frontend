import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import { Subject, takeUntil } from 'rxjs';
import { IProjectResponse } from '../../interfaces/project';
import {
  IProjectCommentCreateRequest,
  IProjectCommentResponse,
} from '../../interfaces/project-comment';
import { IUserResponse } from '../../interfaces/user';
import { ProjectService } from '../../services/projects-service';
import { ProjectCommentService } from '../../services/project-comment-service';
import { AuthService } from '../../services/auth-service';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import { Textarea } from '../../components/features/textarea/textarea';
import { CommentCard } from '../../components/features/comment-card/comment-card';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.html',
  styleUrls: ['./project-detail.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    DatePipe,
    DecimalPipe,
    PrimaryButton,
    Textarea,
    CommentCard,
  ],
})
export class ProjectDetail implements OnInit, OnDestroy {
  project: IProjectResponse | null = null;
  comments: IProjectCommentResponse[] = [];
  commentForm!: FormGroup;
  isCommentExpanded = false;
  currentUser: IUserResponse | null = null;
  currentUserId: number | null = null;
  isLoading = false;
  hasError = false;
  projectId: number = 0;
  isSubmittingComment = false;

  private destroy$ = new Subject<void>();

  authorImageError = false;
  currentUserImageError = false;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private projectCommentService: ProjectCommentService,
    private authService: AuthService,
    private logger: NGXLogger,
  ) {}

  ngOnInit(): void {
    if (!this.authService.isAuthenticated()) {
      this.router.navigate(['/auth']);
      return;
    }

    this.currentUser = this.authService.getCurrentUser();
    this.currentUserId = this.authService.getCurrentUserIdOrNull();

    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.currentUserId = user?.id || null;
        this.logger.info('Usuário logado:', user);
      },
      error: (error) => {
        this.logger.error('Erro ao obter usuário:', error);
        this.router.navigate(['/auth']);
      },
    });

    this.initializeCommentForm();

    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params) => {
      this.projectId = Number(params['id']);

      if (this.projectId) {
        this.loadProject();
        this.loadComments();
      } else {
        this.logger.error('ID do projeto inválido');
        this.hasError = true;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  initializeCommentForm(): void {
    this.commentForm = this.fb.group({
      text: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(500)]],
    });
  }

  loadProject(): void {
    this.isLoading = true;
    this.hasError = false;

    this.projectService
      .getProjectById(this.projectId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (project) => {
          this.logger.info('Project loaded:', project);
          this.project = project;
          this.isLoading = false;
        },
        error: (error) => {
          this.logger.error('Erro ao carregar projeto:', error);
          this.isLoading = false;
          this.hasError = true;
        },
      });
  }

  loadComments(): void {
    this.projectCommentService
      .getProjectComments(this.projectId, 1, 100)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.logger.info('Comments loaded:', response);
          this.comments = response.comments || [];
        },
        error: (error) => {
          this.logger.error('Erro ao carregar comentários:', error);
          this.comments = [];
        },
      });
  }

  getTechColor(tech: string): string {
    const colors: { [key: string]: string } = {
      REACT: '#61dafb',
      ANGULAR: '#dd0031',
      VUE: '#42b883',
      JAVA: '#007396',
      SPRING: '#6db33f',
      NODE: '#339933',
      PYTHON: '#3776ab',
      TYPESCRIPT: '#3178c6',
      JAVASCRIPT: '#f7df1e',
      DOCKER: '#2496ed',
      KUBERNETES: '#326ce5',
    };
    return colors[tech] || '#9b7ed9';
  }

  getInitials(name: string): string {
    if (!name) return '??';

    const words = name
      .trim()
      .split(' ')
      .filter((word) => word.length > 0);

    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }

    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }

  getAvatarColor(name: string): string {
    const colors = [
      '#9b7ed9',
      '#61dafb',
      '#dd0031',
      '#42b883',
      '#6db33f',
      '#3776ab',
      '#f7df1e',
      '#2496ed',
    ];

    if (!name) return colors[0];

    const hash = name.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    return colors[Math.abs(hash) % colors.length];
  }

  onAuthorImageError(): void {
    this.authorImageError = true;
  }

  onCurrentUserImageError(): void {
    this.currentUserImageError = true;
  }

  onSubmitComment(): void {
    if (this.isSubmittingComment) {
      this.logger.warn('Comentário já está sendo enviado, ignorando submissão duplicada');
      return;
    }

    if (this.commentForm.valid && this.project && this.currentUserId) {
      this.isSubmittingComment = true;

      const formValue = this.commentForm.value;
      const newComment: Partial<IProjectCommentCreateRequest> = {
        text: formValue.text,
        authorId: this.currentUserId,
      };

      this.projectCommentService
        .createComment(this.projectId, newComment)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (createdComment) => {
            this.logger.info('Comment created:', createdComment);
            this.comments.unshift(createdComment);
            this.commentForm.reset();
            this.isCommentExpanded = false;
            this.isSubmittingComment = false;
          },
          error: (error) => {
            this.logger.error('Erro ao criar comentário:', error);
            alert('Erro ao criar comentário. Tente novamente.');
            this.isSubmittingComment = false;
          },
        });
    }
  }

  cancelComment(): void {
    this.commentForm.reset();
    this.isCommentExpanded = false;
  }

  isCommentOwner(comment: IProjectCommentResponse): boolean {
    return comment.author.id === this.currentUserId;
  }

  deleteComment(commentId: number): void {
    this.projectCommentService
      .deleteComment(commentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.logger.info('Comment deleted:', commentId);
          this.comments = this.comments.filter((c) => c.id !== commentId);
        },
        error: (error) => {
          this.logger.error('Erro ao excluir comentário:', error);
          alert('Erro ao excluir comentário. Tente novamente.');
        },
      });
  }

  editComment(event: { id: number; text: string }): void {
    this.projectCommentService
      .updateComment(event.id, { text: event.text })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedComment) => {
          this.logger.info('Comment updated:', updatedComment);
          const index = this.comments.findIndex((c) => c.id === event.id);
          if (index !== -1) {
            this.comments[index] = updatedComment;
          }
        },
        error: (error) => {
          this.logger.error('Erro ao editar comentário:', error);
          alert('Erro ao editar comentário. Tente novamente.');
        },
      });
  }

  likeComment(commentId: number): void {
    this.logger.info('Curtir comentário:', commentId);
    alert('Funcionalidade de curtir ainda não implementada no backend');
  }

  goBack(): void {
    this.router.navigate(['/projetos']);
  }
}
