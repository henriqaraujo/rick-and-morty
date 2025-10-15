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
  private apiUrl = `${environment.apiBase}/character`;

  //Injetando o HttpClient para conseguir fazer Get nos personagens
  constructor(private http: HttpClient) {}

  //Método para pegar todos os personagens
  getAllCharacters(): Observable<{ results: Character[] }> {
    return this.http.get<{ results: Character[] }>(this.apiUrl);
  }

  //Método para pegar personagem por ID
  getCharacterById(id: number | string): Observable<Character> {
    return this.http.get<Character>(`${this.apiUrl}/${id}`);
  }
}
