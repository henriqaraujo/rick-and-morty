import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Character } from '../../../models/characters';
import { Episode } from '../../../models/episodes';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.component.html',
  styleUrls: ['./character-detail.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class CharacterDetail implements OnInit {
  // signals corretos: character pode ser null até carregar
  private _character = signal<Character | null>(null);
  private _episodes = signal<Episode[]>([]);

  constructor(
    private route: ActivatedRoute, //Permite ler parâmetros da URL atual
    private http: HttpClient,
  ) {}

  // getters para o template
  get character(): Character | null { return this._character(); }
  get episodes(): Episode[] { return this._episodes(); }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(id);
    }
  }

  fetchCharacter(id: string): void {
    this.http
      .get<Character>(`https://rickandmortyapi.com/api/character/${id}`)
      .subscribe({
        next: (character) => {
          this._character.set(character);
          // character.episode é um array de URLs
          this.fetchEpisodes(character.episode || []);
        },
        error: (err) => {
          console.error('Erro ao carregar personagem', err);
          this._character.set(null);
          this._episodes.set([]);
        }
      });
  }

  fetchEpisodes(episodeUrls: string[]): void {
    if (!episodeUrls || episodeUrls.length === 0) {
      this._episodes.set([]);
      return;
    }

    const episodeIds = episodeUrls
      .map((url) => url.split('/').pop())
      .filter((id): id is string => !!id);

    if (episodeIds.length === 0) {
      this._episodes.set([]);
      return;
    }

    const idsParam = episodeIds.join(',');

    this.http
      .get<Episode[] | Episode>(`https://rickandmortyapi.com/api/episode/${idsParam}`)
      .subscribe({
        next: (data) => {
          this._episodes.set(Array.isArray(data) ? data : [data]);
        },
        error: (err) => {
          console.error('Erro ao carregar episódios', err);
          this._episodes.set([]);
        }
      });
  }
}
