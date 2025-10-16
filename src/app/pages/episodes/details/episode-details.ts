import { Component, OnInit, Signal, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { forkJoin, Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { Episode } from '../../../models/episodes';
import { Character } from '../../../models/characters';
import { EpisodesService } from '../../../services/episodes.service';

@Component({
  selector: 'app-episode-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-details.html',
  styleUrls: ['./episode-details.scss'],
})
export class EpisodeDetailsComponent implements OnInit {
  private _episode = signal<Episode|null>(null);
  private _characters = signal<Character[]>([]);
  private _loading = signal<boolean>(true);

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private episodesService: EpisodesService
  ) {}


  get episode(): Episode | null { return this._episode(); }
  get characters(): Character[] { return this._characters(); }
  get loading(): boolean { return this._loading(); }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id'];
      if (id)
        this.getEpisode(id);
    });
  }


  getEpisode(id: string) {
    console.log('Fetching episode with id:', id);
    this.episodesService.getEpisodeById(id).subscribe({
      next: (episodeData) => {
        this._episode.set( episodeData);

        if (!episodeData.characters || episodeData.characters.length === 0) {
          this._loading.set(false);
          return;
        }

        const characterRequests = episodeData.characters.map((url) =>
          this.http.get<Character>(url)
        );
        forkJoin(characterRequests).subscribe({
          next: (responses) => {
            this._characters.set(responses);
          },
          error: (err) => {
            console.error(err);
          },
          complete: () => { this._loading.set(false) }
        });
      },
      error: (err) => {
        console.error(err);
      },
      complete: () => {
        console.log('Episode fetch complete');
        this._loading.set(false);
      }
    });
  }
}
