import { EpisodeFilter } from '../../../models/episode-filter';
import { Component, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { CharactersService } from '../../../services/characters.service';
import { EpisodesService } from '../../../services/episodes.service';
import { SearchService } from '../../../services/search.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
   imports: [FormsModule],
})
export class HeaderComponent implements OnInit {
  _showSearchBar = signal(false);
  _currentUrl: string = '';
  searchTerm: string = '';

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
      this.searchTerm = this.searchService.term()
    });
  }

  ngOnInit(): void {

  }

  //Evento da barra de pesquisa, quando usuário digita.
  onSearchChange(event: Event) {
    const input = (event.target as HTMLInputElement).value;
    this.searchService.setTerm(input);
  }

  ///Getters
  get pageName() {
    return this.title.getTitle();
  }

  get showSearchBar(): boolean{
    return this._showSearchBar();
  }
}
