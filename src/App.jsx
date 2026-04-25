import { useMemo, useState } from 'react';
import Onboarding from './components/Onboarding.jsx';
import BottomNav from './components/BottomNav.jsx';
import Dashboard from './components/Dashboard.jsx';
import SessionStart from './components/SessionStart.jsx';
import ActiveSession from './components/ActiveSession.jsx';
import CheckIn from './components/CheckIn.jsx';
import NextDayCheck from './components/NextDayCheck.jsx';
import Insights from './components/Insights.jsx';
import Settings from './components/Settings.jsx';
import { loadState, resetState, saveState } from './data/storage.js';
import { uid } from './utils/id.js';
import { toIso } from './utils/date.js';

export default function App() {
  const [state, setState] = useStoredState();
  const [tab, setTab] = useState('home');
  const [flow, setFlow] = useState(null);
  const activeSession = useMemo(() => state.sessions.find((session) => session.status === 'active'), [state.sessions]);

  const dueNextDaySessions = useMemo(() => {
    const now = Date.now();
    return state.sessions.filter((session) => {
      if (session.status !== 'ended' || session.nextDayCheck) return false;
      const lastDrinkAt = getLastDrinkAt(session) ?? session.endedAt;
      if (!lastDrinkAt) return false;
      return now - new Date(lastDrinkAt).getTime() >= 12 * 60 * 60 * 1000;
    });
  }, [state.sessions]);

  function updateState(updater) {
    setState((current) => {
      const next = typeof updater === 'function' ? updater(current) : updater;
      saveState(next);
      return next;
    });
  }

  function saveUser(user) {
    updateState({ ...state, user });
  }

  function createSession({ goalsEvening, goalsNextDay }) {
    const session = {
      id: uid('session'),
      status: 'active',
      startedAt: toIso(),
      endedAt: null,
      goalsEvening,
      goalsNextDay,
      drinks: [],
      meals: [],
      checkins: [],
      nextDayCheck: null
    };
    updateState((current) => ({ ...current, sessions: [...current.sessions.filter((s) => s.status !== 'active'), session] }));
    setFlow(null);
    setTab('session');
  }

  function addDrink(sessionId, drink) {
    const entry = { id: uid('drink'), at: toIso(), ...drink, ml: Number(drink.ml), abv: Number(drink.abv) };
    updateState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, drinks: [...session.drinks, entry] } : session)
    }));
  }

  function addMeal(sessionId, size) {
    const entry = { id: uid('meal'), at: toIso(), size };
    updateState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, meals: [...session.meals, entry] } : session)
    }));
  }

  function saveCheckIn(sessionId, payload) {
    const now = toIso();
    const drinks = payload.drinks.map((drink) => ({ ...drink, id: uid('drink'), at: drink.at ?? now }));
    const meals = payload.meals.map((meal) => ({ ...meal, id: uid('meal'), at: meal.at ?? now }));
    const checkin = { id: uid('checkin'), at: now, ratings: payload.ratings, drinkIds: drinks.map((d) => d.id), mealIds: meals.map((m) => m.id) };

    updateState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? {
        ...session,
        drinks: [...session.drinks, ...drinks],
        meals: [...session.meals, ...meals],
        checkins: [...session.checkins, checkin]
      } : session)
    }));
    setFlow(null);
    setTab('session');
  }

  function endSession(sessionId) {
    const confirmed = window.confirm('Session jetzt beenden? Der Next-Day-Check erscheint 12 Stunden nach dem letzten Drink bzw. beim nächsten Öffnen der App.');
    if (!confirmed) return;
    updateState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? { ...session, status: 'ended', endedAt: toIso() } : session)
    }));
    setTab('home');
  }

  function saveNextDay(sessionId, payload) {
    updateState((current) => ({
      ...current,
      sessions: current.sessions.map((session) => session.id === sessionId ? {
        ...session,
        nextDayCheck: { id: uid('nextday'), at: toIso(), ratings: payload.ratings, notes: payload.notes }
      } : session)
    }));
    setFlow(null);
    setTab('insights');
  }

  function addCustomDrink(drink) {
    updateState((current) => ({
      ...current,
      customDrinks: [...current.customDrinks, { id: uid('custom'), name: drink.name, ml: Number(drink.ml), abv: Number(drink.abv) }]
    }));
  }

  function deleteCustomDrink(id) {
    updateState((current) => ({ ...current, customDrinks: current.customDrinks.filter((drink) => drink.id !== id) }));
  }

  async function askNotifications() {
    if (!('Notification' in window)) {
      alert('Dieser Browser unterstützt keine Benachrichtigungen. In-App-Hinweise funktionieren trotzdem.');
      return;
    }
    try {
      await Notification.requestPermission();
      updateState((current) => ({ ...current, app: { ...current.app, notificationPermissionAsked: true } }));
    } catch {
      alert('Benachrichtigungen konnten nicht aktiviert werden.');
    }
  }

  function hardReset() {
    const confirmed = window.confirm('Wirklich alle lokalen ZIPWIZE-Daten löschen?');
    if (!confirmed) return;
    resetState();
    window.location.reload();
  }

  if (!state.user) {
    return <Onboarding onFinish={saveUser} />;
  }

  if (flow?.type === 'start') {
    return <SessionStart onBack={() => setFlow(null)} onCreate={createSession} onAskNotifications={askNotifications} />;
  }

  if (flow?.type === 'checkin' && activeSession) {
    return <CheckIn state={state} onBack={() => setFlow(null)} onSave={(payload) => saveCheckIn(activeSession.id, payload)} />;
  }

  if (flow?.type === 'nextday') {
    return <NextDayCheck session={flow.session} onBack={() => setFlow(null)} onSave={(payload) => saveNextDay(flow.session.id, payload)} />;
  }

  return (
    <>
      {tab === 'home' && (
        <Dashboard
          state={state}
          activeSession={activeSession}
          dueNextDaySessions={dueNextDaySessions}
          onStart={() => setFlow({ type: 'start' })}
          onContinue={() => setTab('session')}
          onNextDay={(session) => setFlow({ type: 'nextday', session })}
          setTab={setTab}
        />
      )}

      {tab === 'session' && (
        activeSession ? (
          <ActiveSession
            state={state}
            session={activeSession}
            onAddDrink={(drink) => addDrink(activeSession.id, drink)}
            onAddMeal={(size) => addMeal(activeSession.id, size)}
            onCheckIn={() => setFlow({ type: 'checkin' })}
            onEnd={() => endSession(activeSession.id)}
            setTab={setTab}
          />
        ) : (
          <main className="safe-bottom phone-frame px-5 pt-10">
            <div className="card p-6 text-center">
              <div className="text-5xl">🍃</div>
              <h1 className="mt-3 text-2xl font-black text-zip-navy">Keine aktive Session</h1>
              <p className="mt-2 text-sm leading-6 text-zip-slate">Starte eine Session, um Getränke, Wasser, Essen und Check-ins zu erfassen.</p>
              <button className="primary-button mt-5" onClick={() => setFlow({ type: 'start' })}>Session starten</button>
            </div>
          </main>
        )
      )}

      {tab === 'insights' && <Insights state={state} />}
      {tab === 'settings' && (
        <Settings
          state={state}
          onSaveUser={saveUser}
          onAddCustomDrink={addCustomDrink}
          onDeleteCustomDrink={deleteCustomDrink}
          onReset={hardReset}
        />
      )}

      <BottomNav tab={tab} setTab={setTab} />
    </>
  );
}

function useStoredState() {
  const [state, setState] = useState(() => loadState());
  return [state, setState];
}

function getLastDrinkAt(session) {
  const drinks = session.drinks ?? [];
  if (!drinks.length) return null;
  return drinks.reduce((latest, drink) => {
    if (!latest) return drink.at;
    return new Date(drink.at) > new Date(latest) ? drink.at : latest;
  }, null);
}
