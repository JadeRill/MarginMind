import { createRoot, type Root } from "react-dom/client";
import type { InSituAIReactWindow, PreferencesRenderPayload } from "../bridge";
import { PreferencesPanel } from "./PreferencesPanel";

const reactWindow = globalThis as unknown as InSituAIReactWindow;
const roots =
  (reactWindow.__insituaiReactRoots as WeakMap<Element, Root> | undefined) ??
  new WeakMap<Element, Root>();
reactWindow.__insituaiReactRoots = roots;

export function mountPreferences({ container }: PreferencesRenderPayload) {
  let root = roots.get(container);
  if (!root) {
    root = createRoot(container);
    roots.set(container, root);
  }

  root.render(<PreferencesPanel />);
}
