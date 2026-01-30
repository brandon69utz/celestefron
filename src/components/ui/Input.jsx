export default function Input({
  label,
  error,
  className = "",
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-1 block text-sm text-slate-300">
          {label}
        </label>
      )}

      <input
        {...props}
        className={`
          w-full rounded-xl bg-slate-950
          border border-slate-800
          px-3 py-2 text-sm text-slate-100
          outline-none transition
          focus:border-slate-500
          disabled:opacity-50
          ${error ? "border-red-500" : ""}
          ${className}
        `}
      />

      {error && (
        <p className="mt-1 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
