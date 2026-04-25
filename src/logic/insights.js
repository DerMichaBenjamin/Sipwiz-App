import { estimateAlcohol, sumDrinks } from './alcoholModel';

function avg(values) {
  if (!values.length) return 0;
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function avgNextDay(session) {
  const ratings = session?.nextDayCheck?.ratings;
  if (!ratings) return null;
  return avg([ratings.body, ratings.mind, ratings.control]);
}

function avgGoalNextDay(session) {
  const goals = session?.goalsNextDay;
  if (!goals) return 7;
  return avg([goals.body, goals.mind, goals.control]);
}

export function buildInsights(sessions, user) {
  const finished = sessions.filter((session) => session.status === 'ended');
  const withNextDay = finished.filter((session) => session.nextDayCheck);
  const insights = [];

  if (finished.length < 3) {
    return [
      {
        type: 'starter',
        title: 'Noch mehr Daten nötig',
        text: `Nach ${Math.max(0, 3 - finished.length)} weiteren abgeschlossenen Sessions kann ZIPWIZE erste persönliche Muster erkennen.`,
        icon: '🌱'
      }
    ];
  }

  const shotSessions = withNextDay.filter((session) => sumDrinks(session).shots > 0);
  const noShotSessions = withNextDay.filter((session) => sumDrinks(session).shots === 0);
  if (shotSessions.length >= 2 && noShotSessions.length >= 1) {
    const shotAvg = avg(shotSessions.map(avgNextDay).filter(Boolean));
    const noShotAvg = avg(noShotSessions.map(avgNextDay).filter(Boolean));
    if (shotAvg + 1 <= noShotAvg) {
      insights.push({
        type: 'shots',
        title: 'Shots wirken bei dir eher ungünstig',
        text: `Sessions mit Shots lagen bei deinen Next-Day-Werten im Schnitt merklich niedriger. Teste beim nächsten Mal: Shots weglassen oder früh stoppen.`,
        icon: '🥃'
      });
    }
  }

  const waterHelpful = withNextDay.filter((session) => {
    const totals = sumDrinks(session);
    return totals.softMl >= Math.max(300, totals.alcoholicMl * 0.5) && avgNextDay(session) >= avgGoalNextDay(session) - 0.5;
  });
  if (waterHelpful.length >= 2) {
    insights.push({
      type: 'water',
      title: 'Alkoholfreie Getränke helfen dir',
      text: 'In mehreren Sessions mit ausreichend alkoholfreien Getränken waren deine Next-Day-Werte näher am Ziel.',
      icon: '💧'
    });
  }

  const mealHelpful = withNextDay.filter((session) => (session.meals ?? []).length > 0 && avgNextDay(session) >= avgGoalNextDay(session) - 0.5);
  if (mealHelpful.length >= 2) {
    insights.push({
      type: 'meal',
      title: 'Essen scheint für dich ein Schutzfaktor zu sein',
      text: 'Sessions mit Essen schneiden bei dir häufiger stabiler ab. Plane vor der nächsten Session bewusst eine Mahlzeit ein.',
      icon: '🍽️'
    });
  }

  const estimatedThresholds = withNextDay
    .map((session) => ({ session, units: estimateAlcohol(session, user).units, next: avgNextDay(session) }))
    .filter((x) => x.next !== null);
  const lowerNextDay = estimatedThresholds.filter((x) => x.next <= 5.5);
  if (lowerNextDay.length >= 2) {
    const threshold = Math.max(1, Math.round(Math.min(...lowerNextDay.map((x) => x.units))));
    insights.push({
      type: 'threshold',
      title: 'Persönliche Grenze abzeichnen',
      text: `Ab ungefähr ${threshold} Einheiten werden deine Werte häufiger schwächer. Bleib für bessere Morgenwerte eher darunter.`,
      icon: '📉'
    });
  }

  const goodSessions = withNextDay.filter((session) => avgNextDay(session) >= 8);
  if (goodSessions.length >= 2) {
    const avgUnits = avg(goodSessions.map((session) => estimateAlcohol(session, user).units));
    insights.push({
      type: 'recommendation',
      title: 'Dein guter Bereich',
      text: `Deine besten Next-Day-Werte traten grob bei bis zu ${Math.max(1, Math.round(avgUnits))} Einheiten auf. Das ist ein brauchbarer Orientierungswert.`,
      icon: '🎯'
    });
  }

  if (!insights.length) {
    insights.push({
      type: 'neutral',
      title: 'Erste Muster entstehen',
      text: 'Deine Daten zeigen noch kein klares Muster. Tracke weiter Wasser, Essen, Drinks und Next-Day-Werte, damit die Empfehlungen genauer werden.',
      icon: '🔎'
    });
  }

  return insights.slice(0, 5);
}
