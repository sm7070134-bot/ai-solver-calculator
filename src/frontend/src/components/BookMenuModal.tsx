import { Atom, BookOpen, FlaskConical, X } from "lucide-react";
import { useEffect, useState } from "react";

interface Props {
  onClose: () => void;
  onMath: () => void;
  onPhysics: () => void;
  onChemistry: () => void;
}

const subjects = [
  {
    icon: BookOpen,
    label: "Class 11\nMath",
    color: "#A855F7",
    bg: "rgba(168,85,247,0.13)",
    border: "rgba(168,85,247,0.30)",
    glow: "rgba(168,85,247,0.30)",
    key: "math",
    emoji: "📐",
  },
  {
    icon: Atom,
    label: "Class 11\nPhysics",
    color: "#FF6B35",
    bg: "rgba(255,107,53,0.13)",
    border: "rgba(255,107,53,0.30)",
    glow: "rgba(255,107,53,0.30)",
    key: "physics",
    emoji: "⚛️",
  },
  {
    icon: FlaskConical,
    label: "Class 11\nChemistry",
    color: "#00E5CC",
    bg: "rgba(0,229,204,0.13)",
    border: "rgba(0,229,204,0.30)",
    glow: "rgba(0,229,204,0.30)",
    key: "chemistry",
    emoji: "🧪",
  },
];

export function BookMenuModal({
  onClose,
  onMath,
  onPhysics,
  onChemistry,
}: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const handlers: Record<string, () => void> = {
    math: onMath,
    physics: onPhysics,
    chemistry: onChemistry,
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: visible ? "auto" : "none",
      }}
      data-ocid="book_menu.modal"
    >
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
        data-ocid="book_menu.panel"
      >
        {/* Ambient glow */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "80%",
            height: 200,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(0,229,204,0.15) 0%, transparent 70%)",
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
              📚 Study Books
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                margin: 0,
                letterSpacing: 0.3,
              }}
            >
              Class 11 Formulas & Equations
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
            }}
            data-ocid="book_menu.close_button"
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

        {/* Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 16px 40px",
            WebkitOverflowScrolling: "touch",
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 20,
              width: "100%",
              maxWidth: 400,
            }}
          >
            {subjects.map(
              ({ icon: Icon, label, color, bg, border, glow, key, emoji }) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => handlers[key]?.()}
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
                  data-ocid={`book_menu.${key}_button`}
                >
                  {/* Icon tile */}
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
                      flexDirection: "column",
                      gap: 4,
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
                    <span style={{ fontSize: 24, lineHeight: 1 }}>{emoji}</span>
                    <Icon
                      size={20}
                      style={{ color, filter: `drop-shadow(0 0 6px ${color})` }}
                    />
                  </div>

                  <span
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.80)",
                      textAlign: "center",
                      lineHeight: 1.4,
                      letterSpacing: 0.2,
                      whiteSpace: "pre-line",
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
          style={{ textAlign: "center", padding: "8px 0 24px", flexShrink: 0 }}
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
