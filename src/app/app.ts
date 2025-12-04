import { AsyncPipe, JsonPipe } from '@angular/common'; // Angular common pipes and directives
import { Component, ElementRef, inject, viewChildren } from '@angular/core'; // Core Angular APIs

import { GameStore } from './game.store';

@Component({
  selector: 'app-root', // Root selector
  standalone: true, // Standalone component
  templateUrl: './app.html', // Template file
  styleUrls: ['./app.scss'], // Styles file
  imports: [AsyncPipe, JsonPipe] // Imported pipes/directives for template
})
export class App {
  // Injecting GameStore as a signal-based reactive store
  gameStore = inject(GameStore);

  // Fetching static hole array (used to loop in template)
  holes = this.gameStore.holes();

  // Get references to each hole element
  holesRef = viewChildren('holeRef', { read: ElementRef<HTMLDivElement> });

  // Using signals from the store (used with `signal()` return)
  time = this.gameStore.currentTime;
  score = this.gameStore.currentScore;
  gameOver = this.gameStore.isGameOver;
  gameRunning = this.gameStore.isGameRunning;

  // Method to start game
  startGame() {
    this.gameStore.startGame(); // Reset state and start

    const timerId = setInterval(() => {
      this.gameStore.decreaseTime(); // Decrement time by 1
      if (this.gameStore.currentTime() === 0) { // If time runs out
        this.gameStore.setGameOver(true, false); // Mark game over
        clearInterval(timerId); // Stop timer
      }
    }, 1000);

    this.moleAppear(); // Start showing moles
  }

  // Called when user clicks (whacks) a hole
  whack(hole: HTMLDivElement) {
    if (this.gameOver()) return; // Skip if game is over

    if (hole.classList.contains('up')) { // If mole is up
      this.gameStore.increaseScore(); // Increase score
      hole.classList.remove('up'); // Remove mole
      hole.classList.add('hit'); // Show hit effect
      setTimeout(() => {
        hole.classList.remove('hit'); // Remove effect after 0.5s
      }, 500);
    }
  }

  // Handle mole appearance logic
  moleAppear() {
    const randomIndex = Math.floor(Math.random() * this.holesRef().length); // Random hole index

    const randomHoleElement = this.holesRef()[randomIndex]?.nativeElement; // Get element
    randomHoleElement.classList.add('up'); // Show mole

    const timerId = setTimeout(() => {
      if (!randomHoleElement.classList.contains('hit')) {
        this.gameStore.decreaseScore(); // Penalize if missed
      }

      randomHoleElement.classList.remove('up'); // Hide mole
      if (!this.gameOver()) {
        this.moleAppear(); // Show next mole
      } else {
        clearTimeout(timerId); // Stop timeout on game over
      }
    }, 1000);
  }
}