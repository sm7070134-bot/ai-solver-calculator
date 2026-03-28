import { Clock, Search, Trash2, X } from "lucide-react";
import { useMemo, useState } from "react";
import { useT } from "../i18n/LanguageContext";

export interface HistoryEntry {
  expr: string;
  result: string;
  id: number;
}

// Keep CloudHistoryEntry exported so App.tsx doesn't break if imported elsewhere
export interface CloudHistoryEntry {
  id: bigint;
  expression: string;
  result: string;
  timestamp: bigint;
  pinned: boolean;
}

interface Props {
  history: HistoryEntry[];
  onRestore: (result: string) => void;
  onClear: () => void;
  onClose: () => void;
  onDeleteEntry?: (id: number) => void;
}

function groupLocalByDate(
  entries: HistoryEntry[],
): { label: string; items: HistoryEntry[] }[] {
  const now = new Date();
  const today = now.toDateString();
  const yesterday = new Date(now.getTime() - 86400000).toDateString();
  const weekAgo = new Date(now.getTime() - 7 * 86400000);

  const groups: Record<string, HistoryEntry[]> = {
    Today: [],
    Yesterday: [],
    "This Week": [],
    Older: [],
  };

  for (const e of entries) {
    const d = new Date(e.id); // id = Date.now()
    const ds = d.toDateString();
    if (ds === today) groups.Today.push(e);
    else if (ds === yesterday) groups.Yesterday.push(e);
    else if (d >= weekAgo) groups["This Week"].push(e);
    else groups.Older.push(e);
  }

  return Object.entries(groups)
    .filter(([, items]) => items.length > 0)
    .map(([label, items]) => ({ label, items }));
}

export function HistoryPanel({
  history,
  onRestore,
  onClear,
  onClose,
  onDeleteEntry,
}: Props) {
  const t = useT();
  const [search, setSearch] = useState("");

  const filteredLocal = useMemo(() => {
    if (!search) return history;
    const q = search.toLowerCase();
    return history.filter(
      (e) =>
        e.expr.toLowerCase().includes(q) || e.result.toLowerCase().includes(q),
    );
  }, [history, search]);

  const groups = groupLocalByDate(filteredLocal);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        background: "rgba(8,8,12,0.99)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      data-ocid="history.panel"
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Clock size={18} style={{ color: "#00BFFF" }} />
          <h2
            style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}
          >
            {t.historyTitle}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {history.length > 0 && (
            <button
              type="button"
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                background: "rgba(255,59,48,0.15)",
                border: "1px solid rgba(255,59,48,0.30)",
                color: "#FF6058",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              onClick={onClear}
              data-ocid="history.delete_button"
            >
              <Trash2 size={16} />
            </button>
          )}
          <button
            type="button"
            style={{
              width: 40,
              height: 40,
              borderRadius: 12,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={onClose}
            data-ocid="history.close_button"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "20px",
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        {/* Search */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 12px",
            borderRadius: 12,
            background: "rgba(255,255,255,0.06)",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <Search
            size={13}
            style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search history…"
            style={{
              flex: 1,
              background: "transparent",
              color: "white",
              fontSize: 14,
              outline: "none",
              border: "none",
            }}
            data-ocid="history.search_input"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              style={{
                color: "rgba(255,255,255,0.3)",
                fontSize: 12,
                background: "none",
                border: "none",
                cursor: "pointer",
              }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Content */}
        <div>
          {filteredLocal.length === 0 && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: 12,
                padding: "48px 0",
              }}
              data-ocid="history.empty_state"
            >
              <p style={{ fontSize: 40, margin: 0 }}>{t.historyNone}</p>
              <p style={{ color: "rgba(255,255,255,0.4)", fontSize: 14 }}>
                {t.historyEmpty}
              </p>
            </div>
          )}

          {groups.map((g) => (
            <div key={g.label} style={{ marginBottom: 12 }}>
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  padding: "0 4px",
                  marginBottom: 6,
                }}
              >
                {g.label}
              </p>
              {g.items.map((entry, i) => (
                <div
                  key={entry.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    borderRadius: 12,
                    padding: 12,
                    marginBottom: 4,
                    background: "rgba(255,255,255,0.05)",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                  data-ocid={`history.item.${i + 1}`}
                >
                  <button
                    type="button"
                    style={{
                      flex: 1,
                      textAlign: "left",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      onRestore(entry.result);
                      onClose();
                    }}
                  >
                    <p
                      style={{
                        color: "rgba(255,255,255,0.5)",
                        fontSize: 12,
                        marginBottom: 2,
                        fontFamily: "monospace",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {entry.expr}
                    </p>
                    <p
                      style={{
                        color: "white",
                        fontWeight: 600,
                        fontSize: 18,
                        lineHeight: 1.2,
                        margin: 0,
                      }}
                    >
                      {entry.result}
                    </p>
                  </button>
                  {onDeleteEntry && (
                    <button
                      type="button"
                      onClick={() => onDeleteEntry(entry.id)}
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 8,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        flexShrink: 0,
                      }}
                      data-ocid={`history.delete_button.${i + 1}`}
                    >
                      <Trash2
                        size={12}
                        style={{ color: "rgba(255,59,48,0.7)" }}
                      />
                    </button>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
