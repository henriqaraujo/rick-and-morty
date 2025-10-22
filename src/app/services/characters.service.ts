// characters.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Character } from '../models/characters';
import { ResponseList } from '../models/response-list';
import { CharacterFilter } from '../models/character-filter';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private apiUrl = `${environment.apisHost.rickAndMorty}/character`;

  constructor(private http: HttpClient) {}

  //Método para pegar todos os personagens
  getCharacters(filter: CharacterFilter): Observable<ResponseList<Character>> {
    const queryString = new URLSearchParams(filter as any).toString();
    return this.http.get<ResponseList<Character>>(`${this.apiUrl}?${queryString}`);
  }

  //Método para pegar personagem por ID
  getCharacterById(id: number | string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }

  //Método para pegar múltiplos personagens por IDs
  getCharactersByIds(ids: (number | string)[]): Observable<Character[] | Character> {
  const idsParam = ids.join(',');
  return this.http.get<Character[] | Character>(`${this.apiUrl}/${idsParam}`);
  }
}
