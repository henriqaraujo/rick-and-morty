import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SearchService {
  // Signal global com o termo de busca
  private _term = signal<string>('');

  // Expor o signal de forma pública somente leitura
  readonly term = this._term.asReadonly();

  // subject para debounce
  private searchSubject = new Subject<string>();
  search$ = this.searchSubject.asObservable();


  // Atualiza o termo de busca
  setTerm(value: string) {
    const term = value.toLowerCase().trim()
    this._term.set(term);
    this.searchSubject.next(term); // dispara para observables
  }

  // Limpa o termo
  clear() {
    this._term.set('');
  }
}
