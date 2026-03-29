import { config } from "../../package.json";

const GROUP_ID = `${config.addonRef}-selection-tools`;
const LISTENER_ID = `${config.addonRef}-selection-tools-listener`;

function createButtonGroup(doc: Document): HTMLElement {
  const group = doc.createElement("div");
  group.id = GROUP_ID;
  group.className = "tool-toggle";
  // group.style.width = "100%";
  // group.style.height = "100%";
  // group.style.padding = "0 8px";

  const copyBtn = doc.createElement("button");
  copyBtn.tabIndex = -1;
  copyBtn.title = "Copy Selected Text";
  copyBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path fill="currentColor" d="M3 3h10a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z"/>
      <circle cx="5.5" cy="7" r="1.2" fill="white"/>
      <circle cx="10.5" cy="7" r="1.2" fill="white"/>
      <rect x="4" y="10" width="8" height="1" rx="0.5" fill="white"/>
      <path stroke="currentColor" stroke-width="1.2" d="M8 3V1"/>
      <circle cx="8" cy="1" r="1" fill="currentColor"/>
  </svg>
  `;
  // copyBtn.style.background = "var(--material-button, #FFFFFF)";
  // copyBtn.style.border =
  //   ".5px solid var(--fill-senary, rgba(0, 0, 0, 0.0196078431))";
  // copyBtn.style.boxShadow =
  //   "0px 0px 0px .5px rgba(0,0,0,.05),0px .5px 2.5px 0px rgba(0,0,0,.3)";
  copyBtn.className = "highlight";
  copyBtn.style.border = "1px solid var(--fill-primary)";
  copyBtn.style.height = "22px";
  // copyBtn.addEventListener("click", () => handleCopy(group));
  copyBtn.addEventListener("click", () => ztoolkit.log("copy clicked"));

  const annotateBtn = doc.createElement("button");
  annotateBtn.tabIndex = -1;
  annotateBtn.title = "Annotate Selection";
  annotateBtn.innerHTML = `
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 15C9 15 9.5 14 9.5 13C9.5 12 8.5 11 8 11C7.5 11 6.5 12 6.5 13C6.5 14 7 15 8 15Z" fill="#FFD400"/>
    <path d="M6 11H10V13C10 13.55 9.55 14 9 14H7C6.45 14 6 13.55 6 13V11Z" fill="#F19837"/>
    <path d="M8 1C6 3 5 5.5 5 8V11H11V8C11 5.5 10 3 8 1Z" fill="#2EA8E5"/>
    <circle cx="8" cy="6" r="1.5" fill="#1A73E8"/>
    <path d="M5 9L3 11H5V9Z" fill="#AAAAAA"/>
    <path d="M11 9L13 11H11V9Z" fill="#AAAAAA"/>
  </svg>
`;
  annotateBtn.className = "underline";
  annotateBtn.style.border = "1px solid var(--fill-primary)";
  annotateBtn.style.height = "22px";
  annotateBtn.addEventListener("click", () => ztoolkit.log("annotate clicked"));

  group.appendChild(copyBtn);
  group.appendChild(annotateBtn);
  return group;
}

// function handleCopy(group: HTMLElement): void {
//   const popup = group.closest(".view-popup") as HTMLElement | null;
//   if (!popup) return;

//   const win = popup.ownerDocument?.defaultView;
//   if (!win) return;

//   const reader = (win as any).Zotero?.Reader?.getByWindow?.(win);
//   if (!reader) return;

//   const selection = reader._lastSelection;
//   const text = selection?.text;
//   if (!text) return;

//   win.navigator.clipboard.writeText(text).then(() => {
//     const btn = group.querySelector(
//       "button:first-child",
//     ) as HTMLButtonElement | null;
//     if (btn) {
//       btn.classList.add("active");
//       setTimeout(() => btn.classList.remove("active"), 800);
//     }
//   });
// }

// function handleAnnotate(group: HTMLElement): void {
//   const popup = group.closest(".view-popup") as HTMLElement | null;
//   if (!popup) return;

//   const win = popup.ownerDocument?.defaultView;
//   if (!win) return;

//   const reader = (win as any).Zotero?.Reader?.getByWindow?.(win);
//   if (!reader) return;

//   const selection = reader._lastSelection;
//   const text = selection?.text;
//   if (!text) return;

//   const annotation = selection?.annotation;
//   if (!annotation) return;

//   (win as any).Zotero?.PaneManager?.show("zotero-pane", "zotero-view-item");

//   const item = (win as any).Zotero?.Reader?.getWindowReader?.(win)?.find(
//     (r: any) => r === reader,
//   )?.item;
//   if (!item) return;

//   const parentItem = item.parentItem || item;
//   const note = new (win as any).Zotero.Item("note");
//   note.setNote(
//     `<p><strong>Annotation:</strong></p><blockquote>${text}</blockquote>`,
//   );
//   note.parentKey = parentItem.key;
//   note.saveTx();

//   const btn = group.querySelector(
//     "button:last-child",
//   ) as HTMLButtonElement | null;
//   if (btn) {
//     btn.classList.add("active");
//     setTimeout(() => btn.classList.remove("active"), 800);
//   }
// }

function injectButtons(popup: HTMLElement, doc: Document): void {
  const existing = doc.getElementById(GROUP_ID);
  if (existing) existing.remove();

  const toolToggle = popup.querySelector(".tool-toggle");
  if (!toolToggle) return;

  const group = createButtonGroup(doc);
  toolToggle.after(group);
}

function cleanup(doc: Document): void {
  const group = doc.getElementById(GROUP_ID);
  if (group) {
    group.remove();
    ztoolkit.log("Selection tools group removed");
  }
}

const selectionHandler: _ZoteroTypes.Reader.EventHandler<
  "renderTextSelectionPopup"
> = (event) => {
  const doc = event.reader._iframeWindow?.document;
  if (!doc) return;

  const popup = doc.querySelector(".view-popup") as HTMLElement | null;
  if (!popup) return;

  const toolToggle = popup.querySelector(".tool-toggle");
  if (!toolToggle) return;

  if (!popup.querySelector(`#${GROUP_ID}`)) {
    injectButtons(popup, doc);
  }
};

export function registerSelectionTools(): void {
  try {
    Zotero.Reader.unregisterEventListener(
      "renderTextSelectionPopup",
      selectionHandler,
    );
  } catch (_error) {}

  Zotero.Reader.registerEventListener(
    "renderTextSelectionPopup",
    selectionHandler,
    LISTENER_ID,
  );

  ztoolkit.log("Selection tools registered");
}

export function unregisterSelectionTools(): void {
  try {
    Zotero.Reader.unregisterEventListener(
      "renderTextSelectionPopup",
      selectionHandler,
    );
  } catch (_error) {}

  for (const win of Zotero.getMainWindows()) {
    cleanup(win.document);
  }

  ztoolkit.log("Selection tools unregistered");
}
