import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-detail',
  templateUrl: './character-detail.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./character-detail.scss'],
})
export class CharacterDetail implements OnInit {
  character: any;
  episodes: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(id);
    }
  }

  fetchCharacter(id: string): void {
    this.http
      .get<any>(`https://rickandmortyapi.com/api/character/${id}`)
      .subscribe((character) => {
        this.character = character;
        this.fetchEpisodes(character.episode);
      });
  }

  fetchEpisodes(episodeUrls: string[]): void {
    const episodeIds = episodeUrls.map((url) => url.split('/').pop());
    const idsParam = episodeIds.join(',');

    this.http
      .get<any>(`https://rickandmortyapi.com/api/episode/${idsParam}`)
      .subscribe((data) => {
        this.episodes = Array.isArray(data) ? data : [data];
      });
  }
}
