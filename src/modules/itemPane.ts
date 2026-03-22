/*
 * Copyright (c) 2026 by hqwang, All Rights Reserved.
 *
 * @Software     : VScode
 * @Author       : hqwang
 * @Date         : 2026-03-22 13:43:18
 * @LastEditTime : 2026-03-22 14:30:19
 * @Description  :
 */
import { getLocaleID, getString } from "../utils/locale";

export default function registerItemPane() {
  Zotero.ItemPaneManager.registerSection({
    paneID: "insituai-pane",
    pluginID: addon.data.config.addonID,
    header: {
      l10nID: getLocaleID("item-pane-head-text"),
      icon: "chrome://zotero/skin/16/universal/info.svg",
    },
    sidenav: {
      l10nID: getLocaleID("item-section-example1-sidenav-tooltip"),
      icon: "chrome://zotero/skin/20/universal/note.svg",
    },
    onItemChange: ({ tabType, setEnabled }) => {
      setEnabled(tabType === "library");
      return true;
    },
    onRender: ({ body, item, setSectionSummary }) => {
      body.replaceChildren();
      const doc = body.ownerDocument;

      if (!doc) return;
      if (!item) {
        body.appendChild(makeLine(doc, "No item selected", "Select an item"));
        return;
      }

      const title = String(item.getField("title") || "(Untitled)");
      const creators = item
        .getCreators()
        .map((creator) => creator)
        .filter(Boolean)
        .join(", ");
      const date = String(item.getField("date") || "");
      const year = date.match(/\d{4}/)?.[0] || "Unknown";
      const abstractText = String(item.getField("abstractNote") || "")
        .replace(/\s+/g, " ")
        .trim();
      const abstractPreview =
        abstractText.length > 180
          ? `${abstractText.slice(0, 180)}...`
          : abstractText || "No abstract";

      body.appendChild(makeLine(doc, "Title", title));
      body.appendChild(makeLine(doc, "Creators", creators || "Unknown"));
      body.appendChild(makeLine(doc, "Year", year));
      body.appendChild(makeLine(doc, "Abstract", abstractPreview));
      body.appendChild(
        makeLine(doc, "Key", `${item.key} (ID: ${item.id ?? "-"})`),
      );
    },
    // sectionButtons: [
    //   {
    //     type: "copy-title",
    //     icon: "chrome://zotero/skin/16/universal/copy.svg",
    //     l10nID: "general-copy",
    //     onClick: ({ item }) => {
    //       if (!item) return;
    //       const title = String(item.getField("title") || "").trim();
    //       if (!title) return;
    //       new ztoolkit.Clipboard().addText(title, "text/unicode").copy();
    //     },
    //   },
    // ],
  });
}

function makeLine(doc: Document, label: string, value: string) {
  const wrap = ztoolkit.UI.createElement(doc, "div", {
    namespace: "html",
    styles: {
      marginBottom: "8px",
      lineHeight: "1.4",
    },
  });

  const labelNode = ztoolkit.UI.createElement(doc, "div", {
    namespace: "html",
    styles: {
      fontWeight: "600",
      marginBottom: "2px",
    },
    properties: { textContent: label },
  });

  const valueNode = ztoolkit.UI.createElement(doc, "div", {
    namespace: "html",
    styles: {
      color: "var(--fill-primary)",
      wordBreak: "break-word",
    },
    properties: { textContent: value },
  });

  wrap.append(labelNode, valueNode);
  return wrap;
}
