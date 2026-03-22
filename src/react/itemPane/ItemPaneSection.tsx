type ItemPaneSectionProps = {
  data: {
    title: string;
    creators: string;
    year: string;
    abstractPreview: string;
    keyText: string;
  } | null;
  showSelectedText?: boolean;
  selectedText: string;
};

type InfoRowProps = {
  label: string;
  value: string;
  highlighted?: boolean;
};

function InfoRow({ label, value, highlighted = false }: InfoRowProps) {
  return (
    <div className="flex flex-col gap-1 rounded-[8px] bg-[var(--material-sidepane)] border [border:1px_solid_color-mix(in_srgb,var(--fill-primary)_10%,transparent)] px-3 py-2.5">
      <div className="text-[11px] font-bold uppercase tracking-[0.04em] opacity-[0.65]">
        {label}
      </div>
      <div
        className={`break-words leading-[1.45] ${
          highlighted ? "text-[var(--accent-blue)]" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export function ItemPaneSection({
  data,
  showSelectedText = false,
  selectedText,
}: ItemPaneSectionProps) {
  if (!data) {
    return (
      <div className="flex flex-col gap-1.5 px-3 py-4 text-[var(--fill-primary)]">
        <div className="text-[15px] font-bold">No item selected</div>
        <div className="opacity-70">Select an item to inspect it here.</div>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-3 p-3 text-[13px] text-[var(--fill-primary)]">
      <div className="flex flex-col gap-1.5 rounded-[10px] px-3 py-3 [background:linear-gradient(135deg,color-mix(in_srgb,var(--accent-blue)_12%,transparent),color-mix(in_srgb,var(--material-sidepane)_85%,transparent))] [border:1px_solid_color-mix(in_srgb,var(--accent-blue)_18%,transparent)]">
        <div className="text-[11px] font-bold uppercase tracking-[0.08em] opacity-70">
          InSitu AI
        </div>
        <div className="break-words text-[16px] font-bold leading-[1.35]">
          {data.title}
        </div>
        <div className="flex flex-wrap items-center gap-1.5 opacity-[0.85]">
          <span>{data.creators}</span>
          <span className="opacity-[0.45]">|</span>
          <span>{data.year}</span>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <InfoRow label="Creators" value={data.creators} />
        <InfoRow label="Year" value={data.year} />
        <InfoRow label="Abstract" value={data.abstractPreview} />
        <InfoRow label="Key" value={data.keyText} />
        {showSelectedText ? (
          <InfoRow
            label="Selected Text"
            value={selectedText || "No selection captured yet"}
            highlighted
          />
        ) : null}
      </div>
    </section>
  );
}
