# HTML-Präsentationen

Statische HTML-Präsentationen für GitHub Pages.

## Struktur

- `index.html` ist die Übersichtsseite.
- Jede Präsentation liegt in einem eigenen Ordner unter `praesentationen/`.
- Jede Präsentation hat eine eigene `index.html`.

## Veröffentlichung

GitHub Pages sollte auf `main` und `/ (root)` zeigen.

## Präsentationssteuerung

Präsentationen können die gemeinsame Steuerung aus `assets/deck.js` nutzen:

- `Leertaste`: nächstes markiertes Element einblenden, danach nächste Folie
- `Pfeil rechts`: wie Leertaste
- `Pfeil links`: vorherigen Schritt ausblenden oder zur vorherigen Folie
- `Home`: erste Folie
- `Ende`: letzte Folie
- `Shift + N`: Moderationsnotizen ein- oder ausblenden

Eine Präsentation bindet die Steuerung so ein:

```html
<main class="slides" data-deck>
  <section class="slide">
    <h2>Beispiel</h2>
    <p>Dieser Text ist sofort sichtbar.</p>
    <p data-step>Dieser Text erscheint per Leertaste.</p>

    <aside class="speaker-notes">
      <strong>Moderationsnotiz</strong>
      <p>Hinweis fuer die Moderation.</p>
    </aside>
  </section>
</main>

<script src="../../assets/deck.js"></script>
```

## Gestaltungsregel

Einblendungen werden sparsam eingesetzt. Standard ist: Inhalte sind sofort
sichtbar. `data-step` wird nur genutzt, wenn es die Moderation klarer macht,
zum Beispiel bei Agenda-Punkten, Vergleichen, einzelnen Kennzahlen oder einem
Fazit. Als Richtwert: 0 bis 3 Einblendungen pro Folie, mehr nur in begruendeten
Ausnahmen.
