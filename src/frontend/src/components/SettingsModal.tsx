import { Info, X } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

export interface Settings {
  soundEnabled: boolean;
  hapticEnabled: boolean;
  voiceContinuous: boolean;
  voiceSensitivity: number;
  language: string;
  theme: "neon" | "amoled" | "luxury" | "cyberpunk";
}

interface Props {
  settings: Settings;
  onChange: (s: Settings) => void;
  onClose: () => void;
  onAbout: () => void;
}

const LANGUAGES = [
  { value: "en-US", label: "English (US)" },
  { value: "es-ES", label: "Español" },
  { value: "fr-FR", label: "Français" },
  { value: "de-DE", label: "Deutsch" },
  { value: "zh-CN", label: "中文" },
  { value: "hi-IN", label: "हिंदी" },
];

const THEMES: {
  value: "neon" | "amoled" | "luxury" | "cyberpunk";
  label: string;
  desc: string;
  dots: string[];
}[] = [
  {
    value: "neon",
    label: "Neon Dark",
    desc: "Classic neon colors",
    dots: ["#FFD700", "#00BFFF", "#39FF14", "#A855F7"],
  },
  {
    value: "amoled",
    label: "AMOLED Black",
    desc: "Pure black ultra contrast",
    dots: ["#E0E0E0", "#00E5FF", "#00E676", "#7C4DFF"],
  },
  {
    value: "luxury",
    label: "Gradient Luxury",
    desc: "Gold & royal tones",
    dots: ["#FFD700", "#FF69B4", "#50C878", "#6A0DAD"],
  },
  {
    value: "cyberpunk",
    label: "Cyberpunk",
    desc: "Electric futuristic neon",
    dots: ["#39FF14", "#FF2D87", "#00FFFF", "#FF00FF"],
  },
];

function Toggle({
  value,
  onChange,
}: { value: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!value)}
      style={{
        position: "relative",
        width: 48,
        height: 24,
        borderRadius: 12,
        background: value ? "var(--clr-yellow)" : "rgba(255,255,255,0.15)",
        boxShadow: value ? "0 0 12px rgba(255,215,0,0.4)" : "none",
        border: "none",
        cursor: "pointer",
        flexShrink: 0,
        transition: "all 0.3s",
      }}
    >
      <span
        style={{
          position: "absolute",
          top: 4,
          width: 16,
          height: 16,
          borderRadius: 8,
          background: "black",
          left: value ? 28 : 4,
          transition: "left 0.3s",
        }}
      />
    </button>
  );
}

export function SettingsModal({ settings, onChange, onClose, onAbout }: Props) {
  const t = useT();

  const update = (patch: Partial<Settings>) =>
    onChange({ ...settings, ...patch });

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
      data-ocid="settings.modal"
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
        <h2 style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}>
          {t.settingsTitle}
        </h2>
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
          data-ocid="settings.close_button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "20px",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {/* Theme Selector */}
          <div
            style={{
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 12,
              }}
            >
              🎨 Theme
            </p>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 10,
              }}
            >
              {THEMES.map((theme) => {
                const isSelected = settings.theme === theme.value;
                return (
                  <button
                    type="button"
                    key={theme.value}
                    onClick={() => update({ theme: theme.value })}
                    style={{
                      padding: "12px",
                      borderRadius: 14,
                      cursor: "pointer",
                      background: isSelected
                        ? "rgba(255,215,0,0.10)"
                        : "rgba(255,255,255,0.04)",
                      border: isSelected
                        ? "2px solid rgba(255,215,0,0.60)"
                        : "2px solid rgba(255,255,255,0.08)",
                      textAlign: "left",
                      transition: "all 0.2s",
                      boxShadow: isSelected
                        ? "0 0 16px rgba(255,215,0,0.15)"
                        : "none",
                    }}
                    data-ocid="settings.toggle"
                  >
                    <div
                      style={{
                        display: "flex",
                        gap: 4,
                        marginBottom: 8,
                      }}
                    >
                      {theme.dots.map((dot) => (
                        <span
                          key={dot}
                          style={{
                            width: 10,
                            height: 10,
                            borderRadius: "50%",
                            background: dot,
                            display: "block",
                            boxShadow: `0 0 6px ${dot}80`,
                          }}
                        />
                      ))}
                    </div>
                    <p
                      style={{
                        color: isSelected ? "var(--clr-yellow)" : "white",
                        fontWeight: 700,
                        fontSize: 13,
                        margin: "0 0 2px",
                      }}
                    >
                      {theme.label}
                    </p>
                    <p
                      style={{
                        color: "rgba(255,255,255,0.45)",
                        fontSize: 11,
                        margin: 0,
                      }}
                    >
                      {theme.desc}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sound */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {t.settingsSoundLabel}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {t.settingsSoundDesc}
              </p>
            </div>
            <Toggle
              value={settings.soundEnabled}
              onChange={(v) => update({ soundEnabled: v })}
            />
          </div>

          {/* Haptic */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {t.settingsHapticLabel}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {t.settingsHapticDesc}
              </p>
            </div>
            <Toggle
              value={settings.hapticEnabled}
              onChange={(v) => update({ hapticEnabled: v })}
            />
          </div>

          {/* Continuous Voice */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div>
              <p
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {t.settingsContinuousLabel}
              </p>
              <p
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  margin: 0,
                }}
              >
                {t.settingsContinuousDesc}
              </p>
            </div>
            <Toggle
              value={settings.voiceContinuous}
              onChange={(v) => update({ voiceContinuous: v })}
            />
          </div>

          {/* Voice Sensitivity */}
          <div
            style={{
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <p
                style={{
                  color: "white",
                  fontWeight: 500,
                  fontSize: 14,
                  margin: 0,
                }}
              >
                {t.settingsSensitivityLabel}
              </p>
              <span
                style={{
                  color: "var(--clr-yellow)",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {settings.voiceSensitivity}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              value={settings.voiceSensitivity}
              onChange={(e) =>
                update({ voiceSensitivity: Number(e.target.value) })
              }
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, var(--clr-yellow) ${settings.voiceSensitivity}%, rgba(255,255,255,0.15) ${settings.voiceSensitivity}%)`,
                outline: "none",
              }}
              data-ocid="settings.input"
            />
          </div>

          {/* Language */}
          <div
            style={{
              padding: "12px 0",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
            }}
          >
            <p
              style={{
                color: "white",
                fontWeight: 500,
                fontSize: 14,
                marginBottom: 8,
              }}
            >
              {t.settingsLanguageLabel}
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {LANGUAGES.map((lang) => (
                <button
                  type="button"
                  key={lang.value}
                  onClick={() => update({ language: lang.value })}
                  style={{
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: 12,
                    fontSize: 14,
                    cursor: "pointer",
                    background:
                      settings.language === lang.value
                        ? "rgba(255,215,0,0.15)"
                        : "rgba(255,255,255,0.05)",
                    border:
                      settings.language === lang.value
                        ? "1px solid rgba(255,215,0,0.40)"
                        : "1px solid rgba(255,255,255,0.08)",
                    color:
                      settings.language === lang.value
                        ? "var(--clr-yellow)"
                        : "rgba(255,255,255,0.70)",
                  }}
                  data-ocid="settings.radio"
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* About */}
          <div style={{ paddingTop: 12 }}>
            <button
              type="button"
              onClick={onAbout}
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                borderRadius: 12,
                cursor: "pointer",
                background: "rgba(255,215,0,0.05)",
                border: "1px solid rgba(255,215,0,0.15)",
              }}
              data-ocid="settings.about_button"
            >
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <Info size={16} style={{ color: "var(--clr-yellow)" }} />
                <p
                  style={{
                    color: "white",
                    fontWeight: 500,
                    fontSize: 14,
                    margin: 0,
                  }}
                >
                  {t.settingsAbout}
                </p>
              </div>
              <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
                ›
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
