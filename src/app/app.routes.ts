import { Character } from './models/characters';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesComponent } from './pages/episodes/list/episodes';
import { Home } from './pages/home/home';
import { EpisodeDetailsComponent } from './pages/episodes/details/episode-details';
import { CharacterList } from './pages/characters/list/character-list';
import { CharacterDetail } from './pages/characters/detail/character-detail';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'episodes', component: EpisodesComponent },
  { path: 'episodes/:id', component: EpisodeDetailsComponent },
  { path: 'characters', component: CharacterList },
  { path: 'characters/:id', component: CharacterDetail },
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


