import { CharactersService } from './../../../services/characters.service';
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


  constructor(
    private route: ActivatedRoute, //permite acessar parâmetros da rota (por exemplo, /episodes/:id);
    private http: HttpClient, //permite fazer requisições HTTP diretas (para os personagens).
    private episodesService: EpisodesService, //centraliza as chamadas de API dos episódios.
    private charactersService: CharactersService
  ) {}

  get episode(): Episode | null { return this._episode(); }
  get characters(): Character[] { return this._characters(); }


  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      console.log("ID recebido:", id);
      this.fetchEpisode(id);
    }
  }


  fetchEpisode(id: string) {
    this.episodesService.getEpisodeById(id)
    .subscribe({
      next: (episode) => {
        this._episode.set(episode);
        this.fetchCharacters(episode.characters || []); // Se character.episode existir e não for vazio, usa ele; caso contrário, usa um array vazio [].
        },
        error: (err) => {
          console.error('Erro ao carregar personagem', err);
          this._characters.set([]);
          this._episode.set(null);
        }
      });
  }

  fetchCharacters(charactersUrls: string[]): void {
  // Verifica se o array de URLs existe ou está vazio
  if (!charactersUrls || charactersUrls.length === 0) {
    this._characters.set([]); // Limpa o signal de episódios
    return;                 // Sai do método, nada mais é feito
  }

  const characterIds = charactersUrls
    .map((url) => url.split('/').pop())  // Pega a última parte da URL (ex: "1" de ".../episode/1")
    .filter((id): id is string => !!id) // Remove valores nulos ou indefinidos


  // Se nenhum ID válido for encontrado, limpa e sai
  if (characterIds.length === 0) {
    console.log("Personagens")
    this._characters.set([]); // Limpa o signal
    return;                 // Interrompe o método
  }

  const idsParam = characterIds.join(','); // Ex: "1,2,3"

    // Faz a requisição HTTP para buscar os episódios
  this.charactersService
    .getCharactersByIds(characterIds)
    .subscribe({
      // Quando a resposta chegar com sucesso
      next: (data) => {
        console.log("Buscando personagens com IDs:", idsParam);
        // Atualiza o signal `_episodes` com os dados retornados
        // Se a API retornar um único episódio, transforma em array para manter consistência
        this._characters.set(Array.isArray(data) ? data : [data]);

      },
      // Se ocorrer algum erro na requisição
      error: (err) => {
        console.error('Erro ao carregar personagens', err); // Loga o erro
        this._characters.set([]);                             // Limpa o signal para não exibir dados antigos
      }
    });
}}
