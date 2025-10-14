import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EpisodesComponent } from './episodes/episodes';
import { EpisodeDetailsComponent } from './episode-details/episode-details';

export const routes: Routes = [
  { path: '', component: EpisodesComponent },
  { path: 'episode/:id', component: EpisodeDetailsComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
