import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable  } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Episode } from '../../models/episodes';
import { Character } from '../../models/characters';
import { EpisodesService } from '../../services/episodes.service';


@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-details.html',
  styleUrls: ['./episode-details.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode: Episode | null = null;
  characters: Character[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private episodesService: EpisodesService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.getEpisode(id);
    }
  }

  //
  getEpisode(id: string) {
    this.episodesService.getEpisodeById(id).subscribe({
      next: (episodeData) => {
        this.episode = episodeData;

        if (!episodeData.characters || episodeData.characters.length === 0) {
          this.loading = false;
          return;
        }

        const characterRequests = episodeData.characters.map(url => this.http.get<Character>(url));
        forkJoin(characterRequests).subscribe({
          next: (responses) => {
            this.characters = responses;
            this.loading = false;
          },
          error: (err) => {
            console.error(err);
            this.loading = false;
          }
        });
      },
      error: (err) => {
        console.error(err);
        this.loading = false;
      }
    });
  }
}
