import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../../services/characters.service';
import { Character } from '../../../models/characters';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-character-list',
  standalone: true,
  templateUrl: './character-list.html',
  styleUrls: ['./character-list.scss'],
  imports: [CommonModule],
})
export class CharacterList implements OnInit {

  // Signals — estados reativos
  private _characters = signal<Character[]>([]);
  private _loading = signal<boolean>(true);

  constructor(
    private _characterService: CharactersService,
    private _router: Router,
    private _route: ActivatedRoute,
  ) {}

  // Getters para template
  get characters(): Character[] {
    return this._characters();
  }

  get loading(): boolean {
    return this._loading();
  }

  ngOnInit(): void {
    this.fetchAllCharacters();
  }

  // Método para buscar todos os personagens
  fetchAllCharacters(): void {
    this._loading.set(true);

    this._characterService.getAllCharacters().subscribe({
      next: (response) => {
        this._characters.set(response.results);
        this._loading.set(false);
      },
      error: (err) => {
        console.error('Erro ao buscar personagens:', err);
        this._loading.set(false);
      },
    });
  }

  goToCharacter(id: number): void {
  this._router.navigate(['/characters', id]);
}
}
