import { EpisodesService } from './../../../services/episodes.service';
import { CharactersService } from './../../../services/characters.service';
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
  private _loading = signal<boolean>(true); //indica se ainda está carregando (true no início, false ao terminar).

  constructor(
    private route: ActivatedRoute, //permite acessar parâmetros da rota (por exemplo, /episodes/:id);
    private http: HttpClient, //permite fazer requisições HTTP diretas (para os personagens).
    private charactersService: CharactersService, //centraliza as chamadas de API dos personagens.
    private episodesService: EpisodesService
  ) {}

  // getters para o template
  get character(): Character | null { return this._character(); }
  get episodes(): Episode[] { return this._episodes(); }
  get loading(): boolean { return this._loading(); }

  ngOnInit(): void {
    //snapshot é uma foto instantânea da rota atual (sem reagir a futuras mudanças).
    //paramMap é um objeto que contém os parâmetros da rota.
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchCharacter(id);
    }
  }

  fetchCharacter(id: string): void {
    this.charactersService.getCharacterById(id)
      .subscribe({
        next: (character) => {
          this._character.set(character);
          this.fetchEpisodes(character.episode || []); // Se character.episode existir e não for vazio, usa ele; caso contrário, usa um array vazio [].
        },
        error: (err) => {
          console.error('Erro ao carregar personagem', err);
          this._character.set(null);
          this._episodes.set([]);
        }
      });
  }

  /**
   * O método verifica se existem URLs de episódios e, se não houver, limpa a lista de episódios e sai, garantindo que o app não quebre antes de tentar buscar os dados.
   */
  fetchEpisodes(episodeUrls: string[]): void {
    // Verifica se o array de URLs existe ou está vazio
    if (!episodeUrls || episodeUrls.length === 0) {
      this._episodes.set([]); // Limpa o signal de episódios
      return;                 // Sai do método, nada mais é feito
    }

    // Extrai os IDs dos episódios a partir das URLs
    const episodeIds = episodeUrls
      .map((url) => url.split('/').pop())  // Pega a última parte da URL (ex: "1" de ".../episode/1")
      .filter((id): id is string => !!id); // Remove valores nulos ou indefinidos

    // Se nenhum ID válido for encontrado, limpa e sai
    if (episodeIds.length === 0) {
      this._episodes.set([]); // Limpa o signal
      return;                 // Interrompe o método
    }

    // Cria uma string com os IDs separados por vírgula
    // Para a API aceitar múltiplos episódios de uma vez
    const idsParam = episodeIds.join(','); // Ex: "1,2,3"

    // Faz a requisição HTTP para buscar os episódios
    this.episodesService
      .getEpisodesByIds(episodeIds)
      .subscribe({
        // Quando a resposta chegar com sucesso
        next: (data) => {
          // Atualiza o signal `_episodes` com os dados retornados
          // Se a API retornar um único episódio, transforma em array para manter consistência
          this._episodes.set(Array.isArray(data) ? data : [data]);
        },
        // Se ocorrer algum erro na requisição
        error: (err) => {
          console.error('Erro ao carregar episódios', err); // Loga o erro
          this._episodes.set([]);                             // Limpa o signal para não exibir dados antigos
        }
      });
  }

}
