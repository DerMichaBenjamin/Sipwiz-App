import { useState } from 'react';
import Header from './Header.jsx';
import { Card } from './Card.jsx';
import { ScoreGroup } from './ScoreSlider.jsx';
import { formatDate } from '../utils/date.js';

export default function NextDayCheck({ session, onBack, onSave }) {
  const [ratings, setRatings] = useState({ body: 7, mind: 7, control: 7 });
  const [notes, setNotes] = useState('');

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header onBack={onBack} title="Nächster-Tag-Check-in" subtitle={`Reflexion 12 Stunden nach deiner Session vom ${formatDate(session.endedAt)}.`} />

      <Card className="mb-4 bg-zip-mint/80">
        <div className="flex gap-3">
          <div className="text-3xl">🌤️</div>
          <p className="text-sm leading-6 text-zip-navy">
            Kein Urteil. Die Werte helfen dir, persönliche Muster zu erkennen: Was war gut, was war zu viel, was hilft dir beim nächsten Mal?
          </p>
        </div>
      </Card>

      <Card>
        <ScoreGroup title="Wie geht es dir jetzt?" values={ratings} setValues={setRatings} />
        <label className="mt-4 block text-sm font-bold text-zip-slate">
          Notiz optional
          <textarea className="input mt-1 min-h-24" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="z. B. gut geschlafen, Kopfschmerzen, genug Wasser..." />
        </label>
        <button className="primary-button mt-4" onClick={() => onSave({ ratings, notes })}>Check-in speichern</button>
      </Card>
    </main>
  );
}
