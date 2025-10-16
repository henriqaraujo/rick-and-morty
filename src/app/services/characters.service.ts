// characters.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Character } from '../models/characters';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {

  //Definindo a URL base da API de personagens
  private apiUrl = `${environment.apisHost.rickAndMorty}/character`;

  //Injetando o HttpClient para conseguir fazer Get nos personagens
  constructor(private http: HttpClient) {}

  //Método para pegar todos os personagens
  getAllCharacters(): Observable<{ info: any; results: Character[] }> {
    return this.http.get<{ info: any; results: Character[] }>(this.apiUrl);
  }

  //Método para pegar personagem por ID
  getCharacterById(id: number | string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  //Método para pegar múltiplos personagens por IDs
  getCharactersByIds(ids: number[]): Observable<Character[] | Character> {
  const idsParam = ids.join(',');
  return this.http.get<Character[] | Character>(`${this.apiUrl}/${idsParam}`);
  }
}
