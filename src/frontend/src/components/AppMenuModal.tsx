import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { loadChildMode } from "./ChildModeModal";

interface Props {
  onClose: () => void;
  onChildMode: () => void;
}

// SVG icon components for HD 3D look
const YouTubeIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="yt_bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF4444" />
        <stop offset="100%" stopColor="#CC0000" />
      </linearGradient>
      <linearGradient id="yt_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#yt_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#yt_shine)" />
    <polygon points="21,16 21,38 40,27" fill="white" />
  </svg>
);

const ChatGPTIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gpt_bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#19c37d" />
        <stop offset="100%" stopColor="#0a8f5a" />
      </linearGradient>
      <linearGradient id="gpt_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#gpt_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#gpt_shine)" />
    <path
      d="M27 13.5C25.3 13.5 23.8 14.3 22.8 15.5C21.3 15.1 19.5 15.5 18.3 16.6C17.1 17.7 16.7 19.5 17.1 21C15.9 22 15 23.4 15 25C15 26.6 15.9 28 17.1 29C16.7 30.5 17.1 32.3 18.3 33.4C19.5 34.5 21.3 34.9 22.8 34.5C23.8 35.7 25.3 36.5 27 36.5C28.7 36.5 30.2 35.7 31.2 34.5C32.7 34.9 34.5 34.5 35.7 33.4C36.9 32.3 37.3 30.5 36.9 29C38.1 28 39 26.6 39 25C39 23.4 38.1 22 36.9 21C37.3 19.5 36.9 17.7 35.7 16.6C34.5 15.5 32.7 15.1 31.2 15.5C30.2 14.3 28.7 13.5 27 13.5Z"
      fill="white"
      opacity="0.9"
    />
    <circle cx="27" cy="25" r="4" fill="url(#gpt_bg)" />
  </svg>
);

const GeminiIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="gem_bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#4285F4" />
        <stop offset="50%" stopColor="#8B5CF6" />
        <stop offset="100%" stopColor="#DB4437" />
      </linearGradient>
      <linearGradient id="gem_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#gem_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#gem_shine)" />
    <path
      d="M27 11 L29.5 24.5 L43 27 L29.5 29.5 L27 43 L24.5 29.5 L11 27 L24.5 24.5 Z"
      fill="white"
    />
  </svg>
);

const CopilotIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="co_bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#0078D4" />
        <stop offset="100%" stopColor="#50E6FF" />
      </linearGradient>
      <linearGradient id="co_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.35)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#co_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#co_shine)" />
    <circle cx="22" cy="21" r="6" fill="white" opacity="0.9" />
    <circle cx="32" cy="21" r="6" fill="white" opacity="0.7" />
    <circle cx="22" cy="31" r="6" fill="white" opacity="0.7" />
    <circle cx="32" cy="31" r="6" fill="white" opacity="0.5" />
  </svg>
);

const ChromeIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ch_bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#2d2d2d" />
        <stop offset="100%" stopColor="#1a1a1a" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#ch_bg)" />
    <circle cx="27" cy="27" r="13" fill="#4285F4" />
    <path d="M27 14 A13 13 0 0 1 38.3 20.5 L27 20.5 Z" fill="#EA4335" />
    <path d="M38.3 20.5 A13 13 0 0 1 38.3 33.5 L29.25 27 Z" fill="#FBBC05" />
    <path d="M38.3 33.5 A13 13 0 0 1 15.7 33.5 L27 27 Z" fill="#34A853" />
    <path d="M15.7 33.5 A13 13 0 0 1 15.7 20.5 L24.75 27 Z" fill="#EA4335" />
    <path d="M15.7 20.5 A13 13 0 0 1 27 14 L27 20.5 Z" fill="#FBBC05" />
    <circle cx="27" cy="27" r="6" fill="white" />
    <circle cx="27" cy="27" r="4.5" fill="#4285F4" />
  </svg>
);

const CalculatorIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="calc_bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#FF8C00" />
        <stop offset="100%" stopColor="#CC6600" />
      </linearGradient>
      <linearGradient id="calc_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#calc_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#calc_shine)" />
    <rect x="13" y="13" width="28" height="28" rx="5" fill="rgba(0,0,0,0.35)" />
    <rect
      x="15"
      y="15"
      width="24"
      height="8"
      rx="2"
      fill="rgba(255,255,255,0.8)"
    />
    <circle cx="19" cy="29" r="2.5" fill="white" />
    <circle cx="27" cy="29" r="2.5" fill="white" />
    <circle cx="35" cy="29" r="2.5" fill="white" />
    <circle cx="19" cy="36" r="2.5" fill="white" />
    <circle cx="27" cy="36" r="2.5" fill="white" />
    <rect x="33" y="33" width="5" height="5" rx="1" fill="#FF4444" />
  </svg>
);

const PhoneIcon = () => (
  <svg
    role="img"
    aria-label="icon"
    width="54"
    height="54"
    viewBox="0 0 54 54"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <linearGradient id="ph_bg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#34C759" />
        <stop offset="100%" stopColor="#1a8f35" />
      </linearGradient>
      <linearGradient id="ph_shine" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
        <stop offset="100%" stopColor="rgba(255,255,255,0)" />
      </linearGradient>
    </defs>
    <rect width="54" height="54" rx="14" fill="url(#ph_bg)" />
    <rect width="54" height="27" rx="14" fill="url(#ph_shine)" />
    <path
      d="M19 15C18 15 17 16 17 17L17 22C17 34 20 37 32 37L37 37C38 37 39 36 39 35L39 31C39 30 38 29 37 29L33 28C32 28 31 28.5 31 29.5L30 32C28 31 23 26 22 24L25 23C26 23 26.5 22 26.5 21L25.5 17C25.5 16 24.5 15 23.5 15Z"
      fill="white"
    />
  </svg>
);

const apps = [
  {
    label: "YouTube",
    intentUri:
      "intent://www.youtube.com#Intent;scheme=https;package=com.google.android.youtube;S.browser_fallback_url=https%3A%2F%2Fwww.youtube.com;end",
    fallbackUrl: "https://www.youtube.com",
    Icon: YouTubeIcon,
    color: "#FF0000",
  },
  {
    label: "ChatGPT",
    intentUri:
      "intent://chat.openai.com#Intent;scheme=https;package=com.openai.chatgpt;S.browser_fallback_url=https%3A%2F%2Fchat.openai.com;end",
    fallbackUrl: "https://chat.openai.com",
    Icon: ChatGPTIcon,
    color: "#10A37F",
  },
  {
    label: "Gemini",
    intentUri:
      "intent://gemini.google.com#Intent;scheme=https;package=com.google.android.apps.bard;S.browser_fallback_url=https%3A%2F%2Fgemini.google.com;end",
    fallbackUrl: "https://gemini.google.com",
    Icon: GeminiIcon,
    color: "#8B5CF6",
  },
  {
    label: "Copilot",
    intentUri:
      "intent://copilot.microsoft.com#Intent;scheme=https;package=com.microsoft.copilot;S.browser_fallback_url=https%3A%2F%2Fcopilot.microsoft.com;end",
    fallbackUrl: "https://copilot.microsoft.com",
    Icon: CopilotIcon,
    color: "#0078D4",
  },
  {
    label: "Chrome",
    intentUri:
      "intent://www.google.com#Intent;scheme=https;package=com.android.chrome;S.browser_fallback_url=https%3A%2F%2Fwww.google.com;end",
    fallbackUrl: "https://www.google.com",
    Icon: ChromeIcon,
    color: "#4285F4",
  },
  {
    label: "Calculator",
    intentUri:
      "intent://#Intent;action=android.intent.action.MAIN;category=android.intent.category.APP_CALCULATOR;end",
    fallbackUrl: "",
    Icon: CalculatorIcon,
    color: "#FF8C00",
  },
  {
    label: "Phone",
    intentUri: "tel:",
    fallbackUrl: "tel:",
    Icon: PhoneIcon,
    color: "#34C759",
  },
];

export function AppMenuModal({ onClose, onChildMode }: Props) {
  const [visible, setVisible] = useState(false);
  const childModeActive = !!loadChildMode()?.active;

  useEffect(() => {
    const id = requestAnimationFrame(() =>
      requestAnimationFrame(() => setVisible(true)),
    );
    return () => cancelAnimationFrame(id);
  }, []);

  const handleOpen = (app: (typeof apps)[0]) => {
    window.location.href = app.intentUri;
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        pointerEvents: visible ? "auto" : "none",
      }}
      data-ocid="app_menu.modal"
    >
      <div
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          top: 0,
          background:
            "linear-gradient(180deg, rgba(6,6,10,0.99) 0%, rgba(2,2,6,1) 100%)",
          borderRadius: "24px 24px 0 0",
          transform: visible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.38s cubic-bezier(0.32, 0.72, 0, 1)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
        data-ocid="app_menu.panel"
      >
        {/* Ambient glow top */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: "50%",
            transform: "translateX(-50%)",
            width: "90%",
            height: 220,
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(100,100,255,0.14) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "22px 20px 10px",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 12,
              left: "50%",
              transform: "translateX(-50%)",
              width: 40,
              height: 4,
              borderRadius: 2,
              background: "rgba(255,255,255,0.15)",
            }}
          />

          <div>
            <p
              style={{
                color: "rgba(255,255,255,0.95)",
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: 0.5,
                margin: 0,
                background: "linear-gradient(90deg, #fff 0%, #aaa 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              App Menu
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.35)",
                fontSize: 12,
                margin: 0,
                letterSpacing: 0.3,
              }}
            >
              Quick Launch
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            style={{
              width: 42,
              height: 42,
              borderRadius: 13,
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.14)",
              color: "rgba(255,255,255,0.7)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transition: "background 0.15s",
            }}
            data-ocid="app_menu.close_button"
          >
            <X size={20} />
          </button>
        </div>

        {/* Divider */}
        <div
          style={{
            height: 1,
            background:
              "linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)",
            margin: "0 20px 8px",
            flexShrink: 0,
          }}
        />

        {/* Grid */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "20px 12px 40px",
            WebkitOverflowScrolling: "touch",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {apps.map((app, i) => {
              const glow = `${app.color}55`;
              const border = `${app.color}44`;
              const bg = `${app.color}18`;
              return (
                <button
                  type="button"
                  key={app.label}
                  onClick={() => handleOpen(app)}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 10,
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: "12px 4px 14px",
                    transition: "transform 0.12s",
                  }}
                  className="active:scale-90"
                  data-ocid={`app_menu.item.${i + 1}`}
                >
                  {/* Icon container with 3D effect */}
                  <div
                    style={{
                      width: 88,
                      height: 88,
                      borderRadius: 24,
                      background: bg,
                      border: `1.5px solid ${border}`,
                      boxShadow: [
                        `0 8px 32px ${glow}`,
                        "0 2px 8px rgba(0,0,0,0.6)",
                        "inset 0 1px 0 rgba(255,255,255,0.15)",
                        "inset 0 -1px 0 rgba(0,0,0,0.3)",
                      ].join(", "),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      position: "relative",
                      overflow: "hidden",
                    }}
                  >
                    {/* 3D top highlight */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "45%",
                        background:
                          "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 100%)",
                        borderRadius: "24px 24px 0 0",
                        pointerEvents: "none",
                      }}
                    />
                    {/* 3D bottom shadow */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "30%",
                        background:
                          "linear-gradient(0deg, rgba(0,0,0,0.25) 0%, transparent 100%)",
                        borderRadius: "0 0 24px 24px",
                        pointerEvents: "none",
                      }}
                    />
                    <app.Icon />
                  </div>

                  <span
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "rgba(255,255,255,0.85)",
                      textAlign: "center",
                      lineHeight: 1.3,
                      letterSpacing: 0.3,
                    }}
                  >
                    {app.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Child Mode */}
        <div style={{ padding: "0 16px 12px", flexShrink: 0 }}>
          <button
            type="button"
            onClick={onChildMode}
            style={{
              width: "100%",
              padding: "14px 18px",
              borderRadius: 16,
              background: childModeActive
                ? "rgba(57,255,20,0.12)"
                : "rgba(168,85,247,0.12)",
              border: `1.5px solid ${
                childModeActive
                  ? "rgba(57,255,20,0.35)"
                  : "rgba(168,85,247,0.35)"
              }`,
              color: childModeActive ? "#39FF14" : "#A855F7",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              cursor: "pointer",
              transition: "transform 0.12s",
            }}
            className="active:scale-95"
            data-ocid="app_menu.child_mode_button"
          >
            <span style={{ fontSize: 20 }}>
              {childModeActive ? "🟢" : "🔒"}
            </span>
            <span style={{ fontSize: 15, fontWeight: 700 }}>
              {childModeActive
                ? "Child Mode ON — Band Karo"
                : "Child Mode Lagao"}
            </span>
          </button>
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
