export function Card({ children, className = '' }) {
  return <section className={`card p-5 ${className}`}>{children}</section>;
}

export function SectionTitle({ title, subtitle, action }) {
  return (
    <div className="mb-3 flex items-end justify-between gap-3">
      <div>
        <h2 className="text-lg font-black text-zip-navy">{title}</h2>
        {subtitle && <p className="mt-1 text-sm text-zip-slate">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}
