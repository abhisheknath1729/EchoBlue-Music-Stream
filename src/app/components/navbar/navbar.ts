import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-navbar',
    imports: [RouterLink, RouterLinkActive, MatToolbarModule, MatButtonModule, MatIconModule],
    templateUrl: './navbar.html',
    styleUrl: './navbar.css',
})
export class Navbar {
    private readonly userService = inject(UserService);

    readonly navLinks = [
        { path: '/songs', label: 'Songs', icon: 'library_music' },
        { path: '/artists', label: 'Artists', icon: 'people' },
        { path: '/playlists', label: 'Playlists', icon: 'queue_music' },
        { path: '/now-playing', label: 'Now Playing', icon: 'headphones' },
    ];

    isDarkMode = true;

    constructor() {
        this.userService.userPreferences$.subscribe((prefs) => {
            this.isDarkMode = prefs.darkMode;
        });
    }

    toggleTheme(): void {
        this.isDarkMode = !this.isDarkMode;
        this.userService.updatePreferences({ darkMode: this.isDarkMode });
        document.documentElement.setAttribute(
            'data-theme',
            this.isDarkMode ? 'dark' : 'light'
        );
    }
}
