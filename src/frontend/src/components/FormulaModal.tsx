import { Check, Copy, X } from "lucide-react";
import { useState } from "react";
import { useT } from "../i18n/LanguageContext";

interface Props {
  onClose: () => void;
  onFormulaClick?: (formula: string) => void;
  defaultTab?: "general" | "class11" | "physics" | "chemistry";
}

const FORMULAS = [
  {
    category: "Algebra",
    items: [
      { name: "Square of Sum", formula: "(a+b)² = a² + 2ab + b²" },
      { name: "Square of Difference", formula: "(a-b)² = a² - 2ab + b²" },
      { name: "Difference of Squares", formula: "a² - b² = (a+b)(a-b)" },
      { name: "Sum of Three", formula: "(a+b+c)² = a²+b²+c²+2ab+2bc+2ca" },
    ],
  },
  {
    category: "Arithmetic",
    items: [
      { name: "Sum of n naturals", formula: "Σn = n(n+1)/2" },
      { name: "Sum of squares", formula: "Σn² = n(n+1)(2n+1)/6" },
      { name: "Sum of cubes", formula: "Σn³ = [n(n+1)/2]²" },
      { name: "Arithmetic progression", formula: "Sₙ = n/2 × (2a + (n-1)d)" },
    ],
  },
  {
    category: "Geometry",
    items: [
      { name: "Circle Area", formula: "A = πr²" },
      { name: "Circle Circumference", formula: "C = 2πr" },
      { name: "Triangle Area", formula: "A = ½ × b × h" },
      { name: "Rectangle Area", formula: "A = l × w" },
      { name: "Pythagorean Theorem", formula: "a² + b² = c²" },
    ],
  },
  {
    category: "Quadratic",
    items: [
      { name: "Quadratic Formula", formula: "x = (-b ± √(b²-4ac)) / 2a" },
      { name: "Discriminant", formula: "Δ = b² - 4ac" },
      { name: "Vieta's Formulas", formula: "x₁+x₂ = -b/a, x₁·x₂ = c/a" },
    ],
  },
];

const CLASS11_FORMULAS = [
  {
    lesson: "Lesson 1: समुच्चय (Sets)",
    items: [
      {
        name: "Union of two sets",
        formula: "n(A ∪ B) = n(A) + n(B) – n(A ∩ B)",
      },
      {
        name: "Union of three sets",
        formula:
          "n(A∪B∪C) = n(A)+n(B)+n(C) - n(A∩B) - n(B∩C) - n(A∩C) + n(A∩B∩C)",
      },
      { name: "Subset", formula: "A ⊆ B ⇒ n(A) ≤ n(B)" },
      { name: "Difference of sets", formula: "A - B = A ∩ B'" },
      { name: "De Morgan's Law 1", formula: "(A ∪ B)' = A' ∩ B'" },
      { name: "De Morgan's Law 2", formula: "(A ∩ B)' = A' ∪ B'" },
    ],
  },
  {
    lesson: "Lesson 2: संबंध एवं फलन (Relations & Functions)",
    items: [
      { name: "Total relations", formula: "Total relations = 2^(n²)" },
      { name: "Total functions", formula: "Total functions = n^m" },
      { name: "One-One function", formula: "f(x₁) = f(x₂) ⇒ x₁ = x₂" },
      { name: "Onto function", formula: "Onto: Range = Codomain" },
    ],
  },
  {
    lesson: "Lesson 3: त्रिकोणमितीय फलन (Trigonometric Functions)",
    items: [
      { name: "Pythagorean identity", formula: "sin²θ + cos²θ = 1" },
      { name: "Tan identity", formula: "1 + tan²θ = sec²θ" },
      { name: "Cot identity", formula: "1 + cot²θ = cosec²θ" },
      { name: "Negative angle sin", formula: "sin(−θ) = −sinθ" },
      { name: "Negative angle cos", formula: "cos(−θ) = cosθ" },
      { name: "Negative angle tan", formula: "tan(−θ) = −tanθ" },
      { name: "sin(A+B)", formula: "sin(A+B) = sinAcosB + cosAsinB" },
      { name: "cos(A+B)", formula: "cos(A+B) = cosAcosB − sinAsinB" },
      {
        name: "tan(A+B)",
        formula: "tan(A+B) = (tanA + tanB) / (1 − tanAtanB)",
      },
      { name: "Double angle sin", formula: "sin2θ = 2sinθcosθ" },
      { name: "Double angle cos", formula: "cos2θ = cos²θ − sin²θ" },
      { name: "Double angle tan", formula: "tan2θ = 2tanθ / (1−tan²θ)" },
    ],
  },
  {
    lesson: "Lesson 4: गणितीय आगमन (Mathematical Induction)",
    items: [
      { name: "Step 1", formula: "Verify for n = 1" },
      { name: "Step 2", formula: "Assume true for n = k" },
      { name: "Step 3", formula: "Prove for n = k + 1" },
    ],
  },
  {
    lesson: "Lesson 5: सम्मिश्र संख्याएँ (Complex Numbers)",
    items: [
      { name: "Iota squared", formula: "i² = −1" },
      {
        name: "Complex multiplication",
        formula: "(a+ib)(c+id) = (ac−bd) + i(ad+bc)",
      },
      { name: "Modulus", formula: "|z| = √(a² + b²)" },
      { name: "z × conjugate", formula: "z × z̄ = |z|²" },
    ],
  },
  {
    lesson: "Lesson 6: रैखिक असमिकाएँ (Linear Inequalities)",
    items: [
      { name: "Basic inequality", formula: "ax + b > 0 ⇒ x > -b/a" },
      {
        name: "Sign flip rule",
        formula: "Multiply/divide by negative ⇒ sign changes",
      },
    ],
  },
  {
    lesson: "Lesson 7: क्रमचय एवं संचय (P&C)",
    items: [
      { name: "Permutation", formula: "nPr = n! / (n−r)!" },
      { name: "Combination", formula: "nCr = n! / [r!(n−r)!]" },
      { name: "Complement combination", formula: "nCr = nC(n−r)" },
      {
        name: "Circular permutation",
        formula: "Circular permutation = (n−1)!",
      },
    ],
  },
  {
    lesson: "Lesson 8: द्विपद प्रमेय (Binomial Theorem)",
    items: [
      {
        name: "Binomial expansion",
        formula: "(a+b)^n = Σ [nCr · a^(n−r) · b^r]",
      },
      { name: "General term", formula: "T(r+1) = nCr · a^(n−r) · b^r" },
      { name: "Middle term", formula: "Middle term = (n/2 + 1)th term" },
    ],
  },
  {
    lesson: "Lesson 9: अनुक्रम एवं श्रेणी (Sequences & Series)",
    items: [
      { name: "AP nth term", formula: "aₙ = a + (n−1)d" },
      { name: "AP sum", formula: "Sₙ = n/2 [2a + (n−1)d]" },
      { name: "GP nth term", formula: "aₙ = ar^(n−1)" },
      { name: "GP sum", formula: "Sₙ = a(1−rⁿ) / (1−r)" },
      { name: "GP infinite sum", formula: "S∞ = a / (1−r), |r| < 1" },
    ],
  },
  {
    lesson: "Lesson 10: सरल रेखाएँ (Straight Lines)",
    items: [
      { name: "Slope formula", formula: "m = (y₂−y₁) / (x₂−x₁)" },
      { name: "Point-slope form", formula: "y − y₁ = m(x − x₁)" },
      { name: "Slope-intercept form", formula: "y = mx + c" },
      { name: "General form", formula: "ax + by + c = 0" },
    ],
  },
  {
    lesson: "Lesson 11: शंकु परिच्छेद (Conic Sections)",
    items: [
      { name: "Circle", formula: "x² + y² = r²" },
      { name: "Parabola", formula: "y² = 4ax" },
      { name: "Ellipse", formula: "x²/a² + y²/b² = 1" },
      { name: "Hyperbola", formula: "x²/a² − y²/b² = 1" },
    ],
  },
  {
    lesson: "Lesson 12: 3D Geometry",
    items: [
      {
        name: "Distance formula",
        formula: "d = √[(x₂−x₁)² + (y₂−y₁)² + (z₂−z₁)²]",
      },
    ],
  },
  {
    lesson: "Lesson 13: सीमा एवं अवकलज (Limits & Derivatives)",
    items: [
      { name: "Limit sinx/x", formula: "lim(x→0) sinx/x = 1" },
      { name: "Limit (1−cosx)/x", formula: "lim(x→0) (1−cosx)/x = 0" },
      { name: "Power rule", formula: "d/dx (xⁿ) = nxⁿ⁻¹" },
      { name: "Derivative of sinx", formula: "d/dx (sinx) = cosx" },
      { name: "Derivative of cosx", formula: "d/dx (cosx) = −sinx" },
    ],
  },
  {
    lesson: "Lesson 14: गणितीय विवेचन (Mathematical Reasoning)",
    items: [
      { name: "Implication", formula: "p → q = ¬p ∨ q" },
      { name: "Biconditional", formula: "p ↔ q = (p→q) ∧ (q→p)" },
    ],
  },
  {
    lesson: "Lesson 15: सांख्यिकी (Statistics)",
    items: [
      { name: "Mean", formula: "Mean = Σx / n" },
      { name: "Variance", formula: "Variance = Σ(x−mean)² / n" },
      { name: "Standard Deviation", formula: "SD = √Variance" },
    ],
  },
  {
    lesson: "Lesson 16: प्रायिकता (Probability)",
    items: [
      {
        name: "Probability",
        formula: "P(E) = favourable outcomes / total outcomes",
      },
      { name: "Complement", formula: "P(A') = 1 − P(A)" },
      { name: "Union", formula: "P(A∪B) = P(A) + P(B) − P(A∩B)" },
    ],
  },
];

const CLASS11_PHYSICS_FORMULAS = [
  {
    lesson: "Ch 2: Units & Measurements",
    items: [
      {
        name: "Percentage Error",
        formula: "Percentage Error = (ΔA / A) × 100",
      },
      {
        name: "Absolute Error",
        formula: "Absolute Error = |Measured Value - True Value|",
      },
      { name: "Mean Error", formula: "Mean Error = (Σ|ΔA|) / n" },
    ],
  },
  {
    lesson: "Ch 3: Motion in a Straight Line",
    items: [
      { name: "First equation of motion", formula: "v = u + at" },
      { name: "Second equation of motion", formula: "s = ut + (1/2)at²" },
      { name: "Third equation of motion", formula: "v² = u² + 2as" },
      { name: "Average velocity", formula: "s = ((u + v)/2) × t" },
    ],
  },
  {
    lesson: "Ch 4: Motion in a Plane",
    items: [
      { name: "Resultant velocity", formula: "v = √(vx² + vy²)" },
      { name: "Range of projectile", formula: "R = (u² sin2θ) / g" },
      { name: "Time of Flight", formula: "T = (2u sinθ) / g" },
      { name: "Maximum Height", formula: "H = (u² sin²θ) / (2g)" },
    ],
  },
  {
    lesson: "Ch 5: Laws of Motion",
    items: [
      { name: "Newton's 2nd Law", formula: "F = ma" },
      { name: "Momentum", formula: "p = mv" },
      { name: "Impulse", formula: "Impulse = F × t" },
      { name: "Friction Force", formula: "f = μN" },
    ],
  },
  {
    lesson: "Ch 6: Work, Energy & Power",
    items: [
      { name: "Work done", formula: "W = F·s·cosθ" },
      { name: "Kinetic Energy", formula: "KE = (1/2)mv²" },
      { name: "Potential Energy", formula: "PE = mgh" },
      { name: "Power", formula: "P = Work / Time" },
      { name: "Power (alternate)", formula: "P = F·v" },
    ],
  },
  {
    lesson: "Ch 7: Rotational Motion",
    items: [
      { name: "Torque", formula: "τ = r × F" },
      { name: "Angular Momentum", formula: "L = Iω" },
      { name: "Moment of Inertia", formula: "I = Σmr²" },
      { name: "Rotational KE", formula: "KE = (1/2)Iω²" },
      { name: "Linear-angular velocity", formula: "v = rω" },
    ],
  },
  {
    lesson: "Ch 8: Gravitation",
    items: [
      { name: "Newton's Law of Gravitation", formula: "F = G(m₁m₂ / r²)" },
      { name: "Acceleration due to gravity", formula: "g = GM / R²" },
      { name: "Gravitational Potential Energy", formula: "U = -GMm / r" },
      { name: "Escape Velocity", formula: "v_e = √(2GM/R)" },
    ],
  },
  {
    lesson: "Ch 9: Mechanical Properties of Solids",
    items: [
      { name: "Stress", formula: "Stress = Force / Area" },
      { name: "Strain", formula: "Strain = ΔL / L" },
      { name: "Young's Modulus", formula: "Y = Stress / Strain" },
    ],
  },
  {
    lesson: "Ch 10: Mechanical Properties of Fluids",
    items: [
      { name: "Pressure", formula: "P = Force / Area" },
      { name: "Hydrostatic Pressure", formula: "P = ρgh" },
      { name: "Buoyant Force", formula: "F_b = ρgV" },
      { name: "Continuity Equation", formula: "A₁v₁ = A₂v₂" },
      {
        name: "Bernoulli's Equation",
        formula: "P + (1/2)ρv² + ρgh = constant",
      },
    ],
  },
  {
    lesson: "Ch 11: Thermal Properties of Matter",
    items: [
      { name: "Heat absorbed", formula: "Q = mcΔT" },
      { name: "Linear expansion", formula: "ΔL = αLΔT" },
      { name: "Stefan's Law", formula: "E = σT⁴" },
      { name: "Wien's Law", formula: "λmax × T = constant" },
    ],
  },
  {
    lesson: "Ch 12: Thermodynamics",
    items: [
      { name: "First Law of Thermodynamics", formula: "ΔQ = ΔW + ΔU" },
      { name: "Work done by gas", formula: "W = PΔV" },
      { name: "Efficiency", formula: "η = Work Output / Heat Input" },
    ],
  },
  {
    lesson: "Ch 13: Kinetic Theory",
    items: [
      { name: "Kinetic pressure equation", formula: "PV = (1/3)nmv²" },
      { name: "KE per molecule", formula: "KE = (3/2)kT" },
      { name: "RMS speed", formula: "v_rms = √(3kT/m)" },
    ],
  },
  {
    lesson: "Ch 14: Oscillations",
    items: [
      { name: "Restoring force (SHM)", formula: "F = -kx" },
      { name: "Time period (spring)", formula: "T = 2π√(m/k)" },
      { name: "Time period (pendulum)", formula: "T = 2π√(l/g)" },
      { name: "Angular frequency", formula: "ω = 2π/T" },
    ],
  },
  {
    lesson: "Ch 15: Waves",
    items: [
      { name: "Wave speed", formula: "v = fλ" },
      { name: "Frequency", formula: "f = 1/T" },
      { name: "Wave equation", formula: "y = A sin(ωt - kx)" },
      { name: "Speed in string", formula: "v = √(T/μ)" },
    ],
  },
];
const CLASS11_CHEMISTRY_FORMULAS = [
  {
    lesson: "Lesson 1: Basic Concepts",
    items: [
      { name: "Mole calculation", formula: "n = mass / molar mass" },
      { name: "Ideal Gas Law", formula: "PV = nRT" },
      {
        name: "Percentage composition",
        formula: "% = (mass of element / molar mass) × 100",
      },
    ],
  },
  {
    lesson: "Lesson 2: Structure of Atom",
    items: [
      { name: "Energy of electron", formula: "Eₙ = −13.6 / n² eV" },
      { name: "de Broglie wavelength", formula: "λ = h/mv" },
      { name: "Heisenberg uncertainty", formula: "Δx·Δp ≥ h/4π" },
    ],
  },
  {
    lesson: "Lesson 4: Chemical Bonding",
    items: [
      { name: "Dipole moment", formula: "μ = q × d" },
      { name: "Coulomb's law", formula: "F = kq₁q₂ / r²" },
    ],
  },
  {
    lesson: "Lesson 5: States of Matter",
    items: [
      { name: "Ideal Gas Law", formula: "PV = nRT" },
      { name: "Van der Waals", formula: "(P + a/V²)(V − b) = RT" },
    ],
  },
  {
    lesson: "Lesson 6: Thermodynamics",
    items: [
      { name: "First law", formula: "ΔU = q + w" },
      { name: "Work done", formula: "w = −PΔV" },
      { name: "Enthalpy", formula: "ΔH = ΔU + ΔnRT" },
    ],
  },
  {
    lesson: "Lesson 7: Equilibrium",
    items: [
      {
        name: "Equilibrium constant",
        formula: "Kc = [products] / [reactants]",
      },
      { name: "pH", formula: "pH = −log[H⁺]" },
      { name: "Water dissociation", formula: "Kw = [H⁺][OH⁻]" },
    ],
  },
  {
    lesson: "Lesson 8: Redox Reactions",
    items: [
      { name: "Zinc-Copper reaction", formula: "Zn + Cu²⁺ → Zn²⁺ + Cu" },
      { name: "Iron oxidation", formula: "Fe²⁺ → Fe³⁺ + e⁻" },
      { name: "Copper oxidation", formula: "Cu → Cu²⁺ + 2e⁻" },
    ],
  },
  {
    lesson: "Lesson 9: Hydrogen",
    items: [
      { name: "Water formation", formula: "2H₂ + O₂ → 2H₂O" },
      { name: "HCl formation", formula: "H₂ + Cl₂ → 2HCl" },
      { name: "NaH with water", formula: "NaH + H₂O → NaOH + H₂" },
    ],
  },
  {
    lesson: "Lesson 10: s-Block Elements",
    items: [
      { name: "Sodium with water", formula: "2Na + 2H₂O → 2NaOH + H₂" },
      { name: "Calcium with water", formula: "Ca + 2H₂O → Ca(OH)₂ + H₂" },
      { name: "Soda with HCl", formula: "Na₂CO₃ + 2HCl → 2NaCl + CO₂ + H₂O" },
      { name: "Baking soda decomp.", formula: "NaHCO₃ → Na₂CO₃ + CO₂ + H₂O" },
    ],
  },
  {
    lesson: "Lesson 11: p-Block Elements",
    items: [
      { name: "Haber Process (NH₃)", formula: "N₂ + 3H₂ → 2NH₃" },
      { name: "Ammonium chloride", formula: "NH₃ + HCl → NH₄Cl" },
      { name: "Ammonia equilibrium", formula: "NH₃ + H₂O ⇌ NH₄⁺ + OH⁻" },
      { name: "SO₃ formation", formula: "SO₂ + O₂ → SO₃" },
      { name: "Sulphuric acid", formula: "SO₃ + H₂O → H₂SO₄" },
      { name: "Phosphorus oxide", formula: "P₄ + 5O₂ → P₄O₁₀" },
    ],
  },
  {
    lesson: "Lesson 12: Organic Chemistry Basics",
    items: [
      { name: "Free Radical Substitution", formula: "CH₄ + Cl₂ → CH₃Cl + HCl" },
      { name: "Combustion", formula: "CH₄ + 2O₂ → CO₂ + 2H₂O" },
      { name: "Cracking", formula: "C₂H₆ → C₂H₄ + H₂" },
    ],
  },
  {
    lesson: "Lesson 13: Hydrocarbons",
    items: [
      { name: "Alkene Hydrogenation", formula: "C₂H₄ + H₂ → C₂H₆" },
      { name: "Alkene Addition", formula: "C₂H₄ + Br₂ → C₂H₄Br₂" },
      { name: "Alkyne + H₂ (step 1)", formula: "C₂H₂ + H₂ → C₂H₄" },
      { name: "Alkyne + H₂ (step 2)", formula: "C₂H₂ + 2H₂ → C₂H₆" },
      { name: "Nitration (Benzene)", formula: "C₆H₆ + HNO₃ → C₆H₅NO₂ + H₂O" },
      { name: "Halogenation (Benzene)", formula: "C₆H₆ + Cl₂ → C₆H₅Cl + HCl" },
      {
        name: "Friedel-Crafts Alkylation",
        formula: "C₆H₆ + CH₃Cl → C₆H₅CH₃ + HCl",
      },
      {
        name: "Friedel-Crafts Acylation",
        formula: "C₆H₆ + CH₃COCl → C₆H₅COCH₃ + HCl",
      },
    ],
  },
  {
    lesson: "Lesson 14: Environmental Chemistry",
    items: [
      { name: "Ozone formation", formula: "O + O₂ → O₃" },
      { name: "Ozone breakdown", formula: "O₃ → O₂ + O" },
      { name: "Nitric acid (acid rain)", formula: "NO₂ + H₂O → HNO₃ + HNO₂" },
      { name: "Sulphurous acid", formula: "SO₂ + H₂O → H₂SO₃" },
      { name: "HCl dissociation", formula: "HCl → H⁺ + Cl⁻" },
      { name: "NaOH dissociation", formula: "NaOH → Na⁺ + OH⁻" },
      { name: "AgCl precipitation", formula: "AgNO₃ + NaCl → AgCl↓ + NaNO₃" },
      { name: "BaSO₄ precipitation", formula: "BaCl₂ + H₂SO₄ → BaSO₄↓ + 2HCl" },
    ],
  },
];

export function FormulaModal({ onClose, onFormulaClick, defaultTab }: Props) {
  const t = useT();
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<
    "general" | "class11" | "physics" | "chemistry"
  >(defaultTab ?? "general");

  const copyFormula = (id: string, formula: string) => {
    navigator.clipboard.writeText(formula).then(() => {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 1500);
    });
  };

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
      data-ocid="formula.modal"
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
          {t.formulasTitle}
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
          data-ocid="formula.close_button"
        >
          <X size={18} />
        </button>
      </div>

      {/* Tabs */}
      <div
        style={{
          display: "flex",
          gap: 6,
          padding: "12px 20px 0",
          flexShrink: 0,
        }}
      >
        <button
          type="button"
          onClick={() => setActiveTab("general")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background:
              activeTab === "general"
                ? "linear-gradient(135deg,#FFD700,#FF8C00)"
                : "rgba(255,255,255,0.07)",
            color: activeTab === "general" ? "#000" : "rgba(255,255,255,0.6)",
            transition: "all 0.2s",
          }}
        >
          General
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("class11")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background:
              activeTab === "class11"
                ? "linear-gradient(135deg,#A855F7,#00BFFF)"
                : "rgba(255,255,255,0.07)",
            color: activeTab === "class11" ? "#fff" : "rgba(255,255,255,0.6)",
            transition: "all 0.2s",
          }}
        >
          📘 Class 11
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("physics")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background:
              activeTab === "physics"
                ? "linear-gradient(135deg,#FF6B35,#FF8C00)"
                : "rgba(255,255,255,0.07)",
            color: activeTab === "physics" ? "#fff" : "rgba(255,255,255,0.6)",
            transition: "all 0.2s",
          }}
        >
          ⚛️ Physics
        </button>
        <button
          type="button"
          onClick={() => setActiveTab("chemistry")}
          style={{
            flex: 1,
            padding: "8px 0",
            borderRadius: 10,
            border: "none",
            cursor: "pointer",
            fontWeight: 700,
            fontSize: 13,
            background:
              activeTab === "chemistry"
                ? "linear-gradient(135deg,#00E5CC,#00BFFF)"
                : "rgba(255,255,255,0.07)",
            color: activeTab === "chemistry" ? "#000" : "rgba(255,255,255,0.6)",
            transition: "all 0.2s",
          }}
        >
          🧪 Chem
        </button>
      </div>

      {/* Scrollable content */}
      <div
        style={{
          flex: 1,
          overflowY: "auto",
          WebkitOverflowScrolling: "touch",
          padding: "16px 20px 20px",
        }}
      >
        {activeTab === "general" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {FORMULAS.map((section) => (
              <div key={section.category}>
                <h3
                  style={{
                    color: "#FFD700",
                    fontSize: 11,
                    textTransform: "uppercase",
                    letterSpacing: 2,
                    fontWeight: 600,
                    marginBottom: 8,
                  }}
                >
                  {section.category}
                </h3>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {section.items.map((item) => {
                    const id = `${section.category}-${item.name}`;
                    const isCopied = copiedId === id;
                    return (
                      <FormulaItem
                        key={item.name}
                        id={id}
                        name={item.name}
                        formula={item.formula}
                        isCopied={isCopied}
                        onCopy={copyFormula}
                        copyLabel={t.copied}
                        onExampleClick={
                          onFormulaClick
                            ? () => onFormulaClick(item.formula)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "class11" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {/* Section title */}
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(168,85,247,0.2), rgba(0,191,255,0.2))",
                border: "1px solid rgba(168,85,247,0.4)",
                borderRadius: 14,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>📘</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                Class 11 Mathematics Formulas
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                All 16 Lessons — Tap any formula to copy
              </div>
            </div>

            {CLASS11_FORMULAS.map((section) => (
              <div key={section.lesson}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "8px 12px",
                    background: "rgba(168,85,247,0.12)",
                    borderLeft: "3px solid #A855F7",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  <span style={{ color: "#A855F7", fontSize: 14 }}>🔹</span>
                  <span
                    style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}
                  >
                    {section.lesson}
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {section.items.map((item) => {
                    const id = `class11-${section.lesson}-${item.name}`;
                    const isCopied = copiedId === id;
                    return (
                      <FormulaItem
                        key={id}
                        id={id}
                        name={item.name}
                        formula={item.formula}
                        isCopied={isCopied}
                        onCopy={copyFormula}
                        copyLabel={t.copied}
                        accent="#A855F7"
                        onExampleClick={
                          onFormulaClick
                            ? () => onFormulaClick(item.formula)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "physics" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(255,107,53,0.2), rgba(255,140,0,0.2))",
                border: "1px solid rgba(255,107,53,0.4)",
                borderRadius: 14,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>⚛️</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                Class 11 Physics Formulas
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                15 Chapters — Tap any formula to copy
              </div>
            </div>

            {CLASS11_PHYSICS_FORMULAS.map((section) => (
              <div key={section.lesson}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "8px 12px",
                    background: "rgba(255,107,53,0.12)",
                    borderLeft: "3px solid #FF6B35",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  <span style={{ color: "#FF6B35", fontSize: 14 }}>⚛️</span>
                  <span
                    style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}
                  >
                    {section.lesson}
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {section.items.map((item) => {
                    const id = `physics-${section.lesson}-${item.name}`;
                    const isCopied = copiedId === id;
                    return (
                      <FormulaItem
                        key={id}
                        id={id}
                        name={item.name}
                        formula={item.formula}
                        isCopied={isCopied}
                        onCopy={copyFormula}
                        copyLabel={t.copied}
                        accent="#FF6B35"
                        onExampleClick={
                          onFormulaClick
                            ? () => onFormulaClick(item.formula)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        {activeTab === "chemistry" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(0,229,204,0.2), rgba(0,191,255,0.2))",
                border: "1px solid rgba(0,229,204,0.4)",
                borderRadius: 14,
                padding: "14px 16px",
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 4 }}>🧪</div>
              <div style={{ color: "#fff", fontWeight: 800, fontSize: 16 }}>
                Class 11 Chemistry
              </div>
              <div
                style={{
                  color: "rgba(255,255,255,0.5)",
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                Formulas, Equations & Named Reactions
              </div>
            </div>
            {CLASS11_CHEMISTRY_FORMULAS.map((section) => (
              <div key={section.lesson}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 10,
                    padding: "8px 12px",
                    background: "rgba(0,229,204,0.10)",
                    borderLeft: "3px solid #00E5CC",
                    borderRadius: "0 10px 10px 0",
                  }}
                >
                  <span style={{ color: "#00E5CC", fontSize: 14 }}>🧪</span>
                  <span
                    style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}
                  >
                    {section.lesson}
                  </span>
                </div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 8 }}
                >
                  {section.items.map((item) => {
                    const id = `chem-${section.lesson}-${item.name}`;
                    const isCopied = copiedId === id;
                    return (
                      <FormulaItem
                        key={id}
                        id={id}
                        name={item.name}
                        formula={item.formula}
                        isCopied={isCopied}
                        onCopy={copyFormula}
                        copyLabel={t.copied}
                        accent="#00E5CC"
                        onExampleClick={
                          onFormulaClick
                            ? () => onFormulaClick(item.formula)
                            : undefined
                        }
                      />
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FormulaItem({
  id,
  name,
  formula,
  isCopied,
  onCopy,
  copyLabel,
  accent,
  onExampleClick,
}: {
  id: string;
  name: string;
  formula: string;
  isCopied: boolean;
  onCopy: (id: string, formula: string) => void;
  copyLabel: string;
  accent?: string;
  onExampleClick?: () => void;
}) {
  return (
    <div
      style={{
        borderRadius: 12,
        padding: 12,
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: "rgba(255,255,255,0.05)",
        border: `1px solid ${accent ? "rgba(168,85,247,0.15)" : "rgba(255,255,255,0.08)"}`,
      }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <p
          style={{
            color: "rgba(255,255,255,0.5)",
            fontSize: 11,
            marginBottom: 2,
            margin: "0 0 2px",
          }}
        >
          {name}
        </p>
        <p
          style={{
            color: "white",
            fontWeight: 500,
            fontSize: 13,
            fontFamily: "monospace",
            margin: 0,
            wordBreak: "break-word",
          }}
        >
          {formula}
        </p>
      </div>
      <button
        type="button"
        onClick={() => onCopy(id, formula)}
        style={{
          flexShrink: 0,
          width: 28,
          height: 28,
          borderRadius: 8,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: "pointer",
          background: isCopied
            ? "rgba(57,255,20,0.15)"
            : "rgba(255,255,255,0.08)",
          border: isCopied
            ? "1px solid rgba(57,255,20,0.35)"
            : "1px solid rgba(255,255,255,0.10)",
        }}
        title={isCopied ? copyLabel : "Copy formula"}
        data-ocid="formula.button"
      >
        {isCopied ? (
          <Check size={12} style={{ color: "#39FF14" }} />
        ) : (
          <Copy size={12} style={{ color: "rgba(255,255,255,0.6)" }} />
        )}
      </button>
      {onExampleClick && (
        <button
          type="button"
          onClick={onExampleClick}
          style={{
            flexShrink: 0,
            padding: "6px 14px",
            borderRadius: 10,
            cursor: "pointer",
            background: "linear-gradient(135deg, #00d2ff 0%, #a855f7 100%)",
            border: "none",
            color: "white",
            fontWeight: 700,
            fontSize: 11,
            minWidth: 96,
            boxShadow: "0 4px 0 #6b21a8, 0 6px 12px rgba(168,85,247,0.45)",
            transition: "transform 0.1s, box-shadow 0.1s",
            letterSpacing: "0.3px",
            whiteSpace: "nowrap",
          }}
          onMouseDown={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 2px 0 #6b21a8, 0 3px 8px rgba(168,85,247,0.35)";
          }}
          onMouseUp={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 0 #6b21a8, 0 6px 12px rgba(168,85,247,0.45)";
          }}
          onTouchStart={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform =
              "translateY(2px)";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 2px 0 #6b21a8, 0 3px 8px rgba(168,85,247,0.35)";
          }}
          onTouchEnd={(e) => {
            (e.currentTarget as HTMLButtonElement).style.transform = "";
            (e.currentTarget as HTMLButtonElement).style.boxShadow =
              "0 4px 0 #6b21a8, 0 6px 12px rgba(168,85,247,0.45)";
          }}
          data-ocid="formula.secondary_button"
        >
          Example 🔍
        </button>
      )}
    </div>
  );
}
