import { useEffect, useState } from "react";

export default function ActionAlert({
  open,
  type = "success",
  title = "",
  message = "",
  onClose,
  duration = 3000,
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!open) {
      setVisible(false);
      return;
    }

    const enterTimer = setTimeout(() => setVisible(true), 10);
    const closeTimer = setTimeout(() => {
      setVisible(false);
      setTimeout(() => onClose?.(), 250);
    }, duration);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(closeTimer);
    };
  }, [open, duration, onClose]);

  const tone =
    type === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : type === "error"
      ? "border-red-200 bg-red-50 text-red-800"
      : "border-blue-200 bg-blue-50 text-blue-800";

  return (
    <div className="pointer-events-none fixed right-4 top-20 z-[100]">
      <div
        className={`pointer-events-auto min-w-[280px] max-w-[360px] rounded-xl border px-4 py-3 shadow-lg transition-all duration-300 ${tone} ${
          visible
            ? "translate-y-0 opacity-100 scale-100"
            : "-translate-y-3 opacity-0 scale-95"
        }`}
      >
        {title && <div className="text-sm font-semibold">{title}</div>}
        {message && <div className="mt-1 text-sm">{message}</div>}
      </div>
    </div>
  );
}