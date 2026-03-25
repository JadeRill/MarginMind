import { useEffect, useRef, useState } from "react";
import { config } from "../../../package.json";

type PluginPrefs = {
  enable: boolean;
  input: string;
};

const DEFAULT_PREFS: PluginPrefs = {
  enable: true,
  input: "This is input",
};

const PREFS_PREFIX = config.prefsPrefix;

function readPref<K extends keyof PluginPrefs>(key: K) {
  const value = Zotero.Prefs.get(`${PREFS_PREFIX}.${key}`, true);
  if (key === "enable") {
    return (
      typeof value === "boolean" ? value : DEFAULT_PREFS[key]
    ) as PluginPrefs[K];
  }
  if (key === "input") {
    return (
      typeof value === "string" ? value : DEFAULT_PREFS[key]
    ) as PluginPrefs[K];
  }
  return DEFAULT_PREFS[key];
}

function writePref<K extends keyof PluginPrefs>(key: K, value: PluginPrefs[K]) {
  Zotero.Prefs.set(`${PREFS_PREFIX}.${key}`, value, true);
}

export function PreferencesPanel() {
  const [prefs, setPrefs] = useState<PluginPrefs>(DEFAULT_PREFS);
  const [status, setStatus] = useState<"idle" | "saved">("idle");
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPrefs({
      enable: readPref("enable"),
      input: readPref("input"),
    });
  }, []);

  useEffect(
    () => () => {
      if (timerRef.current) {
        globalThis.clearTimeout(timerRef.current);
      }
    },
    [],
  );

  function markSaved() {
    setStatus("saved");
    if (timerRef.current) {
      globalThis.clearTimeout(timerRef.current);
    }
    timerRef.current = globalThis.setTimeout(() => {
      setStatus("idle");
    }, 1200);
  }

  function updatePref<K extends keyof PluginPrefs>(
    key: K,
    value: PluginPrefs[K],
  ) {
    setPrefs((current) => ({ ...current, [key]: value }));
    writePref(key, value);
    markSaved();
  }

  function resetDefaults() {
    setPrefs(DEFAULT_PREFS);
    writePref("enable", DEFAULT_PREFS.enable);
    writePref("input", DEFAULT_PREFS.input);
    markSaved();
  }

  return (
    <section className="relative min-h-[320px] w-[95%] overflow-hidden rounded-xl border border-[color-mix(in_srgb,var(--accent-blue)_30%,transparent)] bg-[linear-gradient(145deg,color-mix(in_srgb,var(--material-sidepane)_88%,var(--accent-blue)_12%),var(--material-sidepane))] p-5 text-[var(--fill-primary)]">
      <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[color-mix(in_srgb,var(--accent-blue)_24%,transparent)] blur-3xl" />
      <div className="relative flex flex-col gap-5">
        <header className="space-y-1">
          <h2 className="text-xl font-semibold tracking-tight">
            InSituAI Preferences
          </h2>
          <p className="text-sm text-[color-mix(in_srgb,var(--fill-secondary)_80%,white_20%)]">
            State is synced directly to Zotero prefs as you edit.
          </p>
        </header>

        <div className="rounded-lg border border-white/10 bg-black/10 p-4">
          <label className="flex cursor-pointer items-center justify-between gap-4">
            <div className="space-y-0.5">
              <p className="text-sm font-medium">Enable plugin features</p>
              <p className="text-xs text-white/55">
                Turn InSituAI modules on or off globally.
              </p>
            </div>
            <input
              type="checkbox"
              className="h-4 w-4 accent-[var(--accent-blue)]"
              checked={prefs.enable}
              onChange={(event) => updatePref("enable", event.target.checked)}
            />
          </label>
        </div>

        <div className="rounded-lg border border-white/10 bg-black/10 p-4">
          <label
            htmlFor="insituai-pref-input"
            className="mb-2 block text-sm font-medium"
          >
            Default input text
          </label>
          <input
            id="insituai-pref-input"
            type="text"
            value={prefs.input}
            onChange={(event) => updatePref("input", event.target.value)}
            className="w-full rounded-md border border-white/15 bg-black/20 px-3 py-2 text-sm outline-none transition focus:border-[var(--accent-blue)]"
          />
        </div>

        <footer className="flex items-center justify-between">
          <button
            type="button"
            onClick={resetDefaults}
            className="rounded-md border border-white/15 px-3 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/10"
          >
            Reset defaults
          </button>
          <span className="text-xs text-white/60">
            {status === "saved" ? "Saved" : "Auto-save enabled"}
          </span>
        </footer>
      </div>
    </section>
  );
}
