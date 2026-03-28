import { X } from "lucide-react";
import { useMemo, useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useT } from "../i18n/LanguageContext";

interface Props {
  expression: string;
  onClose: () => void;
}

function evalExpr(expr: string, x: number): number | null {
  try {
    // eslint-disable-next-line no-new-func
    const val = new Function("x", `"use strict"; return (${expr})`)(
      x,
    ) as number;
    return Number.isFinite(val) ? Number.parseFloat(val.toPrecision(8)) : null;
  } catch {
    return null;
  }
}

export function GraphModal({ expression, onClose }: Props) {
  const t = useT();
  const [eq2, setEq2] = useState("");
  const [xRange, setXRange] = useState(10);

  const expr1 = expression
    .replace(/[=\s]+$/, "")
    .replace(/×/g, "*")
    .replace(/÷/g, "/");

  const expr2 = eq2.trim().replace(/×/g, "*").replace(/÷/g, "/");

  const step = xRange <= 10 ? 1 : xRange <= 25 ? 2 : 5;

  const data = useMemo(() => {
    const points: { x: number; y1: number | null; y2: number | null }[] = [];
    for (let i = -xRange; i <= xRange; i += step) {
      points.push({
        x: i,
        y1: expr1 ? evalExpr(expr1, i) : null,
        y2: expr2 ? evalExpr(expr2, i) : null,
      });
    }
    return points;
  }, [expr1, expr2, xRange, step]);

  const hasData1 = data.some((d) => d.y1 !== null);
  const hasData2 = expr2 && data.some((d) => d.y2 !== null);

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
      data-ocid="graph.panel"
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
          📊 {t.graphTitle}
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
          data-ocid="graph.close_button"
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
          gap: 16,
        }}
      >
        {/* Equation inputs */}
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 12,
              background: "rgba(255,215,0,0.07)",
              border: "1px solid rgba(255,215,0,0.2)",
            }}
          >
            <span
              style={{
                color: "#FFD700",
                fontSize: 12,
                fontWeight: 700,
                width: 24,
              }}
            >
              y₁=
            </span>
            <span
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 14,
                fontFamily: "monospace",
                flex: 1,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {expr1 || `(${t.graphPlaceholder})`}
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 12px",
              borderRadius: 12,
              background: "rgba(0,191,255,0.06)",
              border: "1px solid rgba(0,191,255,0.2)",
            }}
          >
            <span
              style={{
                color: "#00BFFF",
                fontSize: 12,
                fontWeight: 700,
                width: 24,
              }}
            >
              y₂=
            </span>
            <input
              type="text"
              value={eq2}
              onChange={(e) => setEq2(e.target.value)}
              placeholder="e.g. x*x - 3 (optional)"
              style={{
                flex: 1,
                background: "transparent",
                color: "rgba(255,255,255,0.8)",
                fontSize: 14,
                fontFamily: "monospace",
                outline: "none",
                border: "none",
              }}
              data-ocid="graph.input"
            />
          </div>
        </div>

        {/* X range slider */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: 4,
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 12 }}>
              X range
            </span>
            <span style={{ color: "#FFD700", fontSize: 12, fontWeight: 700 }}>
              −{xRange} to +{xRange}
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={50}
            step={5}
            value={xRange}
            onChange={(e) => setXRange(Number(e.target.value))}
            className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #FFD700 ${((xRange - 5) / 45) * 100}%, rgba(255,255,255,0.15) ${((xRange - 5) / 45) * 100}%)`,
              outline: "none",
            }}
            data-ocid="graph.toggle"
          />
        </div>

        {/* Chart */}
        {!hasData1 && !hasData2 ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "48px 0",
              gap: 12,
            }}
            data-ocid="graph.empty_state"
          >
            <p style={{ fontSize: 40, margin: 0 }}>📉</p>
            <p
              style={{
                color: "rgba(255,255,255,0.4)",
                fontSize: 14,
                textAlign: "center",
              }}
            >
              {!expr1
                ? t.graphPlaceholder
                : "Could not evaluate — use x as variable (e.g. 2*x+1)"}
            </p>
          </div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={data}
                margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />
                <XAxis
                  dataKey="x"
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                  tickLine={false}
                  label={{
                    value: "x",
                    position: "insideRight",
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                  }}
                />
                <YAxis
                  width={42}
                  tick={{ fill: "rgba(255,255,255,0.4)", fontSize: 10 }}
                  axisLine={{ stroke: "rgba(255,255,255,0.15)" }}
                  tickLine={false}
                  label={{
                    value: "y",
                    position: "insideTop",
                    fill: "rgba(255,255,255,0.3)",
                    fontSize: 11,
                  }}
                />
                <Tooltip
                  contentStyle={{
                    background: "rgba(18,18,18,0.97)",
                    border: "1px solid rgba(255,255,255,0.12)",
                    borderRadius: 10,
                    color: "white",
                    fontSize: 12,
                  }}
                  formatter={(value: number, name: string) => [
                    typeof value === "number" ? value.toFixed(4) : value,
                    name === "y1" ? "y₁" : "y₂",
                  ]}
                  labelFormatter={(label) => `x = ${label}`}
                />
                {hasData1 && (
                  <Line
                    type="monotone"
                    dataKey="y1"
                    stroke="#FFD700"
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls={false}
                    name="y1"
                  />
                )}
                {hasData2 && (
                  <Line
                    type="monotone"
                    dataKey="y2"
                    stroke="#00BFFF"
                    strokeWidth={2.5}
                    dot={false}
                    connectNulls={false}
                    name="y2"
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Legend */}
        {(hasData1 || hasData2) && (
          <div style={{ display: "flex", gap: 16 }}>
            {hasData1 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 16,
                    height: 4,
                    borderRadius: 2,
                    background: "#FFD700",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  y₁ (current)
                </span>
              </div>
            )}
            {hasData2 && (
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <div
                  style={{
                    width: 16,
                    height: 4,
                    borderRadius: 2,
                    background: "#00BFFF",
                  }}
                />
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 12 }}>
                  y₂
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
