export default function Card({ title, subtitle, right, children, className = "" }) {
  return (
    <section
      className={[
        "rounded-2xl border border-slate-800 bg-slate-900/20",
        "shadow-[0_0_0_1px_rgba(15,23,42,0.2)]",
        className,
      ].join(" ")}
    >
      {(title || subtitle || right) && (
        <header className="flex items-start justify-between gap-3 border-b border-slate-800 p-4">
          <div>
            {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
          </div>
          {right && <div className="shrink-0">{right}</div>}
        </header>
      )}

      <div className="p-4">{children}</div>
    </section>
  );
}
