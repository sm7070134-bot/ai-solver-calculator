import {
  BarChart2,
  Bot,
  Calculator,
  Clock,
  FileDown,
  Gamepad2,
  IndianRupee,
  Settings,
  Sparkles,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onHistory: () => void;
  onGraph: () => void;
  onExplain: () => void;
  onSettings: () => void;
  onAiSolve: () => void;
  onExportPdf: () => void;
  onChallenge: () => void;
  onEmi: () => void;
}

const tools = [
  {
    icon: Clock,
    label: "History",
    color: "#00BFFF",
    bg: "rgba(0,191,255,0.13)",
    border: "rgba(0,191,255,0.30)",
    glow: "rgba(0,191,255,0.25)",
    key: "history",
  },
  {
    icon: BarChart2,
    label: "Graph",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.13)",
    border: "rgba(168,85,247,0.30)",
    glow: "rgba(168,85,247,0.25)",
    key: "graph",
  },
  {
    icon: Bot,
    label: "AI Explain",
    color: "#FFD700",
    bg: "rgba(255,215,0,0.13)",
    border: "rgba(255,215,0,0.30)",
    glow: "rgba(255,215,0,0.25)",
    key: "explain",
  },
  {
    icon: Sparkles,
    label: "AI Solve",
    color: "#FF8C00",
    bg: "rgba(255,140,0,0.13)",
    border: "rgba(255,140,0,0.30)",
    glow: "rgba(255,140,0,0.25)",
    key: "aisolve",
  },
  {
    icon: Gamepad2,
    label: "Games",
    color: "#FF6584",
    bg: "rgba(255,101,132,0.13)",
    border: "rgba(255,101,132,0.30)",
    glow: "rgba(255,101,132,0.25)",
    key: "challenge",
  },
  {
    icon: IndianRupee,
    label: "EMI Calc",
    color: "#00E5CC",
    bg: "rgba(0,229,204,0.13)",
    border: "rgba(0,229,204,0.30)",
    glow: "rgba(0,229,204,0.25)",
    key: "emi",
  },
  {
    icon: FileDown,
    label: "Export PDF",
    color: "#FF3B30",
    bg: "rgba(255,59,48,0.13)",
    border: "rgba(255,59,48,0.30)",
    glow: "rgba(255,59,48,0.25)",
    key: "pdf",
  },
  {
    icon: Calculator,
    label: "Calculator",
    color: "#C0C0FF",
    bg: "rgba(192,192,255,0.13)",
    border: "rgba(192,192,255,0.30)",
    glow: "rgba(192,192,255,0.25)",
    key: "calculator",
  },
  {
    icon: Settings,
    label: "Settings",
    color: "#D4D4D4",
    bg: "rgba(212,212,212,0.12)",
    border: "rgba(212,212,212,0.25)",
    glow: "rgba(212,212,212,0.18)",
    key: "settings",
  },
];

export function MoreMenu({
  onClose,
  onHistory,
  onGraph,
  onExplain,
  onSettings,
  onAiSolve,
  onExportPdf,
  onChallenge,
  onEmi,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const handlers: Record<string, () => void> = {
    history: onHistory,
    graph: onGraph,
    explain: onExplain,
    settings: onSettings,
    aisolve: onAiSolve,
    pdf: onExportPdf,
    challenge: onChallenge,
    emi: onEmi,
    calculator: onClose,
  };

  const handleTool = (key: string) => {
    if (key === "calculator") {
      onClose();
      return;
    }
    handlers[key]?.();
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: visible ? "auto" : "none",
      }}
      data-ocid="more_menu.modal"
    >
      {/* Full-screen panel slides up from bottom */}
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          background:
            "linear-gradient(180deg, rgba(8,8,12,0.99) 0%, rgba(4,4,8,1) 100%)",
          borderRadius: "24px 24px 0 0",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        data-ocid="more_menu.panel"
      >
        {/* Ambient glow top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: 180,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(168,85,247,0.18) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "20px 20px 8px",
            flexShrink: 0,
          }}
        >
          {/* Drag indicator */}
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 36,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
            }}
          />

          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.9)",
                fontSize: 20,
                fontWeight: 800,
                letterSpacing: 0.5,
                margin: 0,
              }}
            >
              Tools
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                margin: 0,
                letterSpacing: 0.3,
              }}
            >
              CALC AI Pro
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
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
              transition: "background 0.15s",
            }}
            data-ocid="more_menu.close_button"
          >
            <X size={18} />
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
            margin: "0 20px 4px",
            flexShrink: 0,
          }}
        />

        {/* Grid — scrollable */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "16px 16px 40px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14,
            }}
          >
            {tools.map(
              ({ icon: Icon, label, color, bg, border, glow, key }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handleTool(key)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "14px 6px",
                    transition: "transform 0.12s",
                  }}
                  className="active:scale-90"
                  data-ocid={`more_menu.${key}_button`}
                >
                  {/* Icon tile — app icon style */}
                  <div
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 22,
                      background: bg,
                      border: `1.5px solid ${border}`,
                      boxShadow: `0 4px 20px ${glow}, inset 0 1px 0 ${border}`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* Inner shimmer */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "50%",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.07) 0%, transparent 100%)",
                        borderRadius: "22px 22px 0 0",
                        pointerEvents: "none",
                      }}
                    />
                    <Icon
                      size={38}
                      style={{ color, filter: `drop-shadow(0 0 8px ${color})` }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 600,
                      color: "rgba(255,255,255,0.75)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      letterSpacing: 0.2,
                    }}
                  >
                    {label}
                  </span>
                </button>
              ),
            )}
          </div>
        </div>

        {/* Bottom brand */}
        <div
          style={{
            textAlign: "center",
            padding: "8px 0 24px",
            flexShrink: 0,
          }}
        >
          <p
            style={{
              color: "rgba(255,255,255,0.18)",
              fontSize: 11,
              letterSpacing: 1.5,
              textTransform: "uppercase",
            }}
          >
            Powered by Shreyash
          </p>
        </div>
      </div>
    </div>
  );
}
