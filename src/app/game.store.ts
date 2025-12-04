// ============================================================================
// IMPORTOVÁNÍ KNIHOVEN
// ============================================================================
// computed - funkce pro vytváření odvozených (computed) signálů z Angular
import { computed } from '@angular/core';
// NgRx Signal Store - nástroje pro správu stavu pomocí signálů:
// - signalStore: hlavní funkce pro vytvoření store
// - withState: přidá počáteční stav do store
// - withComputed: přidá odvozené signály (automaticky se přepočítají při změně)
// - withMethods: přidá metody pro změnu stavu
// - patchState: funkce pro bezpečnou aktualizaci stavu
import { patchState, signalStore, withComputed, withMethods, withState } from '@ngrx/signals';

// ============================================================================
// TYPOVÁNÍ STAVU HRY
// ============================================================================
// Definice struktury stavu hry - TypeScript typ popisující, jaké hodnoty store obsahuje
type GameState = {
  time: number;           // Zbývající čas hry (v sekundách)
  score: number;          // Aktuální skóre hráče
  gameOver: boolean;      // Zda je hra ukončena
  holes: number[];        // Pole identifikátorů děr (např. [1,2,3,4,5])
  gameRunning: boolean;   // Zda hra právě běží
};

// ============================================================================
// POČÁTEČNÍ STAV HRY
// ============================================================================
// Výchozí hodnoty při startu aplikace nebo resetu hry
const initialState: GameState = {
  time: 5,                // Hra trvá 5 sekund
  score: 0,               // Začínáme s nulovým skóre
  gameOver: false,        // Hra není ukončena
  holes: [1, 2, 3, 4, 5], // 5 děr pro krtky
  gameRunning: false      // Hra zatím neběží
};

// ============================================================================
// VYTVOŘENÍ SIGNAL STORE
// ============================================================================
// signalStore vytváří reaktivní úložiště stavu pomocí Angular signálů
// Signály automaticky notifikují všechny komponenty, které je sledují
export const GameStore = signalStore(
  // Konfigurace: 'root' znamená, že store je globální singleton
  // (stejná instance pro celou aplikaci, dostupná všude přes inject())
  { providedIn: 'root' },

  // ========================================================================
  // 1. ZÁKLADNÍ STAV (withState)
  // ========================================================================
  // Přidá počáteční stav do store - vytvoří signály pro každou vlastnost
  // V komponentě pak můžeme použít: store.time(), store.score(), atd.
  withState(initialState),

  // ========================================================================
  // 2. ODVOZENÉ SIGNÁLY (withComputed)
  // ========================================================================
  // Vytváří signály, které se automaticky přepočítají, když se změní jejich závislosti
  // Destrukturování: získáváme přístup k signálům z withState
  withComputed(({ time, score, gameOver, gameRunning }) => ({
    // Odvozený signál pro kontrolu, zda je hra ukončena
    // computed(() => gameOver()) - vytvoří signál, který vrací hodnotu gameOver
    // Když se gameOver změní, všechny komponenty používající isGameOver() se aktualizují
    isGameOver: computed(() => gameOver()),

    // Odvozený signál pro kontrolu, zda hra běží
    isGameRunning: computed(() => gameRunning()),

    // Odvozený signál pro aktuální čas (pro lepší čitelnost v komponentě)
    currentTime: computed(() => time()),

    // Odvozený signál pro aktuální skóre (pro lepší čitelnost v komponentě)
    currentScore: computed(() => score()),
  })),

  // ========================================================================
  // 3. METODY PRO ZMĚNU STAVU (withMethods)
  // ========================================================================
  // Metody, které můžeme volat z komponent pro změnu stavu hry
  // store - přístup k celému store včetně všech signálů a metod
  withMethods((store) => ({
    // Sníží zbývající čas o 1 sekundu
    // patchState - bezpečná funkce pro aktualizaci stavu (immutable update)
    // store.time() - získání aktuální hodnoty signálu (voláním jako funkce)
    decreaseTime(): void {
      patchState(store, { time: store.time() - 1 });
    },

    // Zvýší skóre o 1 bod (když hráč trefí krtka)
    increaseScore(): void {
      patchState(store, { score: store.score() + 1 });
    },

    // Sníží skóre o 1 bod (trest za netrefení krtka)
    decreaseScore(): void {
      patchState(store, { score: store.score() - 1 });
    },

    // Nastaví flagy pro konec hry a běžící stav
    // Používá se pro ukončení hry nebo její zastavení
    setGameOver(gameOver: boolean, gameRunning: boolean): void {
      patchState(store, { gameOver, gameRunning });
    },

    // Spustí novou hru a resetuje stav
    // ...initialState - rozprostře všechny hodnoty z initialState
    // gameRunning: true - přepíše gameRunning na true (protože hra začíná)
    startGame(): void {
      patchState(store, { ...initialState, gameRunning: true });
    },
  }))
);