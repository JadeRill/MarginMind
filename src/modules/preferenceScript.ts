import { config } from "../../package.json";
import type { InSituAIReactWindow } from "../react/bridge";

const REACT_WINDOW_SCRIPT_URL = `${rootURI}content/scripts/ui.js`;
const REACT_STYLE_URL = `${rootURI}content/styles/ui.css`;
const REACT_ASSET_VERSION =
  __env__ === "development" ? `${Date.now()}` : "production";

export async function registerPrefsScripts(window: Window) {
  const prefsWindow = window as InSituAIReactWindow;
  ensureReactBridge(prefsWindow);

  const mountNode = prefsWindow.document.getElementById(
    `${config.addonRef}-prefs-root`,
  );
  if (!mountNode) {
    throw new Error("Preference root element was not found");
  }
  if (!prefsWindow.__insituaiReact) {
    throw new Error("React bridge failed to initialize for preferences");
  }

  prefsWindow.__insituaiReact.renderPreferences({
    container: mountNode,
  });
}

function ensureReactBridge(win: InSituAIReactWindow) {
  if (
    win.__insituaiReactLoaded &&
    win.__insituaiReact &&
    win.__insituaiReactAssetVersion === REACT_ASSET_VERSION
  ) {
    return;
  }

  const suffix = __env__ === "development" ? `?t=${REACT_ASSET_VERSION}` : "";
  win.__insituaiReactStyleURL = `${REACT_STYLE_URL}${suffix}`;
  Services.scriptloader.loadSubScript(
    `${REACT_WINDOW_SCRIPT_URL}${suffix}`,
    win,
  );
  win.__insituaiReactLoaded = true;
  win.__insituaiReactAssetVersion = REACT_ASSET_VERSION;
}
