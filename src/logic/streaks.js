function avgScore(values) {
  return (values.body + values.mind + values.control) / 3;
}

export function goalReached(session) {
  if (!session?.checkins?.length) return false;
  const last = session.checkins[session.checkins.length - 1];
  if (!last?.ratings || !session.goalsEvening) return false;
  return avgScore(last.ratings) >= avgScore(session.goalsEvening) - 0.5;
}

export function nextDayGoalReached(session) {
  if (!session?.nextDayCheck?.ratings || !session.goalsNextDay) return false;
  return avgScore(session.nextDayCheck.ratings) >= avgScore(session.goalsNextDay) - 0.5;
}

export function calculateStreaks(sessions) {
  const finished = [...sessions].filter((session) => session.status === 'ended').sort((a, b) => new Date(a.endedAt) - new Date(b.endedAt));
  let controlStreak = 0;
  let nextDayStreak = 0;

  [...finished].reverse().forEach((session, index) => {
    if (index === controlStreak && goalReached(session)) controlStreak += 1;
    if (index === nextDayStreak && nextDayGoalReached(session)) nextDayStreak += 1;
  });

  const badges = [];
  const nextDayGoodCount = finished.filter(nextDayGoalReached).length;
  const controlGoodCount = finished.filter(goalReached).length;
  const alcoholFreeSessions = finished.filter((session) => (session.drinks ?? []).every((drink) => Number(drink.abv || 0) === 0)).length;

  if (finished.length >= 1) badges.push({ title: 'Erste Session', icon: '🌱', text: 'Du hast mit Selbstbeobachtung begonnen.' });
  if (controlGoodCount >= 3) badges.push({ title: 'Kontrolle gehalten', icon: '🛡️', text: '3 Sessions im Zielbereich.' });
  if (nextDayGoodCount >= 3) badges.push({ title: 'Guter Morgen', icon: '☀️', text: '3 gute Next-Day-Checks.' });
  if (alcoholFreeSessions >= 1) badges.push({ title: 'Alkoholfrei geloggt', icon: '💧', text: 'Eine Session ohne Alkohol abgeschlossen.' });

  return { controlStreak, nextDayStreak, badges };
}
