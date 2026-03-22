import { getLocaleID, getString } from "../utils/locale";

const PANEL_ID = "insituai-right-pane";

export class RightPaneFactory {
  private static registered = false;

  static register() {
    if (this.registered) return;

    Zotero.ItemPaneManager.registerSection({
      paneID: PANEL_ID,
      pluginID: addon.data.config.addonID,
      header: {
        l10nID: getLocaleID("item-section-example1-head-text"),
        icon: "chrome://zotero/skin/16/universal/info.svg",
      },
      sidenav: {
        l10nID: getLocaleID("item-section-example1-sidenav-tooltip"),
        icon: "chrome://zotero/skin/20/universal/info.svg",
      },
      onItemChange: ({ tabType, setEnabled }) => {
        setEnabled(tabType === "library");
        return true;
      },
      onRender: ({ body, item, setSectionSummary }) => {
        this.renderBody(body as unknown as Element, item);
        setSectionSummary(item ? "InSituAI" : "No item");
      },
      sectionButtons: [
        {
          type: "copy-title",
          icon: "chrome://zotero/skin/16/universal/copy.svg",
          l10nID: "general-copy",
          onClick: ({ item }) => {
            if (!item) return;
            const title = String(item.getField("title") || "").trim();
            if (!title) return;
            new ztoolkit.Clipboard().addText(title, "text/unicode").copy();
          },
        },
      ],
    });

    this.registered = true;
  }

  static unregister() {
    if (!this.registered) return;
    Zotero.ItemPaneManager.unregisterSection(PANEL_ID);
    this.registered = false;
  }

  private static renderBody(body: Element, item?: Zotero.Item) {
    body.replaceChildren();
    const doc = body.ownerDocument;
    if (!doc) return;

    if (!item) {
      body.appendChild(
        this.makeLine(doc, "No item selected", "Select an item"),
      );
      return;
    }

    const title = String(item.getField("title") || "(Untitled)");
    const creators = item
      .getCreators()
      .map((creator) => this.formatCreator(creator))
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

    body.appendChild(this.makeLine(doc, "Title", title));
    body.appendChild(this.makeLine(doc, "Creators", creators || "Unknown"));
    body.appendChild(this.makeLine(doc, "Year", year));
    body.appendChild(this.makeLine(doc, "Abstract", abstractPreview));
    body.appendChild(
      this.makeLine(doc, "Key", `${item.key} (ID: ${item.id ?? "-"})`),
    );
  }

  private static makeLine(doc: Document, label: string, value: string) {
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

  private static formatCreator(creator: any) {
    if (creator?.name) return creator.name;
    return `${creator?.lastName || ""}${creator?.firstName || ""}`.trim();
  }
}
