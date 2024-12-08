import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SlideModalComponent } from 'platinum-cmp';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, SlideModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Platinum';
}
