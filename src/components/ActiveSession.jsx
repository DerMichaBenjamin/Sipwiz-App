import { useEffect, useMemo, useState } from 'react';
import Header from './Header.jsx';
import { Card, SectionTitle } from './Card.jsx';
import DrinkLogger from './DrinkLogger.jsx';
import { estimateAlcohol, friendlyHint, sumDrinks } from '../logic/alcoholModel.js';
import { formatTime, humanDuration, minutesBetween } from '../utils/date.js';

export default function ActiveSession({ state, session, onAddDrink, onAddMeal, onCheckIn, onEnd, setTab }) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000 * 30);
    return () => clearInterval(timer);
  }, []);

  const estimate = useMemo(() => estimateAlcohol(session, state.user), [session, state.user, now]);
  const totals = sumDrinks(session);
  const lastCheck = session.checkins?.length ? session.checkins[session.checkins.length - 1].at : session.startedAt;
  const checkDue = minutesBetween(lastCheck, now.toISOString()) >= (state.user?.checkIntervalMinutes ?? 60);
  const duration = humanDuration(minutesBetween(session.startedAt, now.toISOString()));

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header title="Live-Session" subtitle="Tracke nur für dich. Schätzungen bleiben bewusst vorsichtig." right={<span className="rounded-full bg-green-50 px-3 py-2 text-xs font-black text-green-700">● Aktiv</span>} />

      {checkDue && (
        <button onClick={onCheckIn} className="mb-4 w-full rounded-3xl bg-amber-50 p-4 text-left shadow-card ring-1 ring-amber-100">
          <div className="font-black text-amber-900">Check-in fällig</div>
          <div className="mt-1 text-sm leading-6 text-amber-800">Nimm dir 30 Sekunden: Zustand bewerten und Konsum seit dem letzten Check ergänzen.</div>
        </button>
      )}

      <Card className="mb-4 bg-gradient-to-br from-white to-zip-mint">
        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="text-sm font-black text-zip-slate">Session läuft seit</div>
            <div className="mt-1 text-4xl font-black text-zip-teal">{duration}</div>
            <div className="mt-1 text-xs text-zip-slate">Start: {formatTime(session.startedAt)}</div>
          </div>
          <div className="text-6xl">🏞️</div>
        </div>
      </Card>

      <Card className="mb-4">
        <SectionTitle title="Aktueller geschätzter Status" subtitle="Keine medizinische Genauigkeit. Nicht für Fahrtüchtigkeit nutzen." />
        <div className="grid grid-cols-[110px_1fr] gap-4">
          <div className="flex h-28 w-28 flex-col items-center justify-center rounded-full border-[10px] border-zip-mint bg-white shadow-inner">
            <div className="text-3xl font-black text-zip-navy">{estimate.promille.toFixed(2)}</div>
            <div className="text-xs font-black text-zip-slate">‰ Schätzung</div>
          </div>
          <div className="space-y-2 text-sm">
            <StatusLine icon="💪" label="Körper" value={estimate.estimatedScores.body} goal={session.goalsEvening.body} />
            <StatusLine icon="🧠" label="Geist" value={estimate.estimatedScores.mind} goal={session.goalsEvening.mind} />
            <StatusLine icon="🎯" label="Kontrolle" value={estimate.estimatedScores.control} goal={session.goalsEvening.control} />
          </div>
        </div>
        <div className="mt-4 rounded-2xl bg-zip-mint/70 p-3 text-sm leading-6 text-zip-navy">{friendlyHint(session, state.user)}</div>
        <div className="mt-3 text-xs leading-5 text-zip-slate">Wenn du jetzt stoppst: Erholung grob {estimate.recoveryText}. Das ist keine Sicherheitsfreigabe.</div>
      </Card>

      <div className="mb-4 grid grid-cols-4 gap-2">
        <TinyStat value={estimate.drinks} label="Drinks" />
        <TinyStat value={estimate.units} label="Einheiten" />
        <TinyStat value={`${totals.softMl} ml`} label="Alkoholfrei" />
        <TinyStat value={session.meals.length} label="Essen" />
      </div>

      <Card className="mb-4">
        <SectionTitle title="Schnell loggen" subtitle="Plus-Buttons und Mengenwahl für wenige Sekunden Tipparbeit." />
        <DrinkLogger customDrinks={state.customDrinks} onAddDrink={onAddDrink} onAddMeal={onAddMeal} />
      </Card>

      <Card className="mb-4">
        <SectionTitle title="Letzte Einträge" action={<button className="text-sm font-black text-zip-teal" onClick={() => setTab('insights')}>Verlauf</button>} />
        <div className="space-y-2">
          {[...session.drinks, ...session.meals].sort((a, b) => new Date(b.at) - new Date(a.at)).slice(0, 6).map((entry) => (
            <div key={entry.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
              <span className="font-bold text-zip-navy">{entry.name ?? (entry.size === 'large' ? 'Große Mahlzeit' : entry.size === 'medium' ? 'Mittlere Mahlzeit' : 'Kleine Mahlzeit')}</span>
              <span className="text-xs font-bold text-zip-slate">{formatTime(entry.at)}</span>
            </div>
          ))}
          {session.drinks.length + session.meals.length === 0 && <p className="text-sm text-zip-slate">Noch nichts geloggt.</p>}
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <button className="secondary-button" onClick={onCheckIn}>Check-in</button>
        <button className="danger-button" onClick={onEnd}>Session beenden</button>
      </div>
    </main>
  );
}

function StatusLine({ icon, label, value, goal }) {
  const ok = value >= goal - 1;
  return (
    <div className="flex items-center justify-between gap-2 rounded-2xl bg-slate-50 px-3 py-2">
      <span className="font-bold text-zip-navy">{icon} {label}</span>
      <span className={`font-black ${ok ? 'text-zip-teal' : 'text-zip-warning'}`}>{value}/10</span>
    </div>
  );
}

function TinyStat({ value, label }) {
  return (
    <div className="rounded-2xl bg-white p-3 text-center shadow-card">
      <div className="text-lg font-black text-zip-teal">{value}</div>
      <div className="text-[11px] font-bold text-zip-slate">{label}</div>
    </div>
  );
}
