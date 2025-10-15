import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { EpisodesService } from '../../services/episodes.service';
import { Episode } from '../../models/episodes';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episodes.html',
  styleUrls: ['./episodes.scss']
})
export class EpisodesComponent implements OnInit {
episodes: Episode[] = [];

  constructor(private episodesService: EpisodesService, private router: Router) {}

  
  ngOnInit(): void {
    this.fetchEpisodes();
  }

  //Função para buscar todos os episódios
  fetchEpisodes(): void {
    this.episodesService.getAllEpisodes().subscribe({
      next: (res) => this.episodes = res.results,
      error: (err) => console.error(err)
    });
  }

  //Função para ir até os detalhes do episódio
  goToEpisode(id: number): void {
    this.router.navigate(['/episode', id]);
  }
}
