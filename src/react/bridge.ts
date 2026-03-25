export type ItemPaneData = {
  title: string;
  creators: string;
  year: string;
  abstractPreview: string;
  keyText: string;
};

export type ItemPaneRenderPayload = {
  container: Element;
  data: ItemPaneData | null;
  showSelectedText: boolean;
  selectedText: string;
};

export type PreferencesRenderPayload = {
  container: Element;
};

export type InSituAIReactBridge = {
  renderItemPane(payload: ItemPaneRenderPayload): void;
  renderPreferences(payload: PreferencesRenderPayload): void;
};

export type InSituAIReactWindow = Window & {
  __insituaiReact?: InSituAIReactBridge;
  __insituaiReactLoaded?: boolean;
  __insituaiReactRoots?: WeakMap<Element, unknown>;
  __insituaiReactStyleURL?: string;
  __insituaiReactAssetVersion?: string;
};
