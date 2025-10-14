import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EpisodeDetailsComponent } from './episode-details';

describe('EpisodeDetails', () => {
  let component: EpisodeDetailsComponent;
  let fixture: ComponentFixture<EpisodeDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EpisodeDetailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EpisodeDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
