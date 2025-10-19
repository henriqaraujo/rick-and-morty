import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../../services/characters.service';
import { Character } from '../../../models/characters';
import { ActivatedRoute, Router } from '@angular/router';
import { SearchService } from '../../../services/search.service';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  of,
  startWith,
  Subject,
  switchMap,
  takeUntil,
} from 'rxjs';
import { CharacterFilter } from '../../../models/character-filter';

@Component({
  selector: 'app-character-list',
  standalone: true,
  templateUrl: './character-list.component.html',
  styleUrls: ['./character-list.component.scss'],
  imports: [CommonModule],
})
export class CharacterListComponent implements OnInit {
  private _characters = signal<Character[]>([]);
  private _loading = signal<boolean>(true); //controla o “estado de carregamento” da tela — se o sistema está buscando personagens na API ou já terminou de carregar.
  private destroy$ = new Subject<void>();

  constructor(
    private _characterService: CharactersService, //Faz requisições para a API de personagens
    private _router: Router, //Permite navegar entre páginas
    private _route: ActivatedRoute, //Permite ler parâmetros da URL atual
    private searchService: SearchService //Gerencia o termo digitado na barra de pesquisa
  ) {}

  // Getters para template
  get characters(): Character[] {
    return this._characters();
  }

  get loading(): boolean {
    return this._loading();
  }

  ngOnInit(): void {
    /**
     * Verifica se há um termo de pesquisa ativo.
     * Se não tiver termo, chama loadCharacters() para buscar todos os personagens da primeira página.
     */
    if (!this.searchService.term()) this.loadCharacters();

    /**
     * É um Observable que emite o valor digitado na barra de busca.
     * Toda vez que o usuário digita algo, esse fluxo reativo começa.
     */
    this.searchService.search$
      .pipe(
        startWith(this.searchService.term()), //Começa emitindo o termo atual (para já carregar algo na tela), Se o usuário tinha digitado “Rick” antes, o fluxo começa já com “Rick”, sem precisar digitar de novo.
        debounceTime(500), //Espera 500ms sem digitação antes de buscar (evita chamadas a cada tecla)
        distinctUntilChanged(), //Só emite se o texto realmente mudar, Se o usuário digita “Rick” e depois apaga e digita “Rick” de novo → não busca duas vezes, pois o termo é o mesmo.
        switchMap((term) => { //Cancela a requisição anterior e faz uma nova (se o usuário digitar rápido), Substitui pelo novo fluxo de dados retornado.
          this._loading.set(true);
          return this._characterService
            .getCharacters({ page: 1, name: term } as CharacterFilter)
            .pipe(
              catchError((err) => { //Se a API falhar, retorna um array vazio
                console.error('Erro na API', err);
                return of({ results: [] });
              })
            );
        }),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (res) => {
          this._characters.set(res.results);
          this._loading.set(false);
        },
        error: () => {
          this._characters.set([]);
          this._loading.set(false);
        },
      });
  }

  loadCharacters() {
    this._characterService.getCharacters({ page: 1 } as CharacterFilter).subscribe({
      next: (res) => {
        this._characters.set(res.results);
        this._loading.set(false);
      },
      error: () => {
        this._characters.set([]);
        this._loading.set(false);
      },
    });
  }

  goToCharacter(id: number): void {
    this._router.navigate(['/characters', id]);
  }
}
