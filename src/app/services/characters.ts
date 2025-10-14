// characters.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CharactersService {
  private apiUrl = `${environment.apiBase}/character`;

  constructor(private http: HttpClient) {}

  getAllCharacters(): Observable<any> {
    return this.http.get(this.apiUrl);
  }


  getCharacters(): Observable<any> {
    return this.http.get(this.apiUrl);
  }

  getCharactersById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
}
