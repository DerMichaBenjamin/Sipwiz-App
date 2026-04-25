export default function Disclaimer({ compact = false }) {
  return (
    <div className={`rounded-3xl border border-amber-100 bg-amber-50 p-4 ${compact ? 'text-xs' : 'text-sm'} leading-6 text-amber-900`}>
      <div className="mb-1 font-black">Wichtiger Hinweis</div>
      <p>
        ZIPWIZE liefert nur grobe Schätzungen und ersetzt keine medizinische Beratung. Die App darf nicht verwendet werden,
        um Fahrtüchtigkeit, Arbeitsfähigkeit oder Sicherheit zu beurteilen. Bei gesundheitlichen Problemen, Ausfallerscheinungen
        oder Unsicherheit: medizinische Hilfe holen und nicht allein bleiben.
      </p>
    </div>
  );
}
