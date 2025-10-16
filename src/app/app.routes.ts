import { Character } from './models/characters';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesComponent } from './pages/episodes/list/episodes';
import { Home } from './pages/home/home';
import { EpisodeDetailsComponent } from './pages/episodes/details/episode-details';
import { CharacterList } from './pages/characters/list/character-list';
import { CharacterDetail } from './pages/characters/detail/character-detail';

export const routes: Routes = [
  { path: 'home', component: Home, title: 'Dashboard' },
  { path: 'episodes', component: EpisodesComponent, title: 'Episódios' },
  { path: 'episodes/:id', component: EpisodeDetailsComponent, title: 'Detalhe do episódio' },
  { path: 'characters', component: CharacterList, title: 'Personagens' },
  { path: 'characters/:id', component: CharacterDetail, title: 'Dethale do Personagem' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


