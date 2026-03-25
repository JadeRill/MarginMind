import type { InSituAIReactWindow } from "./bridge";
import { mountItemPane } from "./itemPane/mount";
import { mountPreferences } from "./preferences/mount";

const reactWindow = globalThis as unknown as InSituAIReactWindow;
const REACT_STYLE_ID = "insituai-react-ui-style";

function ensureReactStyles() {
  const doc = reactWindow.document;
  const href = reactWindow.__insituaiReactStyleURL;
  if (!doc || !href) return;

  let link = doc.getElementById(REACT_STYLE_ID) as HTMLLinkElement | null;
  if (!link) {
    link = doc.createElement("link");
    link.id = REACT_STYLE_ID;
    link.rel = "stylesheet";
    doc.documentElement?.appendChild(link);
  }

  if (link.href !== href) {
    link.href = href;
  }
}

reactWindow.__insituaiReact = {
  renderItemPane: mountItemPane,
  renderPreferences: mountPreferences,
};
reactWindow.__insituaiReactLoaded = true;
ensureReactStyles();
