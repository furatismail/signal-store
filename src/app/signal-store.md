# NgRx Signal Store - Zápisky

## 📦 withState

### Co dělá

`withState(initialState)` vytváří signály pro všechny vlastnosti stavu (např. `time`, `score`, `gameOver`, ...).

Tyto signály jsou pak dostupné ve store jako funkce:
```typescript
store.time()    // čtení hodnoty
store.score()   // čtení hodnoty
store.gameOver() // čtení hodnoty
```

Zároveň tím definuješ typ a tvar stavu (`GameState`), takže celý store je plně typovaný.

### Proč je to důležité?

Bez `withState` by store neměl žádný vlastní stav – byl by to jen objekt s metodami. Stav by sis musel vytvořit ručně pomocí `signal()` a pak ho nějak integrovat do store.

### 🔑 Proč nepřistupovat "napřímo"?

U Signal Store neexistuje přímý přístup ve stylu `store.time = 5`. 

`withState` vytváří **read-only signály**, takže:
- ✅ **Čtení** je možné: `store.time()`
- ❌ **Zápis zvenku** není možný: `store.time.set(...)` zvenku nefunguje

Zápis stavu je záměrně schovaný za metodami a `patchState`.

**Výhody tohoto přístupu:**
- Předvídatelnost – víš přesně, kde se stav mění
- Testovatelnost – logika je centralizovaná
- Méně chaosu – komponenty nemohou náhodně měnit stav

---

## 🧮 withComputed

### Co dělá

`withComputed(({ time, score, gameOver, gameRunning }) => ({ ... }))`:

1. Vezme signály ze stavu (`time`, `score`, ...)
2. Vytvoří nad nimi **odvozené (computed) signály**:

```typescript
isGameOver: computed(() => gameOver())
currentTime: computed(() => time())
currentScore: computed(() => score())
```

Tyto computed signály se **automaticky přepočítají**, když se změní jejich závislosti.

### Výhody

- **Centralizovaná logika** – nemusíš psát logiku typu "když `time === 0`, tak hra skončila" pořád dokola v komponentách
- **Čistší komponenty** – komponenta jen používá `store.isGameOver()`
- **Automatická reaktivita** – změny se propagují automaticky

---

## ⚙️ withMethods

### Co dělá

`withMethods((store) => ({ ... }))` přidá do store metody, které pracují se stavem a computed signály.

### Přístup uvnitř metod

Uvnitř metod máš přístup k:
- **Čtení**: `store.time()` – získání aktuální hodnoty
- **Zápis**: `patchState(store, { ... })` – bezpečná aktualizace stavu

### Příklad

```typescript
increaseScore(): void {
  patchState(store, { score: store.score() + 1 });
}
```

### Důsledky

**Pro komponenty:**
- Komponenty neřeší, **jak** se stav mění
- Jen volají metody: `this.gameStore.increaseScore()`

**Pro architekturu:**
- Logika zůstává ve store → lépe testovatelné
- Komponenty jsou čistší (jen UI)
- Můžeš změnit implementaci (např. přidat podmínku) a komponenty to nepoznají

---

## 🔄 patchState

### Co dělá

`patchState(store, partialState)` bezpečně aktualizuje stav po částech:

1. Vezme aktuální stav
2. Mergne do něj změny (partial objekt)
3. Zachová **immutabilitu** (vytvoří nový objekt stavu, nepatlá přímo do starého)

### Příklad

```typescript
patchState(store, { time: store.time() - 1 });
```

### Proč je to dobré?

- **Nemusíš ručně psát**: `setState({ ...state, time: state.time - 1 })`
- **Jednotný způsob** změny stavu ve store
- **Snadné ladění a logování** – NgRx ekosystém, devtools, případně další featury

---

## 🤔 Proč vůbec používat withState, když "můžu přímo do store"?

### Dva světy Signal Store

**Čtení stavu** → signály z `withState` a `withComputed`
```typescript
store.time()
store.isGameRunning()
store.currentScore()
```

**Zápis stavu** → metody z `withMethods` + `patchState`
```typescript
store.decreaseTime()
store.startGame()
```

### Co by se stalo, kdybys to dělal "napřímo"?

Měl bys tendenci psát:
```typescript
store.time = 0;
store.score++;
store.gameOver = true;
```

**Problémy:**
- ❌ Obchází reaktivitu a signály
- ❌ Rozbíjí koncept jednotného místa pro změny stavu
- ❌ Dělá z komponent "mini-stores" s logikou, kterou nechceš

### Architektonický vzor

`withState` + `withMethods` ti dává jasný vzor:

- **Store = Model** – obsahuje data, computed hodnoty, logiku
- **Komponenty = View** – jen zobrazí data a volají metody

---

## 📝 Shrnutí

| Funkce | Účel |
|--------|------|
| `withState` | Definuje signálový stav (co store obsahuje) |
| `withComputed` | Definuje odvozené hodnoty (co z toho stavu vypočítáme) |
| `withMethods` | Definuje akce / logiku, která stav mění |
| `patchState` | Konzistentní a bezpečný způsob, jak aktualizovat stav |

---

## 💡 Další krok

Pokud chceš, můžeme si napsat ještě minimalistický store **BEZ Signal Store** (jen s `signal()` a `computed()`), abys viděl, co všechno ti ten `withState`/`withComputed`/`withMethods` balík ušetří.
