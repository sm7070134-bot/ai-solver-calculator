import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

export interface ChildModeConfig {
  active: boolean;
  pin: string;
  name: string;
  favouriteGame: string;
}

const STORAGE_KEY = "childModeConfig";

export function loadChildMode(): ChildModeConfig | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as ChildModeConfig;
  } catch {
    return null;
  }
}

export function clearChildMode() {
  localStorage.removeItem(STORAGE_KEY);
}

export function saveChildMode(cfg: ChildModeConfig) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cfg));
}

// ——— PIN Pad ———
function PinDisplay({ pin }: { pin: string }) {
  return (
    <div
      style={{
        display: "flex",
        gap: 16,
        justifyContent: "center",
        marginBottom: 24,
      }}
    >
      {[0, 1, 2, 3].map((i) => (
        <div
          key={`dot-${i}`}
          style={{
            width: 18,
            height: 18,
            borderRadius: "50%",
            background: pin.length > i ? "#00BFFF" : "rgba(255,255,255,0.15)",
            border:
              pin.length > i
                ? "2px solid #00BFFF"
                : "2px solid rgba(255,255,255,0.25)",
            boxShadow: pin.length > i ? "0 0 10px #00BFFF" : "none",
            transition: "all 0.15s",
          }}
        />
      ))}
    </div>
  );
}

function PinPad({
  onDigit,
  onBackspace,
}: { onDigit: (d: string) => void; onBackspace: () => void }) {
  const digits = [
    { id: "d1", val: "1" },
    { id: "d2", val: "2" },
    { id: "d3", val: "3" },
    { id: "d4", val: "4" },
    { id: "d5", val: "5" },
    { id: "d6", val: "6" },
    { id: "d7", val: "7" },
    { id: "d8", val: "8" },
    { id: "d9", val: "9" },
    { id: "d_empty", val: "" },
    { id: "d0", val: "0" },
    { id: "d_back", val: "←" },
  ];
  return (
    <div
      style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}
    >
      {digits.map(({ id, val: d }) => (
        <button
          key={id}
          type="button"
          onClick={() => {
            if (d === "←") onBackspace();
            else if (d) onDigit(d);
          }}
          disabled={!d}
          style={{
            height: 52,
            borderRadius: 14,
            background:
              d === "←"
                ? "rgba(255,60,60,0.18)"
                : d
                  ? "rgba(0,191,255,0.10)"
                  : "transparent",
            border: d ? "1.5px solid rgba(0,191,255,0.25)" : "none",
            color: d === "←" ? "#FF6058" : "rgba(255,255,255,0.9)",
            fontSize: d === "←" ? 18 : 20,
            fontWeight: 700,
            cursor: d ? "pointer" : "default",
            transition: "transform 0.1s, background 0.1s",
          }}
          className={d ? "active:scale-90" : ""}
          data-ocid={
            d === "←"
              ? "childmode.pin_backspace"
              : d
                ? `childmode.pin_digit_${d}`
                : undefined
          }
        >
          {d}
        </button>
      ))}
    </div>
  );
}

// ——— OVERLAY WRAPPER ———
function ModalOverlay({
  children,
  onClose,
}: { children: React.ReactNode; onClose?: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 200,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
      }}
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 28 }}
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "100%",
          maxWidth: 380,
          background:
            "linear-gradient(160deg, rgba(12,12,20,0.98) 0%, rgba(4,4,12,1) 100%)",
          border: "1.5px solid rgba(0,191,255,0.2)",
          borderRadius: 24,
          padding: "28px 24px",
          boxShadow:
            "0 20px 60px rgba(0,0,0,0.8), 0 0 40px rgba(0,191,255,0.07)",
          position: "relative",
        }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

// ——— SETUP MODAL (3 steps) ———
interface SetupProps {
  onClose: () => void;
  onDone: () => void;
}

export function ChildModeSetupModal({ onClose, onDone }: SetupProps) {
  const [step, setStep] = useState(1);
  const [pin1, setPin1] = useState("");
  const [pin2, setPin2] = useState("");
  const [confirmMode, setConfirmMode] = useState(false);
  const [name, setName] = useState("");
  const [favGame, setFavGame] = useState("");
  const [pinError, setPinError] = useState("");
  const [shake, setShake] = useState(false);
  const [success, setSuccess] = useState(false);

  const doShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigit = (d: string) => {
    if (!confirmMode) {
      if (pin1.length < 4) {
        const next = pin1 + d;
        setPin1(next);
        if (next.length === 4) {
          setConfirmMode(true);
          setPinError("");
        }
      }
    } else {
      if (pin2.length < 4) {
        const next = pin2 + d;
        setPin2(next);
        if (next.length === 4) {
          if (pin1 === next) {
            setStep(2);
          } else {
            setPinError("PIN match nahi hua! Dobara try karo.");
            setPin2("");
            setPin1("");
            setConfirmMode(false);
            doShake();
          }
        }
      }
    }
  };

  const handleBack = () => {
    if (!confirmMode) {
      if (pin1.length > 0) setPin1(pin1.slice(0, -1));
    } else {
      if (pin2.length > 0) setPin2(pin2.slice(0, -1));
      else {
        setConfirmMode(false);
        setPin1("");
      }
    }
  };

  const handleFinish = () => {
    if (!name.trim() || !favGame.trim()) return;
    saveChildMode({
      active: true,
      pin: pin1,
      name: name.trim(),
      favouriteGame: favGame.trim(),
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onDone();
    }, 1800);
  };

  return (
    <AnimatePresence>
      <ModalOverlay>
        {success ? (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
            <p
              style={{
                color: "#39FF14",
                fontSize: 22,
                fontWeight: 800,
                margin: 0,
              }}
            >
              Child Mode ON ho gaya!
            </p>
            <p
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 14,
                marginTop: 8,
              }}
            >
              App Menu ab lock hai
            </p>
          </div>
        ) : (
          <>
            {/* Steps indicator */}
            <div
              style={{
                display: "flex",
                gap: 8,
                justifyContent: "center",
                marginBottom: 24,
              }}
            >
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  style={{
                    width: s === step ? 28 : 8,
                    height: 8,
                    borderRadius: 4,
                    background:
                      s <= step ? "#00BFFF" : "rgba(255,255,255,0.15)",
                    transition: "all 0.3s",
                    boxShadow: s === step ? "0 0 8px #00BFFF" : "none",
                  }}
                />
              ))}
            </div>

            {step === 1 && (
              <motion.div
                animate={{ x: shake ? [-8, 8, -6, 6, 0] : 0 }}
                transition={{ duration: 0.4 }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 18,
                    fontWeight: 800,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  🔑 {confirmMode ? "PIN Confirm Karo" : "4-Digit PIN Banao"}
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    textAlign: "center",
                    marginBottom: 24,
                  }}
                >
                  {confirmMode
                    ? "Wahi PIN dobara daalo"
                    : "Yeh PIN yaad rakhna"}
                </p>
                <PinDisplay pin={confirmMode ? pin2 : pin1} />
                {pinError && (
                  <p
                    style={{
                      color: "#FF6058",
                      fontSize: 13,
                      textAlign: "center",
                      marginBottom: 12,
                    }}
                  >
                    {pinError}
                  </p>
                )}
                <PinPad onDigit={handleDigit} onBackspace={handleBack} />
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 18,
                    fontWeight: 800,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  👤 Aapka Naam
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Recovery ke liye zaroori hai
                </p>
                <input
                  placeholder="Apna naam likhein..."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(0,191,255,0.3)",
                    color: "#fff",
                    fontSize: 16,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  data-ocid="childmode.name_input"
                />
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      flex: 1,
                      padding: "13px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.07)",
                      border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                    data-ocid="childmode.back_button"
                  >
                    ← Wapas
                  </button>
                  <button
                    type="button"
                    onClick={() => name.trim() && setStep(3)}
                    style={{
                      flex: 2,
                      padding: "13px",
                      borderRadius: 14,
                      background: name.trim()
                        ? "rgba(0,191,255,0.2)"
                        : "rgba(255,255,255,0.05)",
                      border: `1.5px solid ${name.trim() ? "rgba(0,191,255,0.5)" : "rgba(255,255,255,0.1)"}`,
                      color: name.trim() ? "#00BFFF" : "rgba(255,255,255,0.3)",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: name.trim() ? "pointer" : "default",
                    }}
                    data-ocid="childmode.next_button"
                  >
                    Aage →
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.9)",
                    fontSize: 18,
                    fontWeight: 800,
                    textAlign: "center",
                    marginBottom: 4,
                  }}
                >
                  🎮 Favourite Game
                </p>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 12,
                    textAlign: "center",
                    marginBottom: 20,
                  }}
                >
                  Password bhoolne par recovery ke liye
                </p>
                <input
                  placeholder="Apna favourite game likhein..."
                  value={favGame}
                  onChange={(e) => setFavGame(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "14px 16px",
                    borderRadius: 14,
                    background: "rgba(255,255,255,0.07)",
                    border: "1.5px solid rgba(0,191,255,0.3)",
                    color: "#fff",
                    fontSize: 16,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                  data-ocid="childmode.favgame_input"
                />
                <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    style={{
                      flex: 1,
                      padding: "13px",
                      borderRadius: 14,
                      background: "rgba(255,255,255,0.07)",
                      border: "1.5px solid rgba(255,255,255,0.12)",
                      color: "rgba(255,255,255,0.6)",
                      fontSize: 15,
                      cursor: "pointer",
                    }}
                    data-ocid="childmode.back2_button"
                  >
                    ← Wapas
                  </button>
                  <button
                    type="button"
                    onClick={handleFinish}
                    style={{
                      flex: 2,
                      padding: "13px",
                      borderRadius: 14,
                      background: favGame.trim()
                        ? "rgba(57,255,20,0.18)"
                        : "rgba(255,255,255,0.05)",
                      border: `1.5px solid ${favGame.trim() ? "rgba(57,255,20,0.5)" : "rgba(255,255,255,0.1)"}`,
                      color: favGame.trim()
                        ? "#39FF14"
                        : "rgba(255,255,255,0.3)",
                      fontSize: 15,
                      fontWeight: 700,
                      cursor: favGame.trim() ? "pointer" : "default",
                    }}
                    data-ocid="childmode.finish_button"
                  >
                    ✅ Child Mode Lagao
                  </button>
                </div>
              </motion.div>
            )}

            <button
              type="button"
              onClick={onClose}
              style={{
                position: "absolute",
                top: 16,
                right: 16,
                width: 32,
                height: 32,
                borderRadius: 10,
                background: "rgba(255,255,255,0.07)",
                border: "none",
                color: "rgba(255,255,255,0.5)",
                cursor: "pointer",
                fontSize: 16,
              }}
              data-ocid="childmode.close_button"
            >
              ✕
            </button>
          </>
        )}
      </ModalOverlay>
    </AnimatePresence>
  );
}

// ——— UNLOCK MODAL ———
interface UnlockProps {
  config: ChildModeConfig;
  onUnlocked: () => void;
  onClose: () => void;
}

type UnlockView = "pin" | "forgot";

export function ChildModeUnlockModal({
  config,
  onUnlocked,
  onClose,
}: UnlockProps) {
  const [view, setView] = useState<UnlockView>("pin");
  const [pin, setPin] = useState("");
  const [shake, setShake] = useState(false);
  const [pinError, setPinError] = useState("");
  const [recovName, setRecovName] = useState("");
  const [recovGame, setRecovGame] = useState("");
  const [recovError, setRecovError] = useState("");

  const doShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const handleDigit = (d: string) => {
    if (pin.length < 4) {
      const next = pin + d;
      setPin(next);
      if (next.length === 4) {
        if (next === config.pin) {
          clearChildMode();
          // Try to close/go home
          try {
            window.close();
          } catch {}
          setTimeout(() => {
            window.location.href = "about:blank";
          }, 100);
          onUnlocked();
        } else {
          setPinError("Galat PIN");
          doShake();
          setTimeout(() => {
            setPin("");
            setPinError("");
          }, 700);
        }
      }
    }
  };

  const handleBackspace = () => {
    setPin(pin.slice(0, -1));
    setPinError("");
  };

  const handleRecovery = () => {
    const nameMatch =
      recovName.trim().toLowerCase() === config.name.toLowerCase();
    const gameMatch =
      recovGame.trim().toLowerCase() === config.favouriteGame.toLowerCase();
    if (nameMatch && gameMatch) {
      clearChildMode();
      try {
        window.close();
      } catch {}
      setTimeout(() => {
        window.location.href = "about:blank";
      }, 100);
      onUnlocked();
    } else {
      setRecovError("Jaankari galat hai");
      doShake();
    }
  };

  return (
    <AnimatePresence>
      <ModalOverlay>
        <div style={{ textAlign: "center", marginBottom: 20 }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>🔒</div>
          <p
            style={{
              color: "rgba(255,255,255,0.95)",
              fontSize: 19,
              fontWeight: 800,
              margin: 0,
            }}
          >
            Child Mode Active
          </p>
          <p
            style={{
              color: "rgba(255,255,255,0.4)",
              fontSize: 12,
              margin: "4px 0 0",
            }}
          >
            App Menu band hai
          </p>
        </div>

        {view === "pin" && (
          <motion.div
            animate={{ x: shake ? [-8, 8, -6, 6, 0] : 0 }}
            transition={{ duration: 0.4 }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                textAlign: "center",
                marginBottom: 16,
              }}
            >
              4-digit PIN daalo
            </p>
            <PinDisplay pin={pin} />
            {pinError && (
              <p
                style={{
                  color: "#FF6058",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 8,
                }}
              >
                {pinError}
              </p>
            )}
            <PinPad onDigit={handleDigit} onBackspace={handleBackspace} />
            <button
              type="button"
              onClick={() => {
                setView("forgot");
                setPin("");
                setPinError("");
              }}
              style={{
                display: "block",
                margin: "16px auto 0",
                background: "none",
                border: "none",
                color: "#00BFFF",
                fontSize: 14,
                cursor: "pointer",
                textDecoration: "underline",
              }}
              data-ocid="childmode.forgot_button"
            >
              Bhul gaye? 🤔
            </button>
          </motion.div>
        )}

        {view === "forgot" && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <p
              style={{
                color: "rgba(255,255,255,0.8)",
                fontSize: 15,
                fontWeight: 700,
                textAlign: "center",
                marginBottom: 20,
              }}
            >
              Recovery
            </p>
            <div style={{ marginBottom: 12 }}>
              <label
                htmlFor="rec-name"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Aapka naam
              </label>
              <input
                id="rec-name"
                placeholder="Naam likhein..."
                value={recovName}
                onChange={(e) => {
                  setRecovName(e.target.value);
                  setRecovError("");
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(0,191,255,0.3)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                data-ocid="childmode.recovery_name_input"
              />
            </div>
            <div style={{ marginBottom: 16 }}>
              <label
                htmlFor="rec-game"
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  display: "block",
                  marginBottom: 6,
                }}
              >
                Aapka favourite game
              </label>
              <input
                id="rec-game"
                placeholder="Game ka naam likhein..."
                value={recovGame}
                onChange={(e) => {
                  setRecovGame(e.target.value);
                  setRecovError("");
                }}
                style={{
                  width: "100%",
                  padding: "12px 14px",
                  borderRadius: 12,
                  background: "rgba(255,255,255,0.07)",
                  border: "1.5px solid rgba(0,191,255,0.3)",
                  color: "#fff",
                  fontSize: 15,
                  outline: "none",
                  boxSizing: "border-box",
                }}
                data-ocid="childmode.recovery_game_input"
              />
            </div>
            {recovError && (
              <motion.p
                animate={{ x: shake ? [-6, 6, -4, 4, 0] : 0 }}
                transition={{ duration: 0.4 }}
                style={{
                  color: "#FF6058",
                  fontSize: 13,
                  textAlign: "center",
                  marginBottom: 12,
                }}
                data-ocid="childmode.recovery_error_state"
              >
                {recovError}
              </motion.p>
            )}
            <button
              type="button"
              onClick={handleRecovery}
              style={{
                width: "100%",
                padding: "14px",
                borderRadius: 14,
                background: "rgba(0,191,255,0.18)",
                border: "1.5px solid rgba(0,191,255,0.4)",
                color: "#00BFFF",
                fontSize: 15,
                fontWeight: 700,
                cursor: "pointer",
              }}
              data-ocid="childmode.recovery_button"
            >
              Recovery Karo 🔓
            </button>
            <button
              type="button"
              onClick={() => {
                setView("pin");
                setRecovName("");
                setRecovGame("");
                setRecovError("");
              }}
              style={{
                display: "block",
                margin: "12px auto 0",
                background: "none",
                border: "none",
                color: "rgba(255,255,255,0.4)",
                fontSize: 13,
                cursor: "pointer",
              }}
              data-ocid="childmode.back_to_pin_button"
            >
              ← PIN se try karo
            </button>
          </motion.div>
        )}

        <button
          type="button"
          onClick={onClose}
          style={{
            position: "absolute",
            top: 16,
            right: 16,
            width: 32,
            height: 32,
            borderRadius: 10,
            background: "rgba(255,255,255,0.07)",
            border: "none",
            color: "rgba(255,255,255,0.5)",
            cursor: "pointer",
            fontSize: 16,
          }}
          data-ocid="childmode.unlock_close_button"
        >
          ✕
        </button>
      </ModalOverlay>
    </AnimatePresence>
  );
}
