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
  private _loading = signal<boolean>(true);
  private destroy$ = new Subject<void>();

  constructor(
    private _characterService: CharactersService,
    private _router: Router,
    private _route: ActivatedRoute,
    private searchService: SearchService
  ) {}

  // Getters para template
  get characters(): Character[] {
    return this._characters();
  }

  get loading(): boolean {
    return this._loading();
  }

  ngOnInit(): void {
    if (!this.searchService.term()) this.loadCharacters();

    this.searchService.search$
      .pipe(
        startWith(this.searchService.term()),
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((term) => {
          this._loading.set(true);
          return this._characterService
            .getCharacters({ page: 1, name: term } as CharacterFilter)
            .pipe(
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
