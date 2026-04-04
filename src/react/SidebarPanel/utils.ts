import type { ChatSession } from "./hooks/useChatSession";

export const uid = (p: string) => `${p}-${Date.now()}`;

export const EMPTY_TITLE = "New chat";

export const ROLE_LABEL: Record<string, string> = {
  assistant: "MarginMind",
  user: "You",
};

export const toTime = (ts: number) => {
  const d = new Date(ts);
  const MM = String(d.getMonth() + 1).padStart(2, "0");
  const DD = String(d.getDate()).padStart(2, "0");
  const HH = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");

  return `${MM}-${DD} ${HH}:${mm}`;
};

export const createSession = (partial?: Partial<ChatSession>): ChatSession => ({
  id: partial?.id ?? uid("session"),
  title: partial?.title ?? EMPTY_TITLE,
  updatedAt: partial?.updatedAt ?? Date.now(),
  messages: partial?.messages ?? [],
  draft: partial?.draft ?? "",
});

export const trimTitle = (text: string) => {
  const s = text.replace(/\s+/g, " ").trim();
  return !s ? EMPTY_TITLE : s;
};

export const truncateMiddle = (
  text: string,
  headLength: number,
  tailLength: number,
): string => {
  if (text.length <= headLength + tailLength) return text;

  const head = text.slice(0, headLength);
  const tail = text.slice(-tailLength);
  const omittedCount = text.length - head.length - tail.length;

  const result = `${head}

> *🤖 Full text has been passed to AI 🤖*
> *✂️ [${omittedCount.toLocaleString()} characters omitted from preview] ✂️*

${tail}`;

  return result;
};

export const isAbortError = (error: unknown): boolean =>
  error instanceof DOMException
    ? error.name === "AbortError"
    : error instanceof Error
      ? error.name === "AbortError" ||
        /aborted|cancelled|canceled/i.test(error.message)
      : false;

export const getContextSummary = (
  data: { title?: string; creators?: string; year?: string } | null,
): string => {
  if (!data) return "No active item context";
  return `${data.title} · ${data.creators} · ${data.year}`;
};

export const getContextTooltip = (
  data: {
    title?: string;
    creators?: string;
    year?: string;
    keyText?: string;
  } | null,
): string => {
  if (!data) return "No active item context";
  return `${data.title} / ${data.creators} / ${data.year} / ${data.keyText}`;
};
