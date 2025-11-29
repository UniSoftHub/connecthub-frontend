import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { INewTopicResponse, ITopicResponse } from '../interfaces/topic';

@Injectable({
  providedIn: 'root',
})
export class TopicsService {
  private readonly _httpClient = inject(HttpClient);

  saveTopic(topic: INewTopicResponse) {
    return this._httpClient.post<INewTopicResponse>(environment.apiUrl + '/topics', topic);
  }

  getTopics() {
    return this._httpClient.get<ITopicResponse>(environment.apiUrl + '/products');
  }
}
