import Header from './Header.jsx';
import { Card, SectionTitle } from './Card.jsx';
import { buildInsights } from '../logic/insights.js';
import { calculateStreaks, goalReached, nextDayGoalReached } from '../logic/streaks.js';
import { estimateAlcohol } from '../logic/alcoholModel.js';
import { formatDate, humanDuration } from '../utils/date.js';

export default function Insights({ state }) {
  const insights = buildInsights(state.sessions, state.user);
  const streaks = calculateStreaks(state.sessions);
  const finished = state.sessions.filter((session) => session.status === 'ended').slice().reverse();

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header title="Insights" subtitle="Verläufe, Muster und Fortschritt – lokal aus deinen eigenen Daten." />

      <div className="mb-4 grid grid-cols-2 gap-3">
        <Card>
          <div className="text-3xl">🛡️</div>
          <div className="mt-2 text-3xl font-black text-zip-teal">{streaks.controlStreak}</div>
          <div className="text-sm font-bold text-zip-navy">Kontroll-Streak</div>
        </Card>
        <Card>
          <div className="text-3xl">☀️</div>
          <div className="mt-2 text-3xl font-black text-zip-teal">{streaks.nextDayStreak}</div>
          <div className="text-sm font-bold text-zip-navy">Next-Day-Streak</div>
        </Card>
      </div>

      <Card className="mb-4">
        <SectionTitle title="Persönliche Muster" subtitle="Regelbasiert ausgewertet, keine echte KI in Version 1." />
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.type} className="rounded-3xl bg-zip-mint/70 p-4">
              <div className="flex items-start gap-3">
                <div className="text-3xl">{insight.icon}</div>
                <div>
                  <div className="font-black text-zip-navy">{insight.title}</div>
                  <p className="mt-1 text-sm leading-6 text-zip-slate">{insight.text}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="mb-4">
        <SectionTitle title="Badges" subtitle="Belohnt werden Kontrolle, Reflexion und gute Entscheidungen." />
        {streaks.badges.length ? (
          <div className="grid grid-cols-2 gap-3">
            {streaks.badges.map((badge) => (
              <div key={badge.title} className="rounded-3xl bg-white p-4 text-center shadow-card">
                <div className="text-4xl">{badge.icon}</div>
                <div className="mt-2 font-black text-zip-navy">{badge.title}</div>
                <div className="mt-1 text-xs leading-5 text-zip-slate">{badge.text}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-zip-slate">Noch keine Badges. Schließe deine erste Session mit Check-in ab.</p>
        )}
      </Card>

      <Card>
        <SectionTitle title="Session-Verlauf" />
        <div className="space-y-3">
          {finished.map((session) => {
            const estimate = estimateAlcohol(session, state.user);
            return (
              <div key={session.id} className="rounded-3xl bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-black text-zip-navy">{formatDate(session.endedAt)}</div>
                    <div className="mt-1 text-sm text-zip-slate">{humanDuration((new Date(session.endedAt) - new Date(session.startedAt)) / 60000)} · {estimate.drinks} Drinks · {estimate.units} Einheiten</div>
                  </div>
                  <div className="text-right text-xs font-black">
                    <div className={goalReached(session) ? 'text-zip-teal' : 'text-slate-400'}>Abend {goalReached(session) ? '✓' : '—'}</div>
                    <div className={nextDayGoalReached(session) ? 'text-zip-teal' : 'text-slate-400'}>Morgen {nextDayGoalReached(session) ? '✓' : '—'}</div>
                  </div>
                </div>
                {session.nextDayCheck?.notes && <p className="mt-2 text-sm leading-6 text-zip-slate">„{session.nextDayCheck.notes}“</p>}
              </div>
            );
          })}
          {!finished.length && <p className="text-sm text-zip-slate">Noch keine abgeschlossenen Sessions.</p>}
        </div>
      </Card>
    </main>
  );
}
