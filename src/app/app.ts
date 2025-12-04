import { Component } from '@angular/core';
import { GameParentComponent } from './game-parent.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [GameParentComponent],
  template: `
    <div class="app-container">
      <h1>Signal Store Demo - Parent & Child Komponenty</h1>
      <app-game-parent></app-game-parent>
    </div>
  `,
  styles: [`
    .app-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 20px;
    }

    h1 {
      text-align: center;
      color: #333;
      margin-bottom: 30px;
    }
  `]
})
export class App {
}