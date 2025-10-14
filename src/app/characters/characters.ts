import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Character {
  id: number;
  name: string;
  species: string;
  status: string;
  image: string;
}

@Component({
  selector: 'app-characters',
  templateUrl: './characters.html',
  standalone: true,
  imports: [CommonModule],
  styleUrls: ['./characters.scss'],
})
export class Characters implements OnInit {
  characters: Character[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.fetchCharacters();
  }

  fetchCharacters(): void {
    // Altere a URL abaixo para a URL real da sua API
    this.http.get<any>('https://rickandmortyapi.com/api/character').subscribe({
      next: (response) => {
        // Supondo que a API retorne um array de personagens
        this.characters = response.results || response;
      },
      error: (error) => {
        console.error('Erro ao buscar personagens:', error);
      },
    });
  }

  goToDetails(id: number): void {
    this.router.navigate(['/personagem', id]);
  }
}
