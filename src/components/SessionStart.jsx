import { useState } from 'react';
import Header from './Header.jsx';
import { Card } from './Card.jsx';
import { ScoreGroup } from './ScoreSlider.jsx';

const initialGoals = { body: 8, mind: 8, control: 8 };

export default function SessionStart({ onBack, onCreate, onAskNotifications }) {
  const [goalsEvening, setGoalsEvening] = useState(initialGoals);
  const [goalsNextDay, setGoalsNextDay] = useState({ body: 8, mind: 8, control: 9 });

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header onBack={onBack} title="Session vorbereiten" subtitle="Setz zuerst deinen Rahmen. Die App belohnt Kontrolle, nicht Menge." />

      <div className="space-y-4">
        <Card>
          <ScoreGroup title="Wie möchtest du dich heute Abend fühlen?" values={goalsEvening} setValues={setGoalsEvening} />
        </Card>
        <Card>
          <ScoreGroup title="Wie möchtest du dich morgen fühlen?" values={goalsNextDay} setValues={setGoalsNextDay} />
        </Card>
        <Card className="bg-zip-mint/80">
          <div className="text-lg font-black text-zip-navy">Check-ins</div>
          <p className="mt-2 text-sm leading-6 text-zip-slate">
            Standardmäßig erinnert ZIPWIZE dich etwa einmal pro Stunde in der App. Browser-Benachrichtigungen kannst du optional aktivieren.
          </p>
          <button type="button" onClick={onAskNotifications} className="secondary-button mt-4">Benachrichtigungen erlauben</button>
        </Card>
        <button className="primary-button" onClick={() => onCreate({ goalsEvening, goalsNextDay })}>Session starten</button>
      </div>
    </main>
  );
}
