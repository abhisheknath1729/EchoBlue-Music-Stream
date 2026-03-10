import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        redirectTo: 'songs',
        pathMatch: 'full',
    },
    {
        path: 'songs',
        loadComponent: () => import('./pages/songs/songs'),
        title: 'EchoBlue — Songs',
    },
    {
        path: 'artists',
        loadComponent: () => import('./pages/artists/artists'),
        title: 'EchoBlue — Artists',
    },
    {
        path: 'artists/:id',
        loadComponent: () => import('./pages/artist-detail/artist-detail'),
        title: 'EchoBlue — Artist',
    },
    {
        path: 'playlists',
        loadComponent: () => import('./pages/playlists/playlists'),
        title: 'EchoBlue — Playlists',
    },
    {
        path: 'now-playing',
        loadComponent: () => import('./pages/now-playing/now-playing'),
        title: 'EchoBlue — Now Playing',
    },
    {
        path: 'login',
        loadComponent: () => import('./pages/login/login'),
        title: 'EchoBlue — Login',
    },
    {
        path: 'feedback',
        loadComponent: () => import('./pages/feedback/feedback'),
        title: 'EchoBlue — Feedback',
    },
    {
        path: '**',
        redirectTo: 'songs',
    },
];
