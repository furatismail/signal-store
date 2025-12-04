import { Component, inject } from '@angular/core';
import { GameStore } from './game.store';

@Component({
  selector: 'app-game-child',
  template: `
    <div class="game-child">
      <h3>Child Komponenta</h3>
      <div class="child-info">
        <p>Čas: <strong>{{ gameStore.currentTime() }}</strong></p>
        <p>Skóre: <strong>{{ gameStore.currentScore() }}</strong></p>
        <p>Hra běží: <strong>{{ gameStore.isGameRunning() ? 'Ano' : 'Ne' }}</strong></p>
        <p>Hra ukončena: <strong>{{ gameStore.isGameOver() ? 'Ano' : 'Ne' }}</strong></p>
      </div>
      
      <div class="child-actions">
        <button (click)="gameStore.increaseScore()">+1 Skóre</button>
        <button (click)="gameStore.decreaseScore()">-1 Skóre</button>
        <button (click)="gameStore.decreaseTime()">-1 Čas</button>
      </div>

      <div class="child-note">
        <small>💡 Tato komponenta sdílí stejný store instance jako parent komponenta.</small>
        <small>Když změníš stav v parent, automaticky se aktualizuje i zde a naopak.</small>
      </div>
    </div>
  `,
  styles: [`
    .game-child {
      padding: 20px;
      border: 2px solid #2196F3;
      border-radius: 8px;
      margin: 20px 0;
      background-color: #f0f7ff;
    }

    .child-info {
      background: white;
      padding: 15px;
      border-radius: 4px;
      margin: 10px 0;
    }

    .child-info p {
      margin: 8px 0;
    }

    .child-actions {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
      margin: 15px 0;
    }

    .child-actions button {
      padding: 8px 12px;
      background-color: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
    }

    .child-actions button:hover {
      background-color: #1976D2;
    }

    .child-note {
      margin-top: 15px;
      padding: 10px;
      background-color: #e3f2fd;
      border-radius: 4px;
      border-left: 4px solid #2196F3;
    }

    .child-note small {
      display: block;
      color: #555;
      line-height: 1.5;
    }
  `]
})
export class GameChildComponent {
  // Inject GameStore - získává stejnou instanci jako parent komponenta
  // Protože je store zaregistrován v parent komponentě jako provider,
  // obě komponenty sdílejí stejnou instanci store
  gameStore = inject(GameStore);
}

