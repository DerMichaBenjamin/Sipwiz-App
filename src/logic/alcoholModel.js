import { hoursBetween, humanDuration } from '../utils/date';

export const DRINK_PRESETS = {
  beer: { label: 'Bier', icon: '🍺', ml: 300, abv: 5.0, step: 100 },
  wine: { label: 'Wein', icon: '🍷', ml: 100, abv: 12.5, step: 100 },
  cocktail: { label: 'Cocktail', icon: '🍸', ml: 200, abv: 15.0, step: 100 },
  shot: { label: 'Shot', icon: '🥃', ml: 20, abv: 40.0, step: 20 },
  soft: { label: 'Alkoholfrei', icon: '💧', ml: 300, abv: 0, step: 100 }
};

const ETHANOL_DENSITY = 0.789;
const DEFAULT_METABOLISM_PER_HOUR = 0.12;

export function gramsAlcohol(ml, abv) {
  return Number(ml || 0) * (Number(abv || 0) / 100) * ETHANOL_DENSITY;
}

export function drinkUnits(drink) {
  // Eine Einheit entspricht hier grob 12 g Ethanol. Das ist kein offizieller Grenzwert,
  // sondern nur eine interne Orientierung für die App-Logik.
  return gramsAlcohol(drink.ml, drink.abv) / 12;
}

export function sumDrinks(session) {
  const drinks = session?.drinks ?? [];
  return drinks.reduce(
    (acc, drink) => {
      const grams = gramsAlcohol(drink.ml, drink.abv);
      acc.count += drink.abv > 0 ? 1 : 0;
      acc.alcoholicMl += drink.abv > 0 ? Number(drink.ml || 0) : 0;
      acc.softMl += drink.abv <= 0 ? Number(drink.ml || 0) : 0;
      acc.grams += grams;
      acc.units += grams / 12;
      if (drink.type === 'shot') acc.shots += 1;
      return acc;
    },
    { count: 0, alcoholicMl: 0, softMl: 0, grams: 0, units: 0, shots: 0 }
  );
}

export function mealFactor(session) {
  const meals = session?.meals ?? [];
  if (!meals.length) return 1;
  const points = meals.reduce((sum, meal) => {
    if (meal.size === 'large') return sum + 3;
    if (meal.size === 'medium') return sum + 2;
    return sum + 1;
  }, 0);
  return Math.max(0.75, 1 - points * 0.05);
}

export function waterSupport(session) {
  const { softMl, alcoholicMl } = sumDrinks(session);
  if (softMl <= 0) return 0;
  if (alcoholicMl <= 0) return 0.15;
  return Math.min(0.25, softMl / Math.max(800, alcoholicMl) * 0.2);
}

export function estimateAlcohol(session, user) {
  const totals = sumDrinks(session);
  const sex = user?.gender ?? 'other';
  const weight = Number(user?.weight || 80);
  const r = sex === 'female' ? 0.55 : sex === 'male' ? 0.68 : 0.62;
  const start = session?.startedAt;
  const nowIso = new Date().toISOString();
  const hours = hoursBetween(start, nowIso);
  const absorbedGrams = totals.grams * mealFactor(session);
  const rawPromille = absorbedGrams / Math.max(45, weight * r);
  const estimatedPromille = Math.max(0, rawPromille - DEFAULT_METABOLISM_PER_HOUR * hours);
  const minutesUntilLower = Math.ceil((estimatedPromille / DEFAULT_METABOLISM_PER_HOUR) * 60);

  const waterBonus = waterSupport(session);
  const mealBonus = 1 - mealFactor(session);
  const impairment = Math.min(1, estimatedPromille / 1.4);

  const body = clampScore(10 - impairment * 6 + waterBonus * 2 + mealBonus * 3);
  const mind = clampScore(10 - impairment * 7 + waterBonus * 1.5);
  const control = clampScore(10 - impairment * 7.5 + waterBonus * 1.2);

  return {
    promille: Number(estimatedPromille.toFixed(2)),
    grams: Number(totals.grams.toFixed(1)),
    units: Number(totals.units.toFixed(1)),
    drinks: totals.count,
    shots: totals.shots,
    softMl: totals.softMl,
    alcoholicMl: totals.alcoholicMl,
    estimatedScores: { body, mind, control },
    recoveryText: estimatedPromille <= 0.05 ? 'aktuell niedrig geschätzt' : `frühestens in ca. ${humanDuration(minutesUntilLower)}`,
    minutesUntilLower,
    disclaimer: 'Grobe Schätzung. Nicht zur Beurteilung von Fahrtüchtigkeit oder Sicherheit verwenden.'
  };
}

function clampScore(value) {
  return Math.max(1, Math.min(10, Math.round(value)));
}

export function scoreTone(score) {
  if (score >= 8) return { label: 'stabil', color: 'text-zip-good', bg: 'bg-green-50', ring: 'ring-green-100' };
  if (score >= 6) return { label: 'leicht beeinträchtigt', color: 'text-zip-warning', bg: 'bg-amber-50', ring: 'ring-amber-100' };
  if (score >= 4) return { label: 'deutlich beeinträchtigt', color: 'text-orange-600', bg: 'bg-orange-50', ring: 'ring-orange-100' };
  return { label: 'Warnstufe', color: 'text-zip-danger', bg: 'bg-red-50', ring: 'ring-red-100' };
}

export function friendlyHint(session, user) {
  const estimate = estimateAlcohol(session, user);
  const totals = sumDrinks(session);
  if (estimate.promille <= 0.05 && totals.count === 0) {
    return 'Setz dir einen ruhigen Rahmen: langsam starten, Wasser bereitstellen und Ziele im Blick behalten.';
  }
  if (totals.softMl < totals.alcoholicMl * 0.6 && totals.count > 0) {
    return 'Ein alkoholfreies Getränk würde deine Chancen auf einen besseren nächsten Tag jetzt verbessern.';
  }
  if (estimate.estimatedScores.control <= 5) {
    return 'Eine Pause wäre jetzt sinnvoll. Weniger Tempo hilft dir, dein Ziel eher zu halten.';
  }
  if ((session?.meals ?? []).length === 0 && totals.count >= 2) {
    return 'Etwas zu essen kann helfen, bewusster und stabiler durch die Session zu kommen.';
  }
  return 'Du kannst dein Ziel noch aktiv beeinflussen: langsam trinken, Pausen einbauen, Wasser loggen.';
}
