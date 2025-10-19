import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * Serviço responsável por gerenciar o termo de busca global da aplicação.
 *
 * Este serviço utiliza o novo sistema de `signals` do Angular para manter
 * o valor do termo de busca reativo e compartilhado entre diferentes componentes.
 * Além disso, expõe um `Observable` (`search$`) para lidar com eventos de debounce
 * e evitar requisições desnecessárias durante a digitação do usuário.
 *
 * @example
 * // Exemplo de uso em um componente:
 * constructor(private searchService: SearchService) {}
 *
 * onSearch(term: string) {
 *   this.searchService.setTerm(term);
 * }
 */
@Injectable({ providedIn: 'root' })
export class SearchService {
  /**
   * Signal privado que armazena o termo de busca atual.
   * Este valor é reativo e pode ser observado diretamente pelos componentes.
   *
   * @private
   */
  private _term = signal<string>('');

  /**
   * Signal somente leitura que expõe o termo de busca atual.
   * Permite que outros componentes leiam o valor sem modificá-lo diretamente.
   *
   * @readonly
   */
  readonly term = this._term.asReadonly();

  /**
   * Subject responsável por emitir o termo de busca
   * sempre que há uma nova atualização, sendo utilizado
   * normalmente com debounce para otimizar chamadas de API.
   *
   * @private
   */
  private searchSubject = new Subject<string>();

  /**
   * Observable público derivado do `searchSubject`.
   * Pode ser subscrito por componentes para reagir a alterações no termo.
   */
  search$ = this.searchSubject.asObservable();

  /**
   * Atualiza o termo de busca globalmente e notifica
   * os observadores do `search$` sobre a nova alteração.
   *
   * @param value - Texto digitado pelo usuário.
   *
   * @example
   * this.searchService.setTerm('Rick');
   */
  setTerm(value: string): void {
    const term = value.toLowerCase().trim();
    this._term.set(term);
    this.searchSubject.next(term);
  }

  /**
   * Limpa o termo de busca, retornando-o para uma string vazia.
   *
   * @example
   * this.searchService.clear();
   */
  clear(): void {
    this._term.set('');
  }
}
