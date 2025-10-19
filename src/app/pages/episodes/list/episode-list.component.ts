import { EpisodeFilter } from '../../../models/episode-filter';
import { Episode } from '../../../models/episodes';
import { Component, OnInit, signal, Injector } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EpisodesService } from '../../../services/episodes.service';
import { SearchService } from '../../../services/search.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  map,
  startWith,
  switchMap,
  takeUntil,
} from 'rxjs/operators';
import { of, Subject } from 'rxjs';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-list.component.html',
  styleUrls: ['./episode-list.component.scss'],
})
export class EpisodeListComponent implements OnInit {

  private _episodes = signal<Episode[]>([]);
  private _currentPage = signal(1); // página atual a ser carregada
  private _loading = signal<boolean>(false); // evita chamadas paralelas
  private _hasMore = signal<boolean>(true); // indica se há mais páginas
  private destroy$ = new Subject<void>();

  constructor(
    private router: Router, //Permite navegar entre páginas
    private episodesService: EpisodesService, //
    private searchService: SearchService //Gerencia o termo digitado na barra de pesquisa
  ) {}

  get episodes(): Episode[] {
    return this._episodes();
  }
  get currentPage(): number {
    return this._currentPage();
  }
  get hasMore(): boolean {
    return this._hasMore();
  }
  get loading(): boolean {
    return this._loading();
  }

  ngOnInit(): void {
    if (!this.searchService.term()) this.loadEpisodes(1, '');

    this.searchService.search$
      .pipe(
        startWith(this.searchService.term()),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {
          this._loading.set(true);
          return this.episodesService.getEpisodes({ page: 1, name: term } as EpisodeFilter).pipe(
            catchError((err) => {
              console.error('Erro na API', err);
              return of({ results: [] });
            })
          );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this._episodes.set(res.results);
          this._loading.set(false);
        },
        error: () => {
          this._episodes.set([]);
          this._loading.set(false);
        },
      });
  }

  /*
  * Carrega a página 'page' de episódios e concatena ao array
  */
  loadEpisodes(page: number, name?: string): void {

    /**
     * this.loading → evita que o método rode enquanto uma requisição ainda está em andamento.
     * !this.hasMore → evita tentar carregar mais páginas quando a API já não tem mais resultados.
     * Isso previne requisições duplicadas ou loops infinitos de carregamento.
    */
    if (this.loading || !this.hasMore) return;

    /*Define estados iniciais antes da requisição
     _loading: indica visualmente (ex. spinner) que a tela está carregando.
     _currentPage: salva qual página está sendo requisitada.*/
    this._loading.set(true);
    this._currentPage.set(page);


     /* Chamada ao serviço de episódios
     * O método getEpisodes() recebe um objeto do tipo EpisodeFilter, que contém parâmetros da busca.
     * { page, name } cria um objeto dinâmico com as propriedades page e name (caso o nome exista).
     * O as EpisodeFilter apenas informa ao TypeScript qual é o tipo esperado. */
    this.episodesService
      .getEpisodes({ page, name } as EpisodeFilter)
      /* O takeUntil(this.destroy$) garante que a assinatura seja cancelada quando o componente for destruído (no ngOnDestroy()), evitando vazamento de memória.*/
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          /*this._episodes.update(...): adiciona os novos episódios ao array atual (concatenando os resultados antigos e os novos).
            - Isso permite scroll infinito (carregar mais páginas sem perder as anteriores).*/
          this._episodes.update((value) => [...value, ...res.results]);

          //this._hasMore.set(!!res.info?.next): atualiza o flag se a API indicou que há mais páginas disponiveis
          this._hasMore.set(!!res.info?.next);

          //this._loading.set(false): indica que terminou o carregamento.
          this._loading.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar episódios', err);
          this._loading.set(false);
        },
      });
  }

  /*
  * Chamado pelo (scroll) do container no template
  */
  onScroll(ev: Event): void {
    const target = ev.target as HTMLElement;
    const threshold = 120; // px antes do fim para acionar novo carregamento

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      this.loadEpisodes(this.currentPage + 1);
    }
  }

  // Navega para a rota de detalhes
  goToEpisode(id: number): void {
    this.router.navigate(['/episodes', id]);
  }

  // trackBy para melhorar performance do ngFor
  trackByEpisode(item: Episode): number | undefined {
    return item?.id;
  }
}
