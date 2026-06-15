import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const deckPath = join(root, "praesentationen", "geogebra-abbildungen-klasse-6", "index.html");
const homePath = join(root, "index.html");

const home = readFileSync(homePath, "utf8");
assert.match(home, /praesentationen\/geogebra-abbildungen-klasse-6\//);
assert.match(home, /GeoGebra/);

const deck = readFileSync(deckPath, "utf8");

assert.match(deck, /GeoGebra Classic 6/);
assert.match(deck, /aria-label="GeoGebra kennenlernen: Abbildungen in Klasse 6"/);
assert.match(deck, /data-deck/);
assert.match(deck, /deck\.js/);

const requiredTerms = [
  "Verschiebung",
  "Achsenspiegelung",
  "Punktspiegelung",
  "Drehung",
  "Bewegen-Werkzeug",
  "Rückgängig",
  "Werkzeugleiste",
  "Eingabezeile",
  "Schülerauftrag",
  "Hilfestellung"
];

for (const term of requiredTerms) {
  assert.ok(deck.includes(term), `Expected deck to include "${term}"`);
}

const slideCount = (deck.match(/<section class="slide/g) || []).length;
assert.ok(slideCount >= 14, `Expected at least 14 slides, found ${slideCount}`);

const navCount = (deck.match(/href="#folie-/g) || []).length;
assert.equal(navCount, slideCount, "Navigation should contain one link per slide");
