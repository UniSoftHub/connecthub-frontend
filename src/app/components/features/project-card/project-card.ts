import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IProjectResponse } from '../../../interfaces/project';

@Component({
  selector: 'app-project-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './project-card.html',
  styleUrls: ['./project-card.scss'],
})
export class ProjectCard {
  @Input({ required: true }) project!: IProjectResponse;
  @Output() projectClick = new EventEmitter<void>();

  getTechColor(tech: string): string {
    const colors: { [key: string]: string } = {
      Angular: '#dd0031',
      React: '#61dafb',
      Vue: '#42b883',
      'Node.js': '#68a063',
      TypeScript: '#3178c6',
      JavaScript: '#f7df1e',
      Python: '#3776ab',
      Java: '#007396',
      'C#': '#239120',
      PHP: '#777bb4',
      Ruby: '#cc342d',
      Go: '#00add8',
      Rust: '#000000',
      Swift: '#fa7343',
      Kotlin: '#7f52ff',
    };
    return colors[tech] || '#6c757d';
  }

  onCardClick(): void {
    this.projectClick.emit();
  }
}
