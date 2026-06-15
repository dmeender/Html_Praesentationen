import { readFileSync } from "node:fs";
import { join } from "node:path";
import assert from "node:assert/strict";

const root = process.cwd();
const deckPath = join(root, "praesentationen", "geogebra-alltag-dynamisch-klasse-6", "index.html");
const homePath = join(root, "index.html");

const home = readFileSync(homePath, "utf8");
assert.match(home, /praesentationen\/geogebra-alltag-dynamisch-klasse-6\//);
assert.match(home, /GeoGebra im Alltag/);

const deck = readFileSync(deckPath, "utf8");

assert.match(deck, /GeoGebra Classic 6/);
assert.match(deck, /aria-label="GeoGebra im Alltag: Dynamische Konstruktionen in Klasse 6"/);
assert.match(deck, /data-deck/);
assert.match(deck, /deck\.js/);
assert.match(deck, /\.steps li\s*\{[\s\S]*display: block;/);
assert.match(deck, /\.steps li strong\s*\{[\s\S]*display: inline;/);

const requiredTerms = [
  "Zieh-Test",
  "dynamisch",
  "Textaufgabe",
  "Verschiebe-Roboter",
  "Sitzplan",
  "Spiegelbild am See",
  "Schullogo",
  "Schatzkarte",
  "Karussell",
  "Windrad",
  "Geschenkpapier",
  "Mittelsenkrechte",
  "Winkelhalbierende",
  "Pausenhof",
  "Kuchenstück",
  "Bewegen-Werkzeug",
  "GeoGebra-Datei",
  "Alltagssituation"
];

for (const term of requiredTerms) {
  assert.ok(deck.includes(term), `Expected deck to include "${term}"`);
}

const dynamicPrompts = (deck.match(/Ziehe/g) || []).length;
assert.ok(dynamicPrompts >= 8, `Expected at least 8 dynamic drag prompts, found ${dynamicPrompts}`);

const taskCount = (deck.match(/Konstruktionsauftrag/g) || []).length;
assert.ok(taskCount >= 10, `Expected at least 10 construction tasks, found ${taskCount}`);

const slideCount = (deck.match(/<section class="slide/g) || []).length;
assert.ok(slideCount >= 18, `Expected at least 18 slides, found ${slideCount}`);

const navCount = (deck.match(/href="#folie-/g) || []).length;
assert.equal(navCount, slideCount, "Navigation should contain one link per slide");
