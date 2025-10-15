import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';
import { Episode } from '../models/episodes';


@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  //Definindo a URL base da API de personagens
  private apiUrl = `${environment.apiBase}/episode`;

  /*Injetando o HttpClient para conseguir fazer Get nos episódios*/
  constructor(private http: HttpClient) {}

  //Método para pegar todos os episódios
  getAllEpisodes(): Observable<{ results: Episode[] }>  {
    return this.http.get<{ results: Episode[] }>(this.apiUrl);
  }

  //Método para pegar episódio por ID
  getEpisodeById(id: number | string): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${id}`);
  }

  //Método para pegar múltiplos episódios por IDs
  getEpisodesByIds(ids: number[]): Observable<Episode[] | Episode> {
  const idsParam = ids.join(',');
  return this.http.get<Episode[] | Episode>(`${this.apiUrl}/${idsParam}`);
  }
}
