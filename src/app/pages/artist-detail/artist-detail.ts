import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArtistDetail as ArtistDetailComponent } from '../../components/artist-detail/artist-detail';

@Component({
    selector: 'app-artist-detail-page',
    imports: [ArtistDetailComponent],
    template: `
    <section class="page">
      <app-artist-detail [artistId]="artistId" />
    </section>
  `,
    styles: [`.page { padding: 0.5rem 0; }`],
})
export default class ArtistDetail implements OnInit {
    private readonly route = inject(ActivatedRoute);
    artistId = '';

    ngOnInit(): void {
        this.route.paramMap.subscribe((params) => {
            this.artistId = params.get('id') ?? '';
        });
    }
}
