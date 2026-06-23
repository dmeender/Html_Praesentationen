import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const deckPath = join(root, "praesentationen", "excel-notenrechner-klasse-9", "index.html");
const homePath = join(root, "index.html");

const home = readFileSync(homePath, "utf8");
assert.match(home, /praesentationen\/excel-notenrechner-klasse-9\//);
assert.match(home, /Excel kennenlernen/);

const deck = readFileSync(deckPath, "utf8");

assert.match(deck, /aria-label="Excel kennenlernen: Zeugnisnoten-Rechner Klasse 9"/);
assert.match(deck, /data-deck/);
assert.match(deck, /deck\.js/);
assert.match(deck, /Excel auf Windows/);

const requiredTerms = [
  "Zeugnisnoten-Rechner",
  "Wenn du nicht weiterkommst",
  "Leere Arbeitsmappe",
  "Datei",
  "Speichern unter",
  "MITTELWERT",
  "MIN",
  "MAX",
  "ANZAHL",
  "Bedingte Formatierung",
  "Säulendiagramm",
  "SUMMENPRODUKT",
  "Notenverbesserungs-Simulator",
  "WENN",
  "Taschengeld-Planer",
  "Klassenumfrage",
  "Sportturnier-Tabelle",
  "Lernzeit-Tracker"
];

for (const term of requiredTerms) {
  assert.ok(deck.includes(term), `Expected deck to include "${term}"`);
}

const helperCount = (deck.match(/Wenn du nicht weiterkommst/g) || []).length;
assert.ok(helperCount >= 12, `Expected at least 12 fallback hints, found ${helperCount}`);

const challengeCount = (deck.match(/Challenge/g) || []).length;
assert.ok(challengeCount >= 3, `Expected at least 3 challenge markers, found ${challengeCount}`);

const slideCount = (deck.match(/<section class="slide/g) || []).length;
assert.ok(slideCount >= 24, `Expected at least 24 slides, found ${slideCount}`);

const navCount = (deck.match(/href="#folie-/g) || []).length;
assert.equal(navCount, slideCount, "Navigation should contain one link per slide");
