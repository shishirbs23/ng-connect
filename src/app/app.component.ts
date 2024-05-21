import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// Firebase
import { initializeApp } from 'firebase/app';

// Environment
import { environment } from '../environments/environment.prod';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'ng-connect';

  ngOnInit() {
    initializeApp(environment.firebase);
  }
}
