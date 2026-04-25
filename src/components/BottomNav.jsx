const items = [
  { id: 'home', label: 'Start', icon: '⌂' },
  { id: 'session', label: 'Session', icon: '+' },
  { id: 'insights', label: 'Insights', icon: '▥' },
  { id: 'settings', label: 'Profil', icon: '♙' }
];

export default function BottomNav({ tab, setTab }) {
  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 mx-auto max-w-[430px] border-t border-slate-100 bg-white/95 px-4 pb-[calc(env(safe-area-inset-bottom)+10px)] pt-2 shadow-[0_-12px_30px_rgba(13,27,42,0.08)] backdrop-blur">
      <div className="grid grid-cols-4 gap-1">
        {items.map((item) => {
          const active = item.id === tab;
          return (
            <button
              key={item.id}
              onClick={() => setTab(item.id)}
              className={`rounded-2xl px-2 py-2 text-center transition ${active ? 'bg-zip-mint text-zip-teal' : 'text-slate-500'}`}
            >
              <div className="text-2xl font-black leading-none">{item.icon}</div>
              <div className="mt-1 text-xs font-bold">{item.label}</div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
