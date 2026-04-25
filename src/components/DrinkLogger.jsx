import { useMemo, useState } from 'react';
import { DRINK_PRESETS } from '../logic/alcoholModel.js';

const drinkOrder = ['beer', 'wine', 'cocktail', 'shot', 'soft'];
const mealOptions = [
  { size: 'small', label: 'Kleine Portion', icon: '🥨' },
  { size: 'medium', label: 'Mittlere Portion', icon: '🥗' },
  { size: 'large', label: 'Große Portion', icon: '🍽️' }
];

export default function DrinkLogger({ customDrinks, onAddDrink, onAddMeal, compact = false }) {
  const [selected, setSelected] = useState('beer');
  const [amount, setAmount] = useState(DRINK_PRESETS.beer.ml);
  const [showCustom, setShowCustom] = useState(false);
  const [custom, setCustom] = useState({ name: '', ml: 300, abv: 5 });

  const selectedPreset = DRINK_PRESETS[selected];

  function choose(type) {
    setSelected(type);
    setAmount(DRINK_PRESETS[type].ml);
    setShowCustom(false);
  }

  function addSelected() {
    onAddDrink({
      type: selected,
      name: selectedPreset.label,
      ml: selected === 'shot' ? 20 : amount,
      abv: selectedPreset.abv
    });
  }

  function addCustomDrink(drink) {
    onAddDrink({ type: 'custom', name: drink.name, ml: Number(drink.ml), abv: Number(drink.abv) });
  }

  const amountChoices = useMemo(() => {
    if (selected === 'shot') return [20];
    if (selected === 'wine') return [100, 200, 300, 500];
    return [100, 300, 500, 1000];
  }, [selected]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        {drinkOrder.map((type) => {
          const preset = DRINK_PRESETS[type];
          const active = selected === type && !showCustom;
          return (
            <button
              key={type}
              type="button"
              onClick={() => choose(type)}
              className={`rounded-3xl border p-4 text-left shadow-card transition active:scale-[0.98] ${active ? 'border-zip-teal bg-zip-mint' : 'border-white bg-white'}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-3xl">{preset.icon}</span>
                <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-zip-teal">+</span>
              </div>
              <div className="mt-2 font-black text-zip-navy">{preset.label}</div>
              <div className="text-xs text-zip-slate">{type === 'shot' ? '2 cl Standard' : `${preset.abv}% · ${preset.step}-ml-Schritte`}</div>
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => setShowCustom(true)}
          className={`rounded-3xl border p-4 text-left shadow-card transition active:scale-[0.98] ${showCustom ? 'border-zip-teal bg-zip-mint' : 'border-white bg-white'}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-3xl">✨</span>
            <span className="rounded-full bg-white px-2 py-1 text-xs font-black text-zip-teal">+</span>
          </div>
          <div className="mt-2 font-black text-zip-navy">Custom</div>
          <div className="text-xs text-zip-slate">Eigener Drink</div>
        </button>
      </div>

      {!showCustom ? (
        <div className="card p-4">
          <div className="mb-3 flex items-center justify-between">
            <div>
              <div className="text-sm font-black text-zip-navy">Menge anpassen</div>
              <div className="text-xs text-zip-slate">{selected === 'shot' ? 'Standard: 2 cl pro Shot' : 'Plus/Minus in 100-ml-Schritten'}</div>
            </div>
            <div className="text-2xl font-black text-zip-teal">{selected === 'shot' ? '2 cl' : `${amount} ml`}</div>
          </div>

          {selected !== 'shot' && (
            <>
              <div className="mb-3 flex items-center gap-3">
                <button className="h-12 w-12 rounded-2xl bg-slate-100 text-2xl font-black text-zip-navy" onClick={() => setAmount(Math.max(100, amount - 100))}>−</button>
                <div className="h-3 flex-1 rounded-full bg-slate-100">
                  <div className="h-3 rounded-full bg-zip-teal" style={{ width: `${Math.min(100, amount / 10)}%` }} />
                </div>
                <button className="h-12 w-12 rounded-2xl bg-zip-mint text-2xl font-black text-zip-teal" onClick={() => setAmount(Math.min(2000, amount + 100))}>+</button>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {amountChoices.map((ml) => (
                  <button key={ml} onClick={() => setAmount(ml)} className={`rounded-2xl px-2 py-2 text-xs font-bold ${amount === ml ? 'bg-zip-teal text-white' : 'bg-slate-100 text-slate-500'}`}>{ml} ml</button>
                ))}
              </div>
            </>
          )}

          <button className="primary-button mt-4" onClick={addSelected}>Hinzufügen</button>
        </div>
      ) : (
        <div className="card p-4">
          <div className="mb-3 text-sm font-black text-zip-navy">Custom Drink anlegen / loggen</div>
          <div className="grid gap-3">
            <input className="input" placeholder="Name, z. B. Gin Tonic" value={custom.name} onChange={(e) => setCustom({ ...custom, name: e.target.value })} />
            <div className="grid grid-cols-2 gap-3">
              <label className="text-xs font-bold text-zip-slate">Milliliter<input className="input mt-1" type="number" value={custom.ml} onChange={(e) => setCustom({ ...custom, ml: e.target.value })} /></label>
              <label className="text-xs font-bold text-zip-slate">Alkohol %<input className="input mt-1" type="number" step="0.1" value={custom.abv} onChange={(e) => setCustom({ ...custom, abv: e.target.value })} /></label>
            </div>
            <button className="primary-button" disabled={!custom.name.trim()} onClick={() => addCustomDrink(custom)}>Custom Drink loggen</button>
          </div>
          {customDrinks.length > 0 && (
            <div className="mt-4 grid gap-2">
              <div className="text-xs font-black uppercase tracking-wide text-slate-400">Gespeicherte Drinks</div>
              {customDrinks.map((drink) => (
                <button key={drink.id} className="flex items-center justify-between rounded-2xl bg-slate-50 p-3 text-left" onClick={() => addCustomDrink(drink)}>
                  <span className="font-bold text-zip-navy">{drink.name}</span>
                  <span className="text-xs font-bold text-zip-teal">{drink.ml} ml · {drink.abv}%</span>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {!compact && (
        <div className="card p-4">
          <div className="mb-3 text-sm font-black text-zip-navy">Essen loggen</div>
          <div className="grid grid-cols-3 gap-2">
            {mealOptions.map((option) => (
              <button key={option.size} className="rounded-2xl bg-zip-mint/60 px-2 py-3 text-center active:scale-[0.98]" onClick={() => onAddMeal(option.size)}>
                <div className="text-2xl">{option.icon}</div>
                <div className="mt-1 text-xs font-bold text-zip-navy">{option.label}</div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
