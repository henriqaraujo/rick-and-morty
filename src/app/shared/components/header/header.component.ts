import { EpisodeFilter } from '../../../models/episode-filter';
import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { CharactersService } from '../../../services/characters.service';
import { EpisodesService } from '../../../services/episodes.service';
import { SearchService } from '../../../services/search.service';
import { FormsModule } from '@angular/forms';

/**
 * Componente responsável pelo cabeçalho (header) da aplicação.
 *
 * Este componente:
 * - Exibe o título atual da página.
 * - Exibe e gerencia a barra de busca global.
 * - Controla quando a barra de busca deve aparecer (apenas em determinadas rotas).
 * - Atualiza o termo de busca global no `SearchService` conforme o usuário digita.
 *
 * @example
 * <app-header></app-header>
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [FormsModule],
})
export class HeaderComponent implements OnInit {
  /**
   * Signal que controla a visibilidade da barra de busca.
   *
   * @remarks
   * É ativado apenas nas rotas definidas em `searchBarTerms`.
   *
   * @defaultValue false
   */
  protected readonly _showSearchBar = signal(false);

  /**
   * Armazena a rota atual da aplicação.
   *
   * Utilizado para verificar se a barra de busca deve ser exibida.
   */
  protected _currentUrl: string = '';

  /**
   * Termo atual exibido no campo de busca.
   * Sincronizado com o `SearchService` para manter o valor globalmente.
   */
  searchTerm: string = '';

  /**
   * Define as rotas onde a barra de busca deve aparecer.
   */
  private readonly searchBarTerms = ['/episodes', '/characters'];

  /**
   * Construtor do componente Header.
   *
   * @param router - Serviço Angular responsável pelo controle e navegação de rotas.
   * @param title - Serviço Angular que manipula o título do documento.
   * @param searchService - Serviço global que gerencia o termo de busca.
   */
  constructor(
    private router: Router,
    private title: Title,
    private searchService: SearchService,
  ) {
    // Escuta mudanças de rota e atualiza a visibilidade da barra de busca.
    this.router.events
      .pipe(filter((e) => e instanceof NavigationEnd))
      .subscribe((e: any) => {
        this._currentUrl = e.urlAfterRedirects;
        this._showSearchBar.set(this.searchBarTerms.includes(this._currentUrl));
        this.searchTerm = this.searchService.term();
      });
  }

  /**
   * Método de ciclo de vida chamado quando o componente é inicializado.
   */
  ngOnInit(): void {}

  /**
   * Manipula o evento de digitação na barra de pesquisa.
   *
   * @param event - Evento disparado pelo campo de input.
   *
   * @remarks
   * Este método atualiza o valor global do termo de busca no `SearchService`,
   * permitindo que outros componentes reajam automaticamente às mudanças.
   */
  onSearchChange(event: Event): void {
    const input = (event.target as HTMLInputElement).value;
    this.searchService.setTerm(input);
  }

  // ===============================
  // Getters
  // ===============================

  /**
   * Retorna o título atual da página.
   *
   * @returns O título definido no serviço Angular `Title`.
   */
  get pageName(): string {
    return this.title.getTitle();
  }

  /**
   * Indica se a barra de busca deve ser exibida.
   *
   * @returns `true` se a barra de busca deve aparecer, caso contrário `false`.
   */
  get showSearchBar(): boolean {
    return this._showSearchBar();
  }
}
