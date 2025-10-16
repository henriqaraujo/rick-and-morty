import { EpisodeFilter } from './../../models/episode-filter';
import { Component, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { CharactersService } from '../../services/characters.service';
import { EpisodesService } from '../../services/episodes.service';
import { SearchService } from '../../services/search.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.html',
  styleUrls: ['./header.scss'],
})
export class Header {
  searchTerm = '';
  _showSearchBar = signal(false);
  _currentUrl: string = '';


  constructor(
    private router: Router,
    private title: Title,
    private searchService: SearchService,
  ) {
    const searchBarTerms = ['/episodes', '/characters'];

    // Verifica a rota atual e aplica regra de exibição da barra de pesquisa.
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe((e: any) => {
      this._currentUrl = e.urlAfterRedirects;
      this._showSearchBar.set(searchBarTerms.includes(this._currentUrl));
    });
  }

  // ✅ Atualiza o termo global sempre que o usuário digitar
  onSearchChange(value: string) {
    this.searchService.setTerm(value);
  }

  ///Getters
  get pageName() {
    return this.title.getTitle();
  }

  get showSearchBar(): boolean{
    return this._showSearchBar();
  }
}
