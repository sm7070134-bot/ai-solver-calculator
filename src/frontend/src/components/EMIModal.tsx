import { IndianRupee, X } from "lucide-react";
import { useMemo, useState } from "react";

interface Props {
  onClose: () => void;
}

function formatINR(n: number): string {
  if (!Number.isFinite(n) || Number.isNaN(n)) return "₹0";
  const s = Math.round(n).toString();
  let result = "";
  const len = s.length;
  for (let i = 0; i < len; i++) {
    const pos = len - i;
    if (pos > 3 && (pos - 3) % 2 === 0 && i > 0) result += ",";
    else if (pos === 3 && i > 0) result += ",";
    result += s[i];
  }
  return `₹${result}`;
}

export function EMIModal({ onClose }: Props) {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [tenure, setTenure] = useState("");

  const calc = useMemo(() => {
    const P = Number.parseFloat(principal);
    const annualRate = Number.parseFloat(rate);
    const n = Number.parseInt(tenure);
    if (!P || !annualRate || !n || P <= 0 || annualRate <= 0 || n <= 0) {
      return null;
    }
    const r = annualRate / 12 / 100;
    const emi = (P * r * (1 + r) ** n) / ((1 + r) ** n - 1);
    const total = emi * n;
    const interest = total - P;
    return { emi, total, interest, r, n, P };
  }, [principal, rate, tenure]);

  const breakdown = useMemo(() => {
    if (!calc) return [];
    const rows: {
      month: number;
      emi: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];
    let balance = calc.P;
    for (let i = 1; i <= Math.min(6, calc.n); i++) {
      const interestPart = balance * calc.r;
      const principalPart = calc.emi - interestPart;
      balance -= principalPart;
      rows.push({
        month: i,
        emi: calc.emi,
        principal: principalPart,
        interest: interestPart,
        balance: Math.max(0, balance),
      });
    }
    return rows;
  }, [calc]);

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
      data-ocid="emi.modal"
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
          <IndianRupee size={20} style={{ color: "#00E5CC" }} />
          <h2
            style={{ color: "#fff", fontWeight: 800, fontSize: 20, margin: 0 }}
          >
            EMI Calculator
          </h2>
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
          data-ocid="emi.close_button"
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
          display: "flex",
          flexDirection: "column",
          gap: 20,
        }}
      >
        {/* Inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Loan Amount (₹)
            </span>
            <div style={{ position: "relative" }}>
              <span
                style={{
                  position: "absolute",
                  left: 12,
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#00E5CC",
                  fontWeight: 700,
                }}
              >
                ₹
              </span>
              <input
                type="number"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                placeholder="e.g. 500000"
                style={{
                  width: "100%",
                  paddingLeft: 32,
                  paddingRight: 16,
                  paddingTop: 12,
                  paddingBottom: 12,
                  borderRadius: 12,
                  color: "white",
                  fontWeight: 600,
                  fontSize: 14,
                  outline: "none",
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(0,229,204,0.2)",
                  boxSizing: "border-box",
                }}
                data-ocid="emi.input"
              />
            </div>
            {principal && (
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {formatINR(Number.parseFloat(principal))}
              </p>
            )}
          </div>

          <div>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Annual Interest Rate (%)
            </span>
            <input
              type="number"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
              placeholder="e.g. 8.5"
              step="0.1"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                outline: "none",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(0,229,204,0.2)",
                boxSizing: "border-box",
              }}
              data-ocid="emi.input"
            />
          </div>

          <div>
            <span
              style={{
                color: "rgba(255,255,255,0.5)",
                fontSize: 11,
                fontWeight: 600,
                textTransform: "uppercase",
                letterSpacing: 1,
                display: "block",
                marginBottom: 6,
              }}
            >
              Tenure (Months)
            </span>
            <input
              type="number"
              value={tenure}
              onChange={(e) => setTenure(e.target.value)}
              placeholder="e.g. 60"
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: 12,
                color: "white",
                fontWeight: 600,
                fontSize: 14,
                outline: "none",
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(0,229,204,0.2)",
                boxSizing: "border-box",
              }}
              data-ocid="emi.input"
            />
            {tenure && (
              <p
                style={{
                  color: "rgba(255,255,255,0.3)",
                  fontSize: 11,
                  marginTop: 4,
                }}
              >
                {Math.floor(Number.parseInt(tenure) / 12)} yr{" "}
                {Number.parseInt(tenure) % 12 > 0
                  ? `${Number.parseInt(tenure) % 12} mo`
                  : ""}
              </p>
            )}
          </div>
        </div>

        {/* Results */}
        {calc && (
          <>
            <div
              style={{
                borderRadius: 16,
                padding: 20,
                background:
                  "linear-gradient(135deg, rgba(0,229,204,0.10), rgba(0,191,255,0.07))",
                border: "1px solid rgba(0,229,204,0.25)",
              }}
            >
              <p
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  textAlign: "center",
                  marginBottom: 4,
                }}
              >
                Monthly EMI
              </p>
              <p
                style={{
                  color: "#00E5CC",
                  textAlign: "center",
                  fontWeight: 900,
                  fontSize: 36,
                  margin: 0,
                }}
              >
                {formatINR(calc.emi)}
              </p>
            </div>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div
                style={{
                  borderRadius: 12,
                  padding: 16,
                  background: "rgba(255,215,0,0.07)",
                  border: "1px solid rgba(255,215,0,0.2)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  Total Payable
                </p>
                <p
                  style={{
                    color: "#FFD700",
                    fontWeight: 900,
                    fontSize: 18,
                    margin: 0,
                  }}
                >
                  {formatINR(calc.total)}
                </p>
              </div>
              <div
                style={{
                  borderRadius: 12,
                  padding: 16,
                  background: "rgba(255,59,48,0.07)",
                  border: "1px solid rgba(255,59,48,0.2)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    marginBottom: 4,
                  }}
                >
                  Total Interest
                </p>
                <p
                  style={{
                    color: "#FF6058",
                    fontWeight: 900,
                    fontSize: 18,
                    margin: 0,
                  }}
                >
                  {formatINR(calc.interest)}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div
                style={{
                  flex: 1,
                  height: 8,
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(255,255,255,0.1)",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    borderRadius: 4,
                    width: `${(calc.P / calc.total) * 100}%`,
                    background: "linear-gradient(90deg, #00E5CC, #00BFFF)",
                  }}
                />
              </div>
              <span
                style={{
                  color: "rgba(255,255,255,0.4)",
                  fontSize: 12,
                  whiteSpace: "nowrap",
                }}
              >
                {Math.round((calc.P / calc.total) * 100)}% principal
              </span>
            </div>

            {breakdown.length > 0 && (
              <div>
                <p
                  style={{
                    color: "rgba(255,255,255,0.4)",
                    fontSize: 11,
                    fontWeight: 700,
                    textTransform: "uppercase",
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  First 6 Months
                </p>
                <div
                  style={{
                    borderRadius: 12,
                    overflow: "hidden",
                    border: "1px solid rgba(255,255,255,0.08)",
                  }}
                >
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns: "0.5fr 1.2fr 1.2fr 1.2fr",
                      padding: "8px 12px",
                      color: "rgba(255,255,255,0.3)",
                      fontSize: 11,
                      fontWeight: 700,
                      background: "rgba(255,255,255,0.05)",
                    }}
                  >
                    <span>Mo</span>
                    <span>Principal</span>
                    <span>Interest</span>
                    <span>Balance</span>
                  </div>
                  {breakdown.map((row) => (
                    <div
                      key={row.month}
                      style={{
                        display: "grid",
                        gridTemplateColumns: "0.5fr 1.2fr 1.2fr 1.2fr",
                        padding: "8px 12px",
                        fontSize: 11,
                        borderTop: "1px solid rgba(255,255,255,0.05)",
                      }}
                      data-ocid={`emi.item.${row.month}`}
                    >
                      <span style={{ color: "rgba(255,255,255,0.4)" }}>
                        {row.month}
                      </span>
                      <span style={{ color: "#00E5CC" }}>
                        {formatINR(row.principal)}
                      </span>
                      <span style={{ color: "#FF6058" }}>
                        {formatINR(row.interest)}
                      </span>
                      <span style={{ color: "rgba(255,255,255,0.7)" }}>
                        {formatINR(row.balance)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {!calc && (
          <div
            style={{ textAlign: "center", padding: "24px 0" }}
            data-ocid="emi.empty_state"
          >
            <p style={{ fontSize: 40, margin: "0 0 8px" }}>💰</p>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 14 }}>
              Enter loan details to calculate EMI
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
