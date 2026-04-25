import { scoreTone } from '../logic/alcoholModel.js';

const meta = {
  body: { icon: '💪', label: 'Körper', low: 'schlecht', high: 'fit' },
  mind: { icon: '🧠', label: 'Geist', low: 'unklar', high: 'klar' },
  control: { icon: '🎯', label: 'Kontrolle', low: 'wenig', high: 'voll da' }
};

export default function ScoreSlider({ type, value, onChange }) {
  const info = meta[type];
  const tone = scoreTone(value);
  return (
    <div className={`rounded-3xl p-4 ring-1 ${tone.bg} ${tone.ring}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-2xl shadow-sm">{info.icon}</div>
          <div>
            <div className="font-black text-zip-navy">{info.label}</div>
            <div className={`text-xs font-bold ${tone.color}`}>{tone.label}</div>
          </div>
        </div>
        <div className="text-3xl font-black text-zip-navy">{value}</div>
      </div>
      <input
        className="range mt-4 w-full"
        type="range"
        min="1"
        max="10"
        step="1"
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        aria-label={`${info.label} Wert`}
      />
      <div className="mt-1 flex justify-between text-[11px] font-bold uppercase tracking-wide text-slate-400">
        <span>{info.low}</span>
        <span>{info.high}</span>
      </div>
    </div>
  );
}

export function ScoreGroup({ title, values, setValues }) {
  const update = (key, value) => setValues({ ...values, [key]: value });
  return (
    <div className="space-y-3">
      {title && <h3 className="text-base font-black text-zip-navy">{title}</h3>}
      <ScoreSlider type="body" value={values.body} onChange={(value) => update('body', value)} />
      <ScoreSlider type="mind" value={values.mind} onChange={(value) => update('mind', value)} />
      <ScoreSlider type="control" value={values.control} onChange={(value) => update('control', value)} />
    </div>
  );
}
