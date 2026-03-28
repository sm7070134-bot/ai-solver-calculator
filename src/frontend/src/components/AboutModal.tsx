import { BookOpen, Calculator, Clock, Mic, Settings, X } from "lucide-react";
import { useT } from "../i18n/LanguageContext";

interface Props {
  onClose: () => void;
}

export function AboutModal({ onClose }: Props) {
  const t = useT();

  const features = [
    { icon: Calculator, text: t.aboutFeature1 },
    { icon: Mic, text: t.aboutFeature2 },
    { icon: BookOpen, text: t.aboutFeature3 },
    { icon: Clock, text: t.aboutFeature4 },
    { icon: Settings, text: t.aboutFeature5 },
  ];

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: "rgba(0,0,0,0.85)" }}
      role="presentation"
      onClick={onClose}
      onKeyDown={(e) => e.key === "Escape" && onClose()}
      data-ocid="about.modal"
    >
      <div
        className="w-full max-w-md rounded-3xl glass-dark p-6 flex flex-col gap-5 fade-in"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between">
          <div />
          <button
            type="button"
            className="w-8 h-8 rounded-full btn-neutral flex items-center justify-center transition-all active:scale-90"
            onClick={onClose}
            data-ocid="about.close_button"
          >
            <X size={16} />
          </button>
        </div>

        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center text-2xl"
            style={{
              background: "rgba(255,215,0,0.15)",
              border: "1px solid rgba(255,215,0,0.30)",
            }}
          >
            🧮
          </div>
          <h2
            className="font-bold text-2xl mb-1"
            style={{
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255,215,0,0.4)",
            }}
          >
            AI Smart Calculator Pro
          </h2>
          <p className="text-white/40 text-xs tracking-widest uppercase mb-1">
            {t.aboutEdition}
          </p>
          <p
            className="text-xs font-semibold tracking-widest"
            style={{ color: "rgba(255,215,0,0.6)" }}
          >
            {t.aboutVersion}
          </p>
        </div>

        <div className="space-y-3">
          {features.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{
                  background: "rgba(255,215,0,0.12)",
                  color: "#FFD700",
                }}
              >
                <Icon size={14} />
              </div>
              <p className="text-white/70 text-sm">{text}</p>
            </div>
          ))}
        </div>

        <div
          className="rounded-2xl p-4 text-center"
          style={{
            background: "rgba(255,215,0,0.08)",
            border: "1px solid rgba(255,215,0,0.2)",
          }}
        >
          <p className="text-white/70 text-xs uppercase tracking-widest mb-1">
            {t.aboutPoweredBy}
          </p>
          <p
            className="font-bold text-2xl"
            style={{
              color: "#FFD700",
              textShadow: "0 0 20px rgba(255,215,0,0.4)",
            }}
          >
            ⚡ Shreyash
          </p>
        </div>
      </div>
    </div>
  );
}
