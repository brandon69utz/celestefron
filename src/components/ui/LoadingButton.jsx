export default function LoadingButton({
  children,
  loading = false,
  className = "",
  disabled,
  ...props
}) {
  return (
    <button
      disabled={disabled || loading}
      className={`inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition-all duration-200 ${
        loading
          ? "scale-[0.98] opacity-80 cursor-not-allowed"
          : "hover:scale-[1.01] active:scale-[0.98]"
      } ${className}`}
      {...props}
    >
      <span
        className={`inline-block h-4 w-4 rounded-full border-2 border-current border-t-transparent transition-all duration-300 ${
          loading ? "animate-spin opacity-100" : "opacity-0 w-0"
        }`}
      />
      <span className="transition-opacity duration-200">
        {loading ? "Cargando..." : children}
      </span>
    </button>
  );
}