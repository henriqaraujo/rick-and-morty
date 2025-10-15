import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { CharactersService } from '../../services/characters.service';

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

  constructor(private charactersService: CharactersService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCharacters();
  }

  fetchCharacters(): void {
    this.charactersService.getAllCharacters().subscribe({
      next: (res) => this.characters = res.results,
      error: (err) => console.error(err)
    });
  }

  goToCharacter(id: number): void {
    this.router.navigate(['/character', id]);
  }
}
