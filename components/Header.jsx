import Logo from './Logo.jsx';

export default function Header({ title, subtitle, onBack, right }) {
  return (
    <header className="sticky top-0 z-30 -mx-5 mb-4 bg-zip-cloud/90 px-5 pb-3 pt-[calc(env(safe-area-inset-top)+14px)] backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="min-w-0">
          {onBack ? (
            <button onClick={onBack} className="mb-2 flex items-center gap-1 text-sm font-bold text-zip-teal">
              <span aria-hidden>←</span> Zurück
            </button>
          ) : (
            <Logo compact />
          )}
          {title && <h1 className="mt-3 text-3xl font-black leading-tight tracking-tight text-zip-navy">{title}</h1>}
          {subtitle && <p className="mt-1 text-sm leading-6 text-zip-slate">{subtitle}</p>}
        </div>
        {right}
      </div>
    </header>
  );
}
