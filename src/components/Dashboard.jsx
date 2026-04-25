import Header from './Header.jsx';
import { Card, SectionTitle } from './Card.jsx';
import MiniStat from './MiniStat.jsx';
import Disclaimer from './Disclaimer.jsx';
import { estimateAlcohol, friendlyHint } from '../logic/alcoholModel.js';
import { calculateStreaks } from '../logic/streaks.js';
import { formatDate, humanDuration } from '../utils/date.js';

export default function Dashboard({ state, activeSession, dueNextDaySessions, onStart, onContinue, onNextDay, setTab }) {
  const finished = state.sessions.filter((session) => session.status === 'ended');
  const latest = finished[finished.length - 1];
  const streaks = calculateStreaks(state.sessions);
  const activeEstimate = activeSession ? estimateAlcohol(activeSession, state.user) : null;

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header title={`Hallo ${state.user?.name ?? 'Alex'}! 👋`} subtitle="Schön, dass du bewusst auf dich achtest." />

      {dueNextDaySessions.length > 0 && (
        <button className="mb-4 w-full rounded-3xl bg-amber-50 p-4 text-left shadow-card ring-1 ring-amber-100" onClick={() => onNextDay(dueNextDaySessions[0])}>
          <div className="text-sm font-black text-amber-900">Next-Day-Check offen</div>
          <div className="mt-1 text-sm text-amber-800">12 Stunden nach deiner letzten Session: Wie geht es dir jetzt?</div>
        </button>
      )}

      {activeSession ? (
        <Card className="mb-4 bg-gradient-to-br from-white to-zip-mint">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-black text-zip-teal">Session läuft</div>
              <h2 className="mt-1 text-3xl font-black text-zip-navy">{activeEstimate.drinks} Drinks</h2>
              <p className="mt-1 text-sm leading-6 text-zip-slate">Schätzung: ca. {activeEstimate.promille.toFixed(2)} ‰ · {activeEstimate.disclaimer}</p>
            </div>
            <div className="rounded-full bg-green-100 px-3 py-1 text-xs font-black text-green-700">Aktiv</div>
          </div>
          <p className="mt-4 rounded-2xl bg-white/80 p-3 text-sm leading-6 text-zip-navy">{friendlyHint(activeSession, state.user)}</p>
          <button onClick={onContinue} className="primary-button mt-4">Session öffnen</button>
        </Card>
      ) : (
        <button onClick={onStart} className="mb-4 flex w-full items-center justify-center gap-3 rounded-3xl bg-zip-teal px-5 py-5 text-lg font-black text-white shadow-soft active:scale-[0.98]">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-zip-teal">▶</span>
          Session starten
        </button>
      )}

      <div className="mb-4 grid grid-cols-2 gap-3">
        <MiniStat icon="🛡️" value={streaks.controlStreak} label="Ziel-Streak" hint="Sessions im Zielbereich" />
        <MiniStat icon="☀️" value={streaks.nextDayStreak} label="Next-Day-Streak" hint="Gute Morgenwerte" />
      </div>

      <Card className="mb-4">
        <SectionTitle title="Deine Woche im Überblick" subtitle="Kontrolle, Pausen und Reflexion zählen mehr als Menge." action={<button onClick={() => setTab('insights')} className="text-sm font-black text-zip-teal">Details</button>} />
        <div className="grid grid-cols-7 gap-2">
          {['M', 'D', 'M', 'D', 'F', 'S', 'S'].map((day, index) => {
            const done = index < Math.min(7, streaks.nextDayStreak + 2);
            return (
              <div key={`${day}-${index}`} className="text-center">
                <div className="mb-2 text-xs font-black text-zip-navy">{day}</div>
                <div className={`mx-auto h-9 w-9 rounded-full ${done ? 'bg-zip-teal' : 'bg-slate-200'} ${index === 4 ? 'ring-4 ring-zip-mint' : ''}`} />
              </div>
            );
          })}
        </div>
      </Card>

      {latest && (
        <Card className="mb-4">
          <SectionTitle title="Letzte Session" subtitle={formatDate(latest.endedAt)} />
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-zip-mint text-2xl">🍹</div>
              <div>
                <div className="text-xl font-black text-zip-navy">{estimateAlcohol(latest, state.user).drinks} Drinks</div>
                <div className="text-sm text-zip-slate">{humanDuration((new Date(latest.endedAt) - new Date(latest.startedAt)) / 60000)}</div>
              </div>
            </div>
            <div className="rounded-full bg-amber-50 px-3 py-2 text-xs font-black text-amber-700">Reflektiert</div>
          </div>
        </Card>
      )}

      <Card className="mb-4 bg-zip-mint/80">
        <div className="flex items-center gap-3">
          <div className="text-3xl">💬</div>
          <p className="text-sm leading-6 text-zip-navy">Jede bewusste Entscheidung ist ein Schritt in die richtige Richtung. Pausen, Wasser und Essen sind echte Fortschritte.</p>
        </div>
      </Card>

      <Disclaimer compact />
    </main>
  );
}
