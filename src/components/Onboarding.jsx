import { useState } from 'react';
import Logo from './Logo.jsx';
import Disclaimer from './Disclaimer.jsx';

export default function Onboarding({ onFinish }) {
  const [form, setForm] = useState({ name: '', age: 30, gender: 'other', weight: 80, checkIntervalMinutes: 60 });

  function submit(event) {
    event.preventDefault();
    onFinish({
      name: form.name.trim() || 'Alex',
      age: Number(form.age),
      gender: form.gender,
      weight: Number(form.weight),
      checkIntervalMinutes: Number(form.checkIntervalMinutes),
      createdAt: new Date().toISOString()
    });
  }

  return (
    <main className="phone-frame px-5 py-8">
      <div className="mb-8 pt-4">
        <Logo />
        <h1 className="mt-8 text-4xl font-black leading-tight tracking-tight text-zip-navy">Bewusster trinken. Besser verstehen.</h1>
        <p className="mt-3 text-base leading-7 text-zip-slate">
          ZIPWIZE hilft dir, Sessions zu tracken, Ziele zu setzen und persönliche Muster zu erkennen – ohne Login und lokal auf deinem Gerät.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="card p-5">
          <div className="mb-4 text-lg font-black text-zip-navy">Dein Profil</div>
          <div className="space-y-3">
            <label className="block text-sm font-bold text-zip-slate">Name optional<input className="input mt-1" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="z. B. Micha" /></label>
            <div className="grid grid-cols-2 gap-3">
              <label className="block text-sm font-bold text-zip-slate">Alter<input className="input mt-1" type="number" min="16" max="100" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required /></label>
              <label className="block text-sm font-bold text-zip-slate">Gewicht kg<input className="input mt-1" type="number" min="35" max="250" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} required /></label>
            </div>
            <label className="block text-sm font-bold text-zip-slate">Geschlecht für grobe Schätzung
              <select className="input mt-1" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })}>
                <option value="male">männlich</option>
                <option value="female">weiblich</option>
                <option value="other">divers / keine Angabe</option>
              </select>
            </label>
          </div>
        </div>

        <Disclaimer />
        <button className="primary-button" type="submit">Loslegen</button>
      </form>
    </main>
  );
}
