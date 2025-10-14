import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {
  private apiUrl = 'https://rickandmortyapi.com/api/episode';

  constructor(private http: HttpClient) {}

  getEpisodes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getEpisodeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
