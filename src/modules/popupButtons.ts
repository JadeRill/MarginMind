import { config } from "../../package.json";
import { getPref } from "../utils/prefs";
import { PROMPTS } from "./aiPrefs";

const GROUP_ID = `${config.addonRef}-text-selection-popup-btn-group`;
const LISTENER_ID = `${config.addonRef}-text-selection-popup-listener`;

let listenerRegistered = false;

const docObservers = new Map<Document, MutationObserver>();

// ── Prompts (read from prefs, fallback to defaults) ──────────────────────────

function getQuickActionPrompt(
  key:
    | "quickActionExplainPrompt"
    | "quickActionCritiquePrompt"
    | "quickActionBulletizePrompt"
    | "quickActionTranslatePrompt"
    | "quickActionSummarizePrompt",
  defaultValue: string,
): string {
  const custom = getPref(key);
  return typeof custom === "string" && custom.trim() ? custom : defaultValue;
}

function getExplainPrompt() {
  return getQuickActionPrompt(
    "quickActionExplainPrompt",
    PROMPTS.explainSelection,
  );
}
function getCritiquePrompt() {
  return getQuickActionPrompt(
    "quickActionCritiquePrompt",
    PROMPTS.critiqueSelection,
  );
}
function getBulletizePrompt() {
  return getQuickActionPrompt(
    "quickActionBulletizePrompt",
    PROMPTS.bulletizeSelection,
  );
}
function getTranslatePrompt() {
  return getQuickActionPrompt(
    "quickActionTranslatePrompt",
    PROMPTS.translateSelection,
  );
}
export function getSummarizePrompt() {
  return getQuickActionPrompt(
    "quickActionSummarizePrompt",
    PROMPTS.summarizeFullText,
  );
}

// ── Selection capture (single source of truth) ───────────────────────────────

export let latestSelectionAnnotation: _ZoteroTypes.Annotations.AnnotationJson | null =
  null;

// ── Popup action callback (SidebarPanel registers its send handler) ──────────

type PopupAction = "explain" | "critique" | "bulletize" | "translate" | "add";

type PopupActionCallback = (
  action: PopupAction,
  selectedText: string,
  prompt?: string,
) => void;

export function registerPopupActionCallback(cb: PopupActionCallback): void {
  const mainWin = Zotero.getMainWindow();
  if (mainWin) {
    (mainWin as any)["margin-mind_popupActionCallback"] = cb;
  }
}

export function unregisterPopupActionCallback(): void {
  const mainWin = Zotero.getMainWindow();
  if (mainWin) {
    (mainWin as any)["margin-mind_popupActionCallback"] = undefined;
  }
}

// ── Button creation ──────────────────────────────────────────────────────────

function createSingleButton(
  doc: Document,
  title: string,
  label: string,
  action: PopupAction,
  prompt?: string,
): HTMLElement {
  const btn = doc.createElement("button");
  btn.tabIndex = -1;
  btn.title = title;
  btn.innerHTML = label;
  btn.className = "highlight";
  btn.style.cursor = "pointer";
  btn.style.borderRadius = "4px";
  btn.style.transition = "background-color 0.15s, transform 0.1s ease";
  btn.onmouseenter = () => {
    btn.style.backgroundColor = "rgba(100, 100, 100, 0.1)";
  };
  btn.onmouseleave = () => {
    btn.style.backgroundColor = "transparent";
    btn.style.transform = "scale(1)"; // 确保离开时完全重置
  };
  btn.onmousedown = () => {
    btn.style.backgroundColor = "rgba(100, 100, 100, 0.2)";
    btn.style.transform = "scale(0.9)"; // 缩小到 0.92 效果会比 0.95 更明显一点点
  };

  btn.onmouseup = () => {
    btn.style.backgroundColor = "rgba(100, 100, 100, 0.1)";
    btn.style.transform = "scale(1)";
  };
  btn.onclick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    (e as any).cancelBubble = true;
    handleAction(action, prompt);
  };
  return btn;
}

function handleAction(action: PopupAction, prompt?: string): void {
  const text = latestSelectionAnnotation?.text?.trim();
  if (!text) return;
  const pageLabel = latestSelectionAnnotation?.pageLabel;
  const snippet = `>>>Selected Text (from Page ${pageLabel}):\n${text}`;

  const mainWin = Zotero.getMainWindow();
  if (!mainWin) return;

  const actionCallback = (mainWin as any)["margin-mind_popupActionCallback"] as
    | PopupActionCallback
    | undefined;
  if (actionCallback) {
    actionCallback(action, snippet, prompt);
  } else {
    ztoolkit.log("[PopupButtons] WARNING: actionCallback not found on mainWin");
  }
}

// ── Inject ───────────────────────────────────────────────────────────────────

function tryInject(doc: Document): void {
  const popup = doc.querySelector(".view-popup") as HTMLElement | null;
  if (!popup) {
    latestSelectionAnnotation = null;
    return;
  }
  if (doc.getElementById(GROUP_ID)) return;

  const toolToggle = popup.querySelector(".tool-toggle");
  if (!toolToggle) return;

  const container = doc.createElement("div");
  container.id = GROUP_ID;

  const row1 = doc.createElement("div");
  row1.className = "tool-toggle";
  row1.style.marginBottom = "8px";
  row1.appendChild(
    createSingleButton(
      doc,
      "Explain selection in MarginMind",
      "Explain",
      "explain",
      getExplainPrompt(),
    ),
  );
  row1.appendChild(
    createSingleButton(
      doc,
      "Critique selection in MarginMind",
      "Critique",
      "critique",
      getCritiquePrompt(),
    ),
  );
  container.appendChild(row1);

  const row2 = doc.createElement("div");
  row2.className = "tool-toggle";
  row2.style.marginBottom = "8px";
  row2.appendChild(
    createSingleButton(
      doc,
      "Bulletize selection in MarginMind",
      "Bulletize",
      "bulletize",
      getBulletizePrompt(),
    ),
  );
  row2.appendChild(
    createSingleButton(
      doc,
      "Translate selection in MarginMind",
      "Translate",
      "translate",
      getTranslatePrompt(),
    ),
  );
  container.appendChild(row2);

  const row3 = doc.createElement("div");
  row3.className = "tool-toggle";
  row3.appendChild(
    createSingleButton(
      doc,
      "Add selection to MarginMind",
      "Add to MarginMind",
      "add",
    ),
  );
  container.appendChild(row3);

  toolToggle.after(container);
}

// ── Observer lifecycle ────────────────────────────────────────────────────────

function observeDoc(doc: Document): void {
  // Disconnect any existing observer for this doc
  const existing = docObservers.get(doc);
  if (existing) {
    existing.disconnect();
    docObservers.delete(doc);
  }

  tryInject(doc);

  const observer = new doc.defaultView!.MutationObserver(() => {
    tryInject(doc);
  });
  observer.observe(doc.body, {
    childList: true,
    subtree: true,
  });
  docObservers.set(doc, observer);
}

// ── Single handler: capture selection + inject buttons ───────────────────────

const PopupHandler: _ZoteroTypes.Reader.EventHandler<
  "renderTextSelectionPopup"
> = (event) => {
  // Capture selection text
  latestSelectionAnnotation = event.params.annotation ?? null;

  // Inject buttons into popup
  const doc = event.reader._iframeWindow?.document;
  if (doc) observeDoc(doc);
};

// ── Register / Unregister ────────────────────────────────────────────────────

export function registerTextSelectionPopupButtons(): void {
  if (listenerRegistered) return;

  Zotero.Reader.registerEventListener(
    "renderTextSelectionPopup",
    PopupHandler,
    LISTENER_ID,
  );
  listenerRegistered = true;
  ztoolkit.log("Popup buttons registered");
}

export function unregisterTextSelectionPopupButtons(): void {
  if (!listenerRegistered) return;

  Zotero.Reader.unregisterEventListener(
    "renderTextSelectionPopup",
    PopupHandler,
  );
  listenerRegistered = false;
  latestSelectionAnnotation = null;

  for (const observer of docObservers.values()) {
    observer.disconnect();
  }
  docObservers.clear();

  Zotero.getMainWindows().forEach((win) => {
    const popupDocs = [
      win.document,
      ...Array.from(win.document.querySelectorAll("iframe")).map(
        (f) => (f as HTMLIFrameElement).contentDocument,
      ),
    ];
    popupDocs.forEach((d) => d?.getElementById(GROUP_ID)?.remove());
  });

  ztoolkit.log("Popup buttons unregistered");
}
