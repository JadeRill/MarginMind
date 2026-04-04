import { useEffect, useRef, useState } from "react";

export function CustomDropdown<T extends string>(props: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (v: T) => void;
}) {
  const { value, options, onChange } = props;
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    }
    document.addEventListener("mousedown", handle, true);
    return () => document.removeEventListener("mousedown", handle, true);
  }, [open]);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-full items-center justify-between rounded-md border border-[color-mix(in_srgb,var(--fill-primary)_18%,transparent)] bg-[color-mix(in_srgb,var(--material-sidepane)_84%,var(--fill-primary)_8%)] px-3 text-left text-[14px] outline-none transition focus:border-[var(--accent-blue)]"
      >
        <span>{current?.label ?? value}</span>
        <Chevron open={open} />
      </button>
      {open ? (
        <div
          className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-hidden overflow-y-auto rounded-md border border-[color-mix(in_srgb,var(--fill-primary)_18%,transparent)] bg-[var(--material-sidepane)] shadow-lg"
          onMouseDown={(e) => e.preventDefault()}
        >
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`flex w-full items-center justify-start px-3 py-2 text-left text-[13px] transition-colors hover:bg-[color-mix(in_srgb,var(--accent-blue)_15%,transparent)] ${
                o.value === value
                  ? "bg-[color-mix(in_srgb,var(--accent-blue)_10%,transparent)] font-medium"
                  : ""
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 12 12"
      fill="none"
      className={`shrink-0 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M3 4.5L6 7.5L9 4.5"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
