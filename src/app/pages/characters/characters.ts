import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../services/characters.service';
import { EpisodesService } from '../../services/episodes.service';
import { Character } from '../../models/characters';
import { Episode } from '../../models/episodes';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-character-detail',
  standalone: true,
  templateUrl: './character-detail.html',
  styleUrls: ['./character-detail.scss'],
  imports: [CommonModule],
})
export class CharacterDetailComponent implements OnInit {
  character: Character | null = null;
  episodes: Episode[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private characterService: CharactersService,
    private episodeService: EpisodesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(+id);
    }
  }

  fetchCharacter(id: number): void {
    this.characterService.getCharacterById(id).subscribe({
      next: (characterData) => {
        this.character = characterData;

        if (!characterData.episode?.length) {
          this.loading = false;
          return;
        }

        // Pega os IDs dos episódios e faz requisição em paralelo
        const episodeIds = characterData.episode.map((url) => url.split('/').pop());
        const episodeRequests = episodeIds.map((eid) => this.episodeService.getEpisodeById(eid!));

        forkJoin(episodeRequests).subscribe({
          next: (episodesData) => {
            this.episodes = episodesData;
            this.loading = false;
          },
          error: (err) => {
            console.error('Erro ao buscar episódios:', err);
            this.loading = false;
          },
        });
      },
      error: (err) => {
        console.error('Erro ao buscar personagem:', err);
        this.loading = false;
      },
    });
  }
}
