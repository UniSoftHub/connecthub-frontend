import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { PrimaryButton } from '../../components/features/primary-button/primary-button';
import { ITopicResponse } from '../../interfaces/topic';

@Component({
  selector: 'app-discussoes',
  standalone: true,
  imports: [CommonModule, PrimaryButton],
  templateUrl: './discussions.html',
  styleUrl: './discussions.scss',
})
export class Discussions implements OnInit {
  topics: ITopicResponse[] = [];
  loading: boolean = true;

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadTopics();
  }

  loadTopics() {
    this.http.get<ITopicResponse[]>('/api/topics').subscribe({
      next: (data) => {
        this.topics = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Erro ao carregar tópicos:', error);
        this.loading = false;
      },
    });
  }
}
