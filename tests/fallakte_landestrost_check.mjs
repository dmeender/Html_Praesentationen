import { readFileSync } from 'node:fs';

const file = 'fallakte-01-landesverderb.html';
const html = readFileSync(file, 'utf8');

const requiredSnippets = [
  '<!doctype html>',
  'Fallakte 01: Landesverderb',
  'Ermittlung beginnen',
  'Dieser Fall ist für die Nutzung vor Ort am Schloss Landestrost konzipiert.',
  'Welche Ausgangshypothese verfolgen Sie?',
  'Beweisstück A',
  'Beweisstück B',
  'Beweisstück C',
  'Beweisstück D',
  'Schlussurteil',
  'Vor dem Schloss Landestrost',
  'Schlossfassade, Wall- und Befestigungsbereich',
  'Altstadt / Weg vom Schloss in Richtung historisches Zentrum',
  'Marktplatz / historischer Stadtraum',
  'War der Spottname Landesverderb gerechtfertigt?',
  'Historische Einordnung',
  'Fall erneut spielen',
  'Ermittlungsnotizen anzeigen',
  'Notizen kopieren',
  'Fortschritt zurücksetzen',
  'Ortsbeobachtung erforderlich',
  'Gebäudeprotokoll',
  'Beobachtung vor Ort sichern',
  'Geländeprotokoll',
  'Missionsauswertung',
  'Ermittlungsqualität',
  'Renaissance',
  'Welfen',
  'Calenberg-Göttingen',
  'Beobachtungsdichte',
  'data-observation',
  'localStorage',
  'navigator.clipboard',
  'execCommand',
];

for (const snippet of requiredSnippets) {
  if (!html.includes(snippet)) {
    throw new Error(`Missing required snippet: ${snippet}`);
  }
}

const forbiddenPatterns = [
  /<script\s+[^>]*src=/i,
  /<link\s+[^>]*href=/i,
  /<img\s+[^>]*src=/i,
  /https?:\/\//i,
  /@import/i,
];

for (const pattern of forbiddenPatterns) {
  if (pattern.test(html)) {
    throw new Error(`External dependency or forbidden resource matched: ${pattern}`);
  }
}

const stationCount = (html.match(/class="station/g) || []).length;
if (stationCount < 4) {
  throw new Error(`Expected at least 4 station sections, found ${stationCount}`);
}

const observationCount = (html.match(/data-observation=/g) || []).length;
if (observationCount < 16) {
  throw new Error(`Expected at least 16 site observation options, found ${observationCount}`);
}

if (!html.includes('function canAssessStation')) {
  throw new Error('Expected station assessment gating based on site observations');
}

if (!html.includes('function calculateMissionAssessment')) {
  throw new Error('Expected final mission assessment function');
}

const minFontMatch = html.match(/font-size:\s*18px/);
if (!minFontMatch) {
  throw new Error('Expected base font-size of at least 18px');
}

console.log('fallakte_landestrost_check passed');
