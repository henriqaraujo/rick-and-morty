import { Component, OnInit } from '@angular/core';
import { EpisodesService } from '../services/episodes.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episodes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episodes.html',
  styleUrls: ['./episodes.scss']
})
export class EpisodesComponent implements OnInit {
  episodes: any[] = [];

  constructor(private episodesService: EpisodesService, private router: Router) {}

  ngOnInit(): void {
    this.episodesService.getEpisodes().subscribe((data) => {
      console.log('Retorno da API:', data);
      this.episodes = data.results;
    });
  }

  goToEpisode(id: number) {
    this.router.navigate(['/episode', id]);
  }
}
