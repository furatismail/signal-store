import { Component, inject } from '@angular/core';
import { GameStore } from './game.store';
import { GameChildComponent } from './game-child.component';

@Component({
  selector: 'app-game-parent',
  imports: [GameChildComponent],
  // Zaregistruj GameStore jako provider pro tuto komponentu a její děti
  // Tím se vytvoří jedna instance store, kterou sdílejí parent i child komponenty
  providers: [GameStore],
  template: `
    <div class="game-parent">
      <h2>Parent Komponenta</h2>
      <div class="parent-info">
        <p>Čas: <strong>{{ gameStore.currentTime() }}</strong></p>
        <p>Skóre: <strong>{{ gameStore.currentScore() }}</strong></p>
        <p>Hra běží: <strong>{{ gameStore.isGameRunning() ? 'Ano' : 'Ne' }}</strong></p>
        <p>Hra ukončena: <strong>{{ gameStore.isGameOver() ? 'Ano' : 'Ne' }}</strong></p>
      </div>
      
      <div class="parent-actions">
        <button (click)="gameStore.increaseScore()">Zvýšit skóre</button>
        <button (click)="gameStore.decreaseTime()">Snížit čas</button>
        <button (click)="gameStore.startGame()">Spustit hru</button>
        <button (click)="gameStore.setGameOver(true, false)">Ukončit hru</button>
      </div>

      <hr>
      
      <!-- Child komponenta - sdílí stejný store instance -->
      <app-game-child></app-game-child>
    </div>
  `,
  styles: [`
    .game-parent {
      padding: 20px;
      border: 2px solid #4CAF50;
      border-radius: 8px;
      margin: 20px;
      background-color: #f0f8f0;
    }

    .parent-info {
      background: white;
      padding: 15px;
      border-radius: 4px;
      margin: 10px 0;
    }

    .parent-info p {
      margin: 8px 0;
    }

    .parent-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 15px 0;
    }

    .parent-actions button {
      padding: 10px 15px;
      background-color: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .parent-actions button:hover {
      background-color: #45a049;
    }

    hr {
      margin: 20px 0;
      border: 1px solid #ddd;
    }
  `]
})
export class GameParentComponent {
  // Inject GameStore - získává instanci z providers této komponenty
  gameStore = inject(GameStore);
}

