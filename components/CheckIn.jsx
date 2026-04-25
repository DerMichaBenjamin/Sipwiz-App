import { useState } from 'react';
import Header from './Header.jsx';
import { Card } from './Card.jsx';
import { ScoreGroup } from './ScoreSlider.jsx';
import DrinkLogger from './DrinkLogger.jsx';

export default function CheckIn({ state, onBack, onSave }) {
  const [step, setStep] = useState(1);
  const [ratings, setRatings] = useState({ body: 8, mind: 8, control: 8 });
  const [drinks, setDrinks] = useState([]);
  const [meals, setMeals] = useState([]);

  function addDrink(drink) {
    setDrinks([...drinks, { ...drink, id: `pending_drink_${Date.now()}_${Math.random()}`, at: new Date().toISOString() }]);
  }

  function addMeal(size) {
    setMeals([...meals, { id: `pending_meal_${Date.now()}_${Math.random()}`, size, at: new Date().toISOString() }]);
  }

  return (
    <main className="safe-bottom phone-frame px-5">
      <Header onBack={onBack} title="Check-in" subtitle="Kurz einschätzen, dann Konsum seit dem letzten Check ergänzen." />

      <div className="mb-4 grid grid-cols-2 gap-2 rounded-3xl bg-white p-2 shadow-card">
        <button className={`segment-button ${step === 1 ? 'bg-zip-teal text-white' : 'text-zip-slate'}`} onClick={() => setStep(1)}>1 Zustand</button>
        <button className={`segment-button ${step === 2 ? 'bg-zip-teal text-white' : 'text-zip-slate'}`} onClick={() => setStep(2)}>2 Konsum</button>
      </div>

      {step === 1 ? (
        <Card>
          <ScoreGroup title="Wie fühlst du dich gerade?" values={ratings} setValues={setRatings} />
          <button className="primary-button mt-4" onClick={() => setStep(2)}>Weiter zum Konsum</button>
        </Card>
      ) : (
        <div className="space-y-4">
          <Card>
            <div className="mb-4">
              <h2 className="text-lg font-black text-zip-navy">Was kam seit dem letzten Check dazu?</h2>
              <p className="mt-1 text-sm text-zip-slate">Du kannst den Schritt auch ohne Einträge speichern.</p>
            </div>
            <DrinkLogger customDrinks={state.customDrinks} onAddDrink={addDrink} onAddMeal={addMeal} />
          </Card>

          <Card>
            <div className="font-black text-zip-navy">Zwischensumme</div>
            <div className="mt-3 grid grid-cols-2 gap-3 text-center">
              <div className="rounded-2xl bg-zip-mint p-3"><div className="text-2xl font-black text-zip-teal">{drinks.length}</div><div className="text-xs font-bold text-zip-slate">Getränke</div></div>
              <div className="rounded-2xl bg-zip-mint p-3"><div className="text-2xl font-black text-zip-teal">{meals.length}</div><div className="text-xs font-bold text-zip-slate">Essen</div></div>
            </div>
            <button className="primary-button mt-4" onClick={() => onSave({ ratings, drinks, meals })}>Check-in speichern</button>
          </Card>
        </div>
      )}
    </main>
  );
}
