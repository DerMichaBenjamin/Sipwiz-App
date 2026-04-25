export default function Logo({ compact = false, className = '' }) {
  return (
    <div className={`flex items-center gap-3 ${className}`} aria-label="ZIPWIZE drink smarter">
      <img src="/icon.svg" alt="ZIPWIZE Logo" className={compact ? 'h-9 w-9' : 'h-11 w-11'} />
      <div className="leading-none">
        <div className={`${compact ? 'text-xl' : 'text-2xl'} font-black tracking-[0.14em] text-zip-navy`}>ZIPWIZE</div>
        {!compact && <div className="mt-1 text-xs font-bold tracking-[0.32em] text-zip-teal">drink smarter</div>}
      </div>
    </div>
  );
}
