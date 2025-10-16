import { Episode } from './../../../models/episodes';
import { Component, OnInit, OnDestroy, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Subject, takeUntil } from 'rxjs';
import { EpisodesService } from '../../../services/episodes.service';

import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episodes.html',
  styleUrls: ['./episodes.scss'],
})
export class EpisodesComponent implements OnInit, OnDestroy {
  private _episodes = signal<Episode[]>([]);
  private _currentPage = signal(1); // página atual a ser carregada
  private _loading = signal<boolean>(false); // evita chamadas paralelas
  private _hasMore = signal<boolean>(true); // indica se há mais páginas

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private http: HttpClient,
    private episodesService: EpisodesService
  ) {}

  get episodes(): Episode[]{ return this._episodes();}
  get currentPage(): number { return this._currentPage(); }
  get hasMore(): boolean { return this._hasMore(); }
  get loading(): boolean { return this._loading(); }

  private destroy$ = new Subject<void>();

  ngOnInit(): void {
    this.loadEpisodes(this._currentPage());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Carrega a página 'page' de episódios e concatena ao array
  loadEpisodes(page: number): void {
    console.log('loadEpisodes called, page=', this.currentPage);
    if (this.loading || !this.hasMore) return;

    this._loading.set(true);
    this._currentPage.set(page);

    this.episodesService
      .getEpisodes(page)
      //.pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (res) => {
          console.log('getEpisodes res:', res);
          this._episodes.update(value  => [...value, ...res.results]);
          this._hasMore.set(!!res.info?.next);
          this._loading.set(false);
        },
        error: (err) => {
          console.error('Erro ao carregar episódios', err);
          this._loading.set(false);
        },
      });
  }

  // Chamado pelo (scroll) do container no template
  onScroll(ev: Event): void {
    const target = ev.target as HTMLElement;
    const threshold = 120; // px antes do fim para acionar novo carregamento

    if (target.scrollTop + target.clientHeight >= target.scrollHeight - threshold) {
      this.loadEpisodes(this.currentPage+1);
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
