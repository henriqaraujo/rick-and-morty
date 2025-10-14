import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EpisodesService {

  //Definindo a URL base da API de episódios
  private apiUrl = `${environment.episodeApi}`;

  /*Injetando o HttpClient para conseguir fazer Get nos episódios*/
  constructor(private http: HttpClient) {}

  //Método para pegar todos os episódios
  getEpisodes(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  //Método para pegar episódio por ID
  getEpisodeById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
