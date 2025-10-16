import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, EMPTY } from 'rxjs';
import { expand, map, reduce } from 'rxjs/operators';
import { environment } from '../../environments/environment.development';
import { Episode } from '../models/episodes';

// Estrutura de resposta da API /episode
export interface EpisodesResponse {
  info: {
    count: number;
    pages: number;
    next: string | null;
    prev: string | null;
  };
  results: Episode[];
}

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {
  //Definindo a URL base da API de episódios
  private apiUrl = `${environment.apisHost.rickAndMorty}/episode`;

  constructor(private http: HttpClient) {}

  // Método paginado: retorna { info, results } para a página solicitada
  getEpisodes(page = 1): Observable<EpisodesResponse> {
    return this.http.get<EpisodesResponse>(`${this.apiUrl}?page=${page}&count=10`);
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

  // Método que busca todos os episódios concatenando todas as páginas (retorna array de Episode)
  // Usa expand para iterar pelas páginas até que não haja next
  getAllEpisodes(): Observable<Episode[]> {
    const firstPageUrl = `${this.apiUrl}?page=1`;
    return this.http.get<EpisodesResponse>(firstPageUrl).pipe(
      expand((res) => (res.info.next ? this.http.get<EpisodesResponse>(res.info.next) : EMPTY)),
      map((res) => res.results),
      // reduce concatena todos os arrays de results em um único array
      reduce((acc: Episode[], results: Episode[]) => acc.concat(results), [] as Episode[])
    );
  }
}
