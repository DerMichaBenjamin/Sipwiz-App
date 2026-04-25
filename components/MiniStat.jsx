export default function MiniStat({ icon, label, value, hint }) {
  return (
    <div className="rounded-2xl bg-white p-4 shadow-card">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-zip-mint text-xl">{icon}</div>
        <div>
          <div className="text-2xl font-black text-zip-teal">{value}</div>
          <div className="text-xs font-bold text-zip-navy">{label}</div>
        </div>
      </div>
      {hint && <p className="mt-2 text-xs leading-5 text-zip-slate">{hint}</p>}
    </div>
  );
}
