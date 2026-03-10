import {
    Directive,
    ElementRef,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Renderer2,
    SimpleChanges,
    inject,
} from '@angular/core';
import { AudioService } from '../services/audio.service';
import { Subscription } from 'rxjs';

/**
 * Highlights the host element when the given song ID matches the
 * currently playing track.
 *
 * Usage:
 *   <div [appHighlightPlaying]="song.id">…</div>
 *
 * The directive applies:
 *  • a glowing left-border accent
 *  • a subtle background tint
 *  • a pulsing animation while the song is actively playing
 *
 * All styles are removed automatically when a different song plays.
 */
@Directive({
    selector: '[appHighlightPlaying]',
    standalone: true,
})
export class HighlightPlayingDirective implements OnInit, OnChanges, OnDestroy {
    private readonly el = inject(ElementRef);
    private readonly renderer = inject(Renderer2);
    private readonly audioService = inject(AudioService);
    private sub!: Subscription;

    /** The song ID this element represents */
    @Input('appHighlightPlaying') songId = '';

    private currentSongId: string | null = null;
    private isPlaying = false;

    ngOnInit(): void {
        this.sub = this.audioService.playbackState$.subscribe((state) => {
            this.currentSongId = state.song?.id ?? null;
            this.isPlaying = state.playing;
            this.applyStyles();
        });
    }

    ngOnChanges(_changes: SimpleChanges): void {
        this.applyStyles();
    }

    ngOnDestroy(): void {
        this.sub?.unsubscribe();
    }

    private applyStyles(): void {
        const el = this.el.nativeElement as HTMLElement;
        const isMatch = !!this.songId && this.songId === this.currentSongId;

        if (isMatch) {
            this.renderer.setStyle(el, 'borderLeft', '3px solid #60a5fa');
            this.renderer.setStyle(
                el,
                'background',
                'rgba(96, 165, 250, 0.08)',
            );
            this.renderer.setStyle(
                el,
                'boxShadow',
                '0 0 16px rgba(96, 165, 250, 0.1)',
            );
            this.renderer.setStyle(el, 'transition', 'all 0.3s ease');

            if (this.isPlaying) {
                this.renderer.setStyle(
                    el,
                    'animation',
                    'highlightPulse 2s ease-in-out infinite',
                );
            } else {
                this.renderer.removeStyle(el, 'animation');
            }
        } else {
            this.renderer.removeStyle(el, 'borderLeft');
            this.renderer.removeStyle(el, 'background');
            this.renderer.removeStyle(el, 'boxShadow');
            this.renderer.removeStyle(el, 'animation');
        }
    }
}
