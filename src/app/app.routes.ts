import { Character } from './models/characters';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodeListComponent } from './pages/episodes/list/episode-list.component';
import { HomeComponent } from './pages/home/home.component';
import { EpisodeDetailComponent } from './pages/episodes/detail/episode-detail.component';
import { CharacterListComponent } from './pages/characters/list/character-list.component';
import { CharacterDetail } from './pages/characters/detail/character-detail.component';

export const routes: Routes = [
  { path: 'home', component: HomeComponent, title: 'Dashboard' },
  { path: 'episodes', component: EpisodeListComponent, title: 'Episódios' },
  { path: 'episodes/:id', component: EpisodeDetailComponent, title: 'Detalhe do episódio' },
  { path: 'characters', component: CharacterListComponent, title: 'Personagens' },
  { path: 'characters/:id', component: CharacterDetail, title: 'Dethale do Personagem' },
  { path: '**', redirectTo: '/home' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}


