import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import {
  DataTable,
  TableAction,
  TableColumn,
} from '../../components/features/data-table/data-table';
import { IUserResponse, IUserCreateRequest, IUserUpdateRequest } from '../../interfaces/user';
import { NGXLogger } from 'ngx-logger';
import { UserModal } from '../../components/features/user-modal/user-modal';
import { UserService } from '../../services/users-service';
import { ToastService } from '../../services/toast.service';
import { ToastContainer } from '../../components/features/toast/toast';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [
    CommonModule,
    DataTable,
    PrimaryButton,
    MatIconModule,
    MatButtonModule,
    UserModal,
    ToastContainer,
  ],
  templateUrl: './users.html',
  styleUrl: './users.scss',
})
export class Users implements OnInit {
  users: IUserResponse[] = [];
  selectedUsers: IUserResponse[] = [];
  currentPage: number = 1;
  totalPages: number = 0;
  pageSize: number = 10;
  isLoading: boolean = false;
  hasError: boolean = false;

  isModalOpen: boolean = false;
  selectedUser: IUserResponse | null = null;

  columns: TableColumn[] = [
    { key: 'id', label: '#', width: '60px' },
    { key: 'name', label: 'Nome', width: '250px' },
    { key: 'email', label: 'E-mail' },
    { key: 'CPF', label: 'CPF', width: '150px' },
    { key: 'role', label: 'Perfil', type: 'badge', width: '120px' },
    { key: 'enrollmentId', label: 'Matrícula', width: '100px' },
    { key: 'phone', label: 'Telefone', width: '140px' },
    { key: 'isActive', label: 'Status', type: 'badge', width: '100px' },
  ];

  actions: TableAction[] = [
    {
      icon: 'ph-pencil-simple',
      label: 'Editar',
      callback: (user: IUserResponse) => this.editUser(user),
    },
  ];

  constructor(
    private userService: UserService,
    private logger: NGXLogger,
    private toastService: ToastService,
  ) {}

  ngOnInit() {
    this.loadUsers(1);
  }

  loadUsers(page: number = 1) {
    this.isLoading = true;
    this.hasError = false;
    this.currentPage = page;

    this.userService.getUsers(page, this.pageSize).subscribe({
      next: (response) => {
        this.users = response.users;
        this.totalPages = response.pages;
        this.isLoading = false;
      },
      error: (error) => {
        this.logger.error('Erro ao carregar usuários:', error);
        this.toastService.error('Erro ao carregar usuários');
        this.isLoading = false;
        this.hasError = true;
      },
    });
  }

  get pageNumbers(): number[] {
    const pages: number[] = [];
    const maxVisiblePages = 7;

    if (this.totalPages <= maxVisiblePages) {
      for (let i = 1; i <= this.totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let startPage: number;
      let endPage: number;

      if (this.currentPage <= 4) {
        startPage = 2;
        endPage = 5;
      } else if (this.currentPage >= this.totalPages - 3) {
        startPage = this.totalPages - 4;
        endPage = this.totalPages - 1;
      } else {
        startPage = this.currentPage - 1;
        endPage = this.currentPage + 1;
      }

      if (startPage > 2) {
        pages.push(-1);
      }

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }

      if (endPage < this.totalPages - 1) {
        pages.push(-1);
      }

      pages.push(this.totalPages);
    }

    return pages;
  }

  goToPage(page: number) {
    if (page === -1 || page === this.currentPage || page < 1 || page > this.totalPages) {
      return;
    }
    this.loadUsers(page);
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.loadUsers(this.currentPage + 1);
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.loadUsers(this.currentPage - 1);
    }
  }

  onSelectionChange(selected: IUserResponse[]) {
    this.selectedUsers = selected;
  }

  editUser(user: IUserResponse) {
    this.selectedUser = user;
    this.isModalOpen = true;
  }

  createUser() {
    this.selectedUser = null;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedUser = null;
  }

  saveUser(userData: IUserCreateRequest | { id: number; data: IUserUpdateRequest }) {
    if ('id' in userData) {
      const updateData = userData.data;

      if (updateData.isActive === false && this.selectedUser?.isActive === true) {
        this.userService.deactivateUser(userData.id).subscribe({
          next: () => {
            this.loadUsers(this.currentPage);
            this.closeModal();
            this.logger.info('Usuário desativado com sucesso!');
            this.toastService.success('Usuário desativado com sucesso!');
          },
          error: (error) => {
            this.logger.error('Erro ao desativar usuário:', error);
            const errorMessage = error?.error?.message || 'Erro ao desativar usuário';
            this.toastService.error(errorMessage);
          },
        });
      } else {
        this.userService.updateUser(userData.id, updateData).subscribe({
          next: () => {
            this.loadUsers(this.currentPage);
            this.closeModal();
            this.logger.info('Usuário atualizado com sucesso!');
            this.toastService.success('Usuário atualizado com sucesso!');
          },
          error: (error) => {
            this.logger.error('Erro ao atualizar usuário:', error);
            const errorMessage = error?.error?.message || 'Erro ao atualizar usuário';
            this.toastService.error(errorMessage);
          },
        });
      }
    } else {
      this.userService.createUser(userData).subscribe({
        next: () => {
          this.loadUsers(this.currentPage);
          this.closeModal();
          this.logger.info('Usuário criado com sucesso!');
          this.toastService.success('Usuário criado com sucesso!');
        },
        error: (error) => {
          this.logger.error('Erro ao criar usuário:', error);
          const errorMessage =
            error?.error?.message || 'Erro ao criar usuário. Verifique os dados.';
          this.toastService.error(errorMessage);
        },
      });
    }
  }

  onRowClick(user: IUserResponse) {
    this.editUser(user);
  }

  deactivateSelected() {
    if (this.selectedUsers.length === 0) {
      this.toastService.warning('Selecione pelo menos um usuário para desativar');
      return;
    }

    const count = this.selectedUsers.length;
    if (!confirm(`Deseja realmente desativar ${count} usuário(s)?`)) {
      return;
    }

    const ids = this.selectedUsers.map((u) => u.id);

    this.logger.info('Desativando usuários:', ids);

    this.userService.deactivateUsers(ids).subscribe({
      next: () => {
        this.loadUsers(this.currentPage);
        this.selectedUsers = [];
        this.logger.info(`${count} usuário(s) desativado(s) com sucesso!`);
        this.toastService.success(`${count} usuário(s) desativado(s) com sucesso!`);
      },
      error: (error) => {
        this.logger.error('Erro ao desativar usuários:', error);
        const errorMessage = error?.error?.message || 'Erro ao desativar usuários';
        this.toastService.error(errorMessage);
      },
    });
  }
}
