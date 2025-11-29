import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'avatar' | 'actions';
  width?: string;
  valueFormatter?: (value: any, row: any) => string;
}

export interface TableAction {
  icon: string;
  label: string;
  callback: (item: any) => void;
}

@Component({
  selector: 'app-data-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './data-table.html',
  styleUrl: './data-table.scss',
})
export class DataTable {
  @Input() columns: TableColumn[] = [];
  @Input() data: any[] = [];
  @Input() actions: TableAction[] = [];
  @Input() selectable: boolean = false;
  @Input() emptyMessage: string = 'No data available';

  @Output() rowClick = new EventEmitter<any>();
  @Output() selectionChange = new EventEmitter<any[]>();

  selectedItems: Set<any> = new Set();

  toggleSelection(item: any) {
    if (this.selectedItems.has(item)) {
      this.selectedItems.delete(item);
    } else {
      this.selectedItems.add(item);
    }
    this.selectionChange.emit(Array.from(this.selectedItems));
  }

  toggleSelectAll() {
    if (this.selectedItems.size === this.data.length) {
      this.selectedItems.clear();
    } else {
      this.data.forEach((item) => this.selectedItems.add(item));
    }
    this.selectionChange.emit(Array.from(this.selectedItems));
  }

  getRoleLabel(role: string): string {
    const roleMap: { [key: string]: string } = {
      STUDENT: 'Aluno',
      TEACHER: 'Professor',
      ADMIN: 'Administrador',
      COORDINATOR: 'Coordenador',
    };
    return roleMap[role] || role;
  }

  isSelected(item: any): boolean {
    return this.selectedItems.has(item);
  }

  onRowClick(item: any) {
    this.rowClick.emit(item);
  }
}
