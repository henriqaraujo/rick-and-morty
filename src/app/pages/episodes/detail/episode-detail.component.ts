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
  selector: 'app-episode-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-detail.component.html',
  styleUrls: ['./episode-detail.component.scss'],
})
export class EpisodeDetailComponent implements OnInit {
  private _episode = signal<Episode|null>(null); //guarda o episódio atual (pode ser null enquanto não carrega);
  private _characters = signal<Character[]>([]); //guarda o array de personagens que participam do episódio;
  private _loading = signal<boolean>(true); //indica se ainda está carregando (true no início, false ao terminar).

  constructor(
    private route: ActivatedRoute, //permite acessar parâmetros da rota (por exemplo, /episodes/:id);
    private http: HttpClient, //permite fazer requisições HTTP diretas (para os personagens).
    private episodesService: EpisodesService //centraliza as chamadas de API dos episódios.
  ) {}


  get episode(): Episode | null { return this._episode(); }
  get characters(): Character[] { return this._characters(); }
  get loading(): boolean { return this._loading(); }


  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const id = params['id']; // emite um objeto com os parâmetros da rota (por exemplo { id: '5' }) sempre que os parâmetros mudam para aquela rota.
      if (id)
        this.getEpisode(id); //Se existir id, chama o método getEpisode(id) para buscar e atualizar o episódio mostrado.
    });
  }


  getEpisode(id: string) {
    this.episodesService.getEpisodeById(id).subscribe({
      next: (episodeData) => {
        this._episode.set(episodeData);


        if (!episodeData.characters || episodeData.characters.length === 0) { //Se o episódio não tiver personagens, para por aqui e encerra o “carregando”.
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
        this._loading.set(false);
      }
    });
  }
}
