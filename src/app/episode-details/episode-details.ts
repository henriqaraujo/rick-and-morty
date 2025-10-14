import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EpisodesService } from '../services/episodes.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-episode-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './episode-details.html',
  styleUrls: ['./episode-details.scss']
})
export class EpisodeDetailsComponent implements OnInit {
  episode: any;

  constructor(
    private route: ActivatedRoute,
    private episodesService: EpisodesService
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.episodesService.getEpisodeById(id).subscribe((data) => {
      this.episode = data;
    });
  }
}
