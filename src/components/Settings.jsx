import { useState } from 'react';
import Header from './Header.jsx';
import { Card, SectionTitle } from './Card.jsx';
import Disclaimer from './Disclaimer.jsx';

export default function Settings({ state, onSaveUser, onAddCustomDrink, onDeleteCustomDrink, onReset }) {
  const [profile, setProfile] = useState({
    name: state.user?.name ?? '',
    age: state.user?.age ?? 30,
    gender: state.user?.gender ?? 'other',
    weight: state.user?.weight ?? 80,
    checkIntervalMinutes: state.user?.checkIntervalMinutes ?? 60
  });
  const [custom, setCustom] = useState({ name: '', ml: 300, abv: 5 });

  function saveProfile() {
    onSaveUser({ ...state.user, ...profile, age: Number(profile.age), weight: Number(profile.weight), checkIntervalMinutes: Number(profile.checkIntervalMinutes) });
  }

  function saveCustom() {
    if (!custom.name.trim()) return;
    onAddCustomDrink({ name: custom.name.trim(), ml: Number(custom.ml), abv: Number(custom.abv) });
    setCustom({ name: '', ml: 300, abv: 5 });
  }

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header title="Einstellungen" subtitle="Profilwerte, lokale Daten und Hinweise." />

      <Card className="mb-4">
        <SectionTitle title="Profil" />
        <div className="space-y-3">
          <label className="block text-sm font-bold text-zip-slate">Name<input className="input mt-1" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} /></label>
          <div className="grid grid-cols-2 gap-3">
            <label className="block text-sm font-bold text-zip-slate">Alter<input className="input mt-1" type="number" value={profile.age} onChange={(e) => setProfile({ ...profile, age: e.target.value })} /></label>
            <label className="block text-sm font-bold text-zip-slate">Gewicht kg<input className="input mt-1" type="number" value={profile.weight} onChange={(e) => setProfile({ ...profile, weight: e.target.value })} /></label>
          </div>
          <label className="block text-sm font-bold text-zip-slate">Geschlecht
            <select className="input mt-1" value={profile.gender} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
              <option value="male">männlich</option>
              <option value="female">weiblich</option>
              <option value="other">divers / keine Angabe</option>
            </select>
          </label>
          <label className="block text-sm font-bold text-zip-slate">Check-in-Intervall
            <select className="input mt-1" value={profile.checkIntervalMinutes} onChange={(e) => setProfile({ ...profile, checkIntervalMinutes: e.target.value })}>
              <option value="30">30 Minuten</option>
              <option value="45">45 Minuten</option>
              <option value="60">1 Stunde</option>
              <option value="90">90 Minuten</option>
              <option value="120">2 Stunden</option>
            </select>
          </label>
          <button className="primary-button" onClick={saveProfile}>Profil speichern</button>
        </div>
      </Card>

      <Card className="mb-4">
        <SectionTitle title="Custom Drinks" subtitle="Werden lokal gespeichert und später wieder auswählbar." />
        <div className="space-y-3">
          <input className="input" placeholder="Name" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
          <div className="grid grid-cols-2 gap-3">
            <input className="input" type="number" placeholder="ml" value={custom.ml} onChange={(e) => setCustom({ ...custom, ml: e.target.value })} />
            <input className="input" type="number" step="0.1" placeholder="% Alkohol" value={custom.abv} onChange={(e) => setCustom({ ...custom, abv: e.target.value })} />
          </div>
          <button className="secondary-button" onClick={saveCustom}>Custom Drink speichern</button>
          <div className="space-y-2">
            {state.customDrinks.map((drink) => (
              <div key={drink.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3">
                <div><div className="font-bold text-zip-navy">{drink.name}</div><div className="text-xs text-zip-slate">{drink.ml} ml · {drink.abv}%</div></div>
                <button className="text-sm font-black text-red-500" onClick={() => onDeleteCustomDrink(drink.id)}>Löschen</button>
              </div>
            ))}
          </div>
        </div>
      </Card>

      <Card className="mb-4">
        <SectionTitle title="Datenschutz" />
        <p className="text-sm leading-6 text-zip-slate">Version 1 speichert alle Daten lokal im Browser dieses Geräts. Kein Login, kein Backend, keine Cloud-Synchronisierung.</p>
      </Card>

      <Disclaimer />

      <Card className="mt-4 border-red-100 bg-red-50">
        <SectionTitle title="Daten zurücksetzen" subtitle="Löscht Profil, Sessions, Check-ins und Custom Drinks auf diesem Gerät." />
        <button className="danger-button" onClick={onReset}>Alle lokalen Daten löschen</button>
      </Card>
    </main>
  );
}
