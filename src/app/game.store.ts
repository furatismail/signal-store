import { computed } from '@angular/core'; // Signal APIs from Angular
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals'; // NgRx signal store helpers

// Shape of the game state
type GameState = {
  time: number;
  score: number;
  gameOver: boolean;
  holes: number[]; // Hole identifiers
  gameRunning: boolean;
};

// Initial state of the game
const initialState: GameState = {
  time: 5, // Game duration
  score: 0, // Initial score
  gameOver: false, // Not over initially
  holes: [1, 2, 3, 4, 5], // Number of holes
  gameRunning: false // Not running initially
};

// Signal-based store definition
export const GameStore = signalStore(
  { providedIn: 'root' }, // Global singleton

  // Base state configuration
  withState(initialState),

  // Derived (computed) signals
  withComputed(({ time, score, gameOver, gameRunning }) => ({
    isGameOver: computed(() => gameOver()), // Is game over?
    isGameRunning: computed(() => gameRunning()), // Is it running?
    currentTime: computed(() => time()), // Current time
    currentScore: computed(() => score()), // Current score
  })),

  // Methods to mutate state
  withMethods((store) => ({
    // Decrease remaining time
    decreaseTime(): void {
      patchState(store, { time: store.time() - 1 });
    },

    // Increase score by 1
    increaseScore(): void {
      patchState(store, { score: store.score() + 1 });
    },

    // Decrease score by 1
    decreaseScore(): void {
      patchState(store, { score: store.score() - 1 });
    },

    // Set game over and running flags
    setGameOver(gameOver: boolean, gameRunning: boolean): void {
      patchState(store, { gameOver, gameRunning });
    },

    // Start the game and reset state
    startGame(): void {
      patchState(store, { ...initialState, gameRunning: true });
    },
  }))
);