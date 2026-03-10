import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Navbar } from './components/navbar/navbar';
import { SongPlayer } from './components/song-player/song-player';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Navbar, SongPlayer],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App { }
