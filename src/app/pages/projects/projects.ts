import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ProjectCard } from '../../components/features/project-card/project-card';
import { IProjectRequest, IProjectResponse } from '../../interfaces/project';
import { Router } from '@angular/router';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import { NGXLogger } from 'ngx-logger';
import { ProjectService } from '../../services/projects-service';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ProjectCard, PrimaryButton],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss'],
})
export class Projects implements OnInit {
  isLoading = false;
  hasError = false;
  currentPage = 1;
  totalPages = 0;
  pageSize = 10;

  projects: IProjectResponse[] = [];
  filteredProjects: IProjectResponse[] = [];
  showAddModal = false;
  searchTerm = '';
  selectedTech = 'ALL';
  projectForm!: FormGroup;

  technologies = [
    'ALL',
    'REACT',
    'ANGULAR',
    'VUE',
    'JAVA',
    'SPRING',
    'NODE',
    'PYTHON',
    'TYPESCRIPT',
    'JAVASCRIPT',
    'DOCKER',
    'KUBERNETES',
  ];

  constructor(
    private fb: FormBuilder,
    private logger: NGXLogger,
    private router: Router,
    private projectService: ProjectService,
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadProjects(1);
  }

  initializeForm(): void {
    this.projectForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(100)]],
      description: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(500)]],
      repositoryUrl: ['', [Validators.required, Validators.pattern('https?://.+')]],
      imageUrl: ['', [Validators.pattern('https?://.+')]],
      technologies: ['REACT', Validators.required],
    });
  }

  loadProjects(page: number = 1) {
    this.isLoading = true;
    this.hasError = false;
    this.currentPage = page;

    this.projectService.getProjects(page, this.pageSize).subscribe({
      next: (response) => {
        this.logger.info('Projects loaded:', response);
        this.projects = response.projects;
        this.totalPages = response.pages;

        this.filteredProjects = [...this.projects];

        this.isLoading = false;
      },
      error: (error) => {
        this.logger.error('Erro ao carregar projetos:', error);
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  filterProjects(): void {
    this.filteredProjects = this.projects.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        project.description.toLowerCase().includes(this.searchTerm.toLowerCase());
      const matchesTech =
        this.selectedTech === 'ALL' || project.technologies.includes(this.selectedTech);
      return matchesSearch && matchesTech;
    });
  }

  openProjectDetails(projectId: string): void {
    this.router.navigate(['/projetos', projectId]);
  }

  openAddModal(): void {
    this.showAddModal = true;
    document.body.style.overflow = 'hidden';
  }

  closeAddModal(): void {
    this.showAddModal = false;
    this.projectForm.reset({ technologies: 'REACT' });
    document.body.style.overflow = 'auto';
  }

  onSubmit(): void {
    if (this.projectForm.valid) {
      const formValue = this.projectForm.value;
      const newProject: IProjectRequest = {
        name: formValue.name,
        description: formValue.description,
        repositoryUrl: formValue.repositoryUrl,
        imageUrl:
          formValue.imageUrl ||
          'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800&h=400&fit=crop',
        technologies: [formValue.technologies],
        authorId: 999,
      };

      this.projectService.createProject(newProject).subscribe({
        next: (createdProject) => {
          this.logger.info('Project created:', createdProject);
          this.loadProjects(this.currentPage);
          this.closeAddModal();
        },
        error: (error) => {
          this.logger.error('Error creating project:', error);
        },
      });
    }
  }
}
