import { useEffect, useMemo, useRef, useState } from "react";

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

type ChatMessage = {
  id: string;
  role: "assistant" | "user" | "system";
  text: string;
  meta?: string;
};

function makeAssistantGreeting(
  data: NonNullable<ItemPaneSectionProps["data"]>,
) {
  return "I have the paper context loaded. Ask for a summary, critique, rewrite, extraction, or use the reader selection as grounded evidence.";
}

function makeSelectionPrompt(selection: string) {
  return `Use this selection as evidence and explain its role in the paper:\n\n${selection}`;
}

function makeAssistantReply(args: {
  prompt: string;
  data: NonNullable<ItemPaneSectionProps["data"]>;
  selectedText: string;
}) {
  const { prompt, data, selectedText } = args;
  const focus = selectedText
    ? `I will ground the response in the current reader selection first, then connect it back to ${data.title}.`
    : `I will ground the response in the paper metadata and abstract for ${data.title}.`;

  return `${focus}\n\nSuggested next step: ${prompt}\n\nWorking context: ${data.creators} | ${data.year}`;
}

function createInitialMessages(
  data: NonNullable<ItemPaneSectionProps["data"]>,
): ChatMessage[] {
  return [
    {
      id: "assistant-greeting",
      role: "assistant",
      text: makeAssistantGreeting(data),
      meta: "Context ready",
    },
  ];
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isAssistant = message.role === "assistant";
  const isSystem = message.role === "system";

  return (
    <div
      className={`flex ${isAssistant || isSystem ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[92%] min-w-0 rounded-2xl border px-3.5 py-3 ${
          isSystem
            ? "border-[var(--accent-blue)]/20 bg-[color-mix(in_srgb,var(--accent-blue)_10%,transparent)] text-[12px] text-white/75"
            : isAssistant
              ? "border-white/10 bg-white/5 text-[13px] text-[var(--fill-primary)]"
              : "border-[var(--accent-blue)]/35 bg-[color-mix(in_srgb,var(--accent-blue)_22%,transparent)] text-[13px] text-[var(--fill-primary)]"
        }`}
      >
        <div className="mb-1 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/45">
          <span>{isAssistant ? "InSitu" : isSystem ? "Selection" : "You"}</span>
          {message.meta ? (
            <span className="text-white/30">{message.meta}</span>
          ) : null}
        </div>
        <div className="whitespace-pre-wrap break-words leading-6">
          {message.text}
        </div>
      </div>
    </div>
  );
}

function EmptyPane() {
  return (
    <div className="cline-shell w-full min-w-0 rounded-xl border border-white/10 px-4 py-5 text-[var(--fill-primary)]">
      <div className="text-[15px] font-semibold">No item selected</div>
      <div className="mt-1 text-[13px] text-white/55">
        Select an item to open the assistant workspace.
      </div>
    </div>
  );
}

export function ItemPaneSection({
  data,
  showSelectedText = false,
  selectedText,
}: ItemPaneSectionProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [draft, setDraft] = useState("");
  const [queuedSelection, setQueuedSelection] = useState("");
  const selectionSignatureRef = useRef("");
  const itemSignature = data?.keyText ?? "";

  useEffect(() => {
    if (!data) {
      setMessages([]);
      setDraft("");
      setQueuedSelection("");
      selectionSignatureRef.current = "";
      return;
    }

    setMessages(createInitialMessages(data));
    setDraft("");
    setQueuedSelection(showSelectedText ? selectedText : "");
    selectionSignatureRef.current = showSelectedText ? selectedText : "";
  }, [itemSignature, data, selectedText, showSelectedText]);

  useEffect(() => {
    if (!data || !showSelectedText || !selectedText) return;
    if (selectionSignatureRef.current === selectedText) return;

    selectionSignatureRef.current = selectedText;
    setQueuedSelection(selectedText);
    setMessages((current) => {
      const next = current.filter(
        (message) => message.id !== "selection-context",
      );
      next.push({
        id: "selection-context",
        role: "system",
        text: selectedText,
        meta: "Reader selection synced",
      });
      return next;
    });
  }, [data, selectedText, showSelectedText]);

  const quickActions = useMemo(
    () => [
      "Summarize the paper",
      "Extract the main claim",
      "Critique the argument",
      "Turn selection into notes",
    ],
    [],
  );

  if (!data) {
    return <EmptyPane />;
  }

  const itemData = data;

  function send(prompt: string) {
    const trimmed = prompt.trim();
    if (!trimmed) return;

    const stamp = Date.now();
    setMessages((current) => [
      ...current,
      {
        id: `user-${stamp}`,
        role: "user",
        text: trimmed,
      },
      {
        id: `assistant-${stamp}`,
        role: "assistant",
        text: makeAssistantReply({
          prompt: trimmed,
          data: itemData,
          selectedText: queuedSelection,
        }),
        meta: queuedSelection
          ? "Using selection context"
          : "Using paper context",
      },
    ]);
    setDraft("");
  }

  function useSelection() {
    if (!queuedSelection) return;
    const nextDraft = draft.trim()
      ? `${draft.trim()}\n\n${makeSelectionPrompt(queuedSelection)}`
      : makeSelectionPrompt(queuedSelection);
    setDraft(nextDraft);
  }

  return (
    <section className="cline-shell w-full min-w-0">
      <header className="shrink-0 border-b border-white/8 px-3 py-3">
        <div className="cline-panel flex min-w-0 items-start gap-3 px-3 py-3">
          {/* <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[linear-gradient(180deg,#3b82f6,#1d4ed8)] text-[13px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)]">
            C
          </div> */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <div className="truncate text-[13px] font-semibold text-[var(--fill-primary)]">
                Cline-style Research Agent
              </div>
              <span className="cline-badge">Claude 3.5 Sonnet</span>
            </div>
            <div className="mt-1 truncate text-[12px] text-white/55">
              {itemData.title}
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <span className="cline-tool-pill">Read</span>
              <span className="cline-tool-pill">Plan</span>
              <span className="cline-tool-pill">Write Notes</span>
              {showSelectedText ? (
                <span className="cline-tool-pill">Reader Sync</span>
              ) : null}
            </div>
          </div>
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="shrink-0 px-3 pt-3">
          <div className="cline-panel flex flex-wrap items-center gap-2 px-3 py-2.5 text-[11px] text-white/65">
            <span className="font-medium text-white/80">Context</span>
            <span>{itemData.creators}</span>
            <span className="text-white/25">/</span>
            <span>{itemData.year}</span>
            <span className="text-white/25">/</span>
            <span className="truncate">{itemData.keyText}</span>
          </div>
        </div>

        <div className="cline-scrollbar min-h-0 flex-1 space-y-3 overflow-y-auto px-3 py-3">
          <div className="cline-panel px-3 py-3 text-[12px] leading-6 text-white/65">
            <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-white/35">
              System Prompt
            </div>
            Abstract context is preloaded. The assistant should stay grounded in
            the paper and the active reader selection.
          </div>

          {messages.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>

        <footer className="shrink-0 border-t border-white/8 px-3 py-3">
          {queuedSelection ? (
            <div className="cline-panel mb-3 px-3 py-3">
              <div className="mb-2 flex flex-wrap items-start justify-between gap-2">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/40">
                    Reader Selection
                  </div>
                  <div className="text-[12px] text-white/60">
                    Live synced from Zotero Reader
                  </div>
                </div>
                <button
                  className="rounded-lg border border-[var(--accent-blue)]/25 bg-[color-mix(in_srgb,var(--accent-blue)_16%,transparent)] px-2.5 py-1.5 text-[11px] font-medium text-[var(--fill-primary)] transition hover:bg-[color-mix(in_srgb,var(--accent-blue)_24%,transparent)]"
                  onClick={useSelection}
                  type="button"
                >
                  Insert Into Prompt
                </button>
              </div>
              <div className="max-h-24 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border border-white/8 bg-black/10 px-3 py-2 text-[12px] leading-5 text-white/78">
                {queuedSelection}
              </div>
            </div>
          ) : null}

          <div className="mb-2 flex flex-wrap gap-2">
            {quickActions.map((action) => (
              <button
                key={action}
                className="cline-badge transition hover:bg-white/10 hover:text-white"
                onClick={() => send(action)}
                type="button"
              >
                {action}
              </button>
            ))}
          </div>

          <div className="cline-panel px-3 py-3">
            <textarea
              className="cline-composer cline-scrollbar"
              onChange={(event) => setDraft(event.target.value)}
              placeholder="Ask about the paper, the current section, or use the reader selection as evidence..."
              value={draft}
            />
            <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex min-w-0 flex-wrap items-center gap-2 text-[11px] text-white/45">
                <span className="cline-tool-pill">Paper loaded</span>
                {queuedSelection ? (
                  <span className="cline-tool-pill">Selection ready</span>
                ) : null}
              </div>
              <button
                className="rounded-xl bg-[linear-gradient(180deg,#3b82f6,#1d4ed8)] px-3.5 py-2 text-[12px] font-semibold text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.18)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-40"
                disabled={!draft.trim()}
                onClick={() => send(draft)}
                type="button"
              >
                Send Message
              </button>
            </div>
          </div>
        </footer>
      </div>
    </section>
  );
}

