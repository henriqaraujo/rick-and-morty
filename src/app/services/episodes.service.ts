import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Episode } from '../models/episodes';
import { EpisodeFilter } from '../models/episode-filter';
import { ResponseList } from '../models/response-list';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {
  //Definindo a URL base da API de episódios
  private apiUrl = `${environment.apisHost.rickAndMorty}/episode`;

  constructor(private http: HttpClient) {}

  // Método paginado: retorna { info, results } para a página solicitada
  getEpisodes(filter: EpisodeFilter): Observable<ResponseList<Episode>> {
    const queryString = new URLSearchParams(filter as any).toString();
    return this.http.get<ResponseList<Episode>>(`${this.apiUrl}?${queryString}`);
  }

  // Método para pegar episódio por ID
  getEpisodeById(id: number | string): Observable<Episode> {
    return this.http.get<Episode>(`${this.apiUrl}/${id}`);
  }

  // Método para pegar múltiplos episódios por IDs (API aceita /episode/1,2,3)
  getEpisodesByIds(ids: number[]): Observable<Episode[] | Episode> {
    const idsParam = ids.join(',');
    return this.http.get<Episode[] | Episode>(`${this.apiUrl}/${idsParam}`);
  }
}
