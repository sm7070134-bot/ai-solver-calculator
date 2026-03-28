export type LangCode =
  | "en-US"
  | "es-ES"
  | "fr-FR"
  | "de-DE"
  | "zh-CN"
  | "hi-IN";

export interface Translations {
  hello: string;
  welcome: string;
  madeBy: string;
  toolHistory: string;
  toolFormulas: string;
  toolGraph: string;
  toolExplain: string;
  toolAiSolve: string;
  toolPdf: string;
  toolSettings: string;
  themeLabel: string;
  voiceLabel: string;
  voiceProcessing: string;
  copied: string;
  pdfExported: string;
  pdfNotLoaded: string;
  settingsTitle: string;
  settingsSoundLabel: string;
  settingsSoundDesc: string;
  settingsHapticLabel: string;
  settingsHapticDesc: string;
  settingsContinuousLabel: string;
  settingsContinuousDesc: string;
  settingsSensitivityLabel: string;
  settingsLanguageLabel: string;
  settingsAbout: string;
  historyTitle: string;
  historyEmpty: string;
  historyNone: string;
  formulasTitle: string;
  graphTitle: string;
  graphPlaceholder: string;
  explainTitle: string;
  explainLoading: string;
  explainEnterValid: string;
  explainExample: string;
  explainError: string;
  explainTryAgain: string;
  explainClose: string;
  aiSolveTitle: string;
  aiSolveProblemLabel: string;
  aiSolvePlaceholder: string;
  aiSolveButton: string;
  aiSolveSolving: string;
  aiSolveClose: string;
  aboutEdition: string;
  aboutVersion: string;
  aboutFeature1: string;
  aboutFeature2: string;
  aboutFeature3: string;
  aboutFeature4: string;
  aboutFeature5: string;
  aboutPoweredBy: string;
  aiExplainSystemPrompt: string;
  aiExplainUserPrompt: (expr: string) => string;
  aiSolveSystemPrompt: string;
  aiSolveHint: string;
  aiSolveVideoFound: string;
  aiSolveOpenYouTube: string;
}

export const translations: Record<LangCode, Translations> = {
  "en-US": {
    hello: "HELLO",
    welcome: "✦ Welcome ✦",
    madeBy: "MADE BY SHREYASH STUDIO",
    toolHistory: "History",
    toolFormulas: "Formulas",
    toolGraph: "Graph",
    toolExplain: "Explain",
    toolAiSolve: "AI Solve",
    toolPdf: "PDF",
    toolSettings: "Settings",
    themeLabel: "Theme",
    voiceLabel: "Voice",
    voiceProcessing: "Processing…",
    copied: "Copied!",
    pdfExported: "PDF exported!",
    pdfNotLoaded: "PDF library not loaded yet. Please try again.",
    settingsTitle: "Settings",
    settingsSoundLabel: "🔊 Button Sound",
    settingsSoundDesc: "Play click sound on button press",
    settingsHapticLabel: "📳 Haptic Feedback",
    settingsHapticDesc: "Vibrate on button press (if supported)",
    settingsContinuousLabel: "🎤 Continuous Voice",
    settingsContinuousDesc: "Keep listening after each result",
    settingsSensitivityLabel: "🎙️ Voice Sensitivity",
    settingsLanguageLabel: "🌐 Voice Language",
    settingsAbout: "ℹ️ About",
    historyTitle: "History",
    historyEmpty: "No calculations yet",
    historyNone: "📋",
    formulasTitle: "Math Formulas",
    graphTitle: "Graph",
    graphPlaceholder: "Enter expression to plot",
    explainTitle: "AI Explain",
    explainLoading: "AI is generating explanation…",
    explainEnterValid: "Please enter a valid calculation first",
    explainExample: "Example: 5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError: "Unable to explain this calculation. Try a simpler one.",
    explainTryAgain: "Try again",
    explainClose: "Close",
    aiSolveTitle: "AI Solve",
    aiSolveProblemLabel: "Math Problem",
    aiSolvePlaceholder: "Ask anything — math, GK, science, current affairs…",
    aiSolveButton: "✨ Solve with AI",
    aiSolveSolving: "Solving…",
    aiSolveClose: "Close",
    aboutEdition: "Ultra Premium Edition",
    aboutVersion: "Version 1.0.0",
    aboutFeature1: "Full arithmetic with real-time preview",
    aboutFeature2: "AI Voice recognition with TTS feedback",
    aboutFeature3: "Math formula reference library",
    aboutFeature4: "Calculation history (last 20 entries)",
    aboutFeature5: "Customizable settings & language support",
    aboutPoweredBy: "Powered by",
    aiExplainSystemPrompt:
      "You are an expert math tutor. When given a math expression, solve it step by step with clear numbered steps. Be concise but thorough. Show each calculation clearly. Respond in English.",
    aiExplainUserPrompt: (expr) => `Solve this step by step: ${expr}`,
    aiSolveSystemPrompt:
      "You are a universal AI assistant. Answer any question asked — math, general knowledge, current affairs, science, history, sports, or any topic. Always detect the language of the user's question and respond in the SAME language. If asked in Hindi, respond in Hindi. If asked in English, respond in English. Be clear, helpful, and detailed.",
    aiSolveHint:
      "Ask anything — math, GK, science, current affairs, or any topic. Type 'video' to search on YouTube.",
    aiSolveVideoFound: "YouTube Video Search",
    aiSolveOpenYouTube: "Open on YouTube",
  },

  "hi-IN": {
    hello: "नमस्ते",
    welcome: "✦ स्वागत है ✦",
    madeBy: "SHREYASH STUDIO द्वारा निर्मित",
    toolHistory: "इतिहास",
    toolFormulas: "सूत्र",
    toolGraph: "ग्राफ",
    toolExplain: "व्याख्या",
    toolAiSolve: "AI हल",
    toolPdf: "PDF",
    toolSettings: "सेटिंग्स",
    themeLabel: "थीम",
    voiceLabel: "आवाज़",
    voiceProcessing: "प्रसंस्करण…",
    copied: "कॉपी हो गया!",
    pdfExported: "PDF निर्यात हो गई!",
    pdfNotLoaded: "PDF लाइब्रेरी लोड नहीं हुई। कृपया पुनः प्रयास करें।",
    settingsTitle: "सेटिंग्स",
    settingsSoundLabel: "🔊 बटन ध्वनि",
    settingsSoundDesc: "बटन दबाने पर क्लिक ध्वनि चलाएं",
    settingsHapticLabel: "📳 स्पर्श प्रतिक्रिया",
    settingsHapticDesc: "बटन दबाने पर कंपन (यदि समर्थित हो)",
    settingsContinuousLabel: "🎤 निरंतर आवाज़",
    settingsContinuousDesc: "प्रत्येक परिणाम के बाद सुनते रहें",
    settingsSensitivityLabel: "🎙️ आवाज़ संवेदनशीलता",
    settingsLanguageLabel: "🌐 आवाज़ भाषा",
    settingsAbout: "ℹ️ के बारे में",
    historyTitle: "इतिहास",
    historyEmpty: "अभी तक कोई गणना नहीं",
    historyNone: "📋",
    formulasTitle: "गणित सूत्र",
    graphTitle: "ग्राफ",
    graphPlaceholder: "प्लॉट करने के लिए व्यंजक दर्ज करें",
    explainTitle: "AI व्याख्या",
    explainLoading: "AI व्याख्या तैयार कर रहा है…",
    explainEnterValid: "कृपया पहले एक वैध गणना दर्ज करें",
    explainExample: "उदाहरण: 5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError: "इस गणना को समझाने में असमर्थ। कोई सरल उदाहरण आज़माएं।",
    explainTryAgain: "पुनः प्रयास करें",
    explainClose: "बंद करें",
    aiSolveTitle: "AI हल",
    aiSolveProblemLabel: "गणित समस्या",
    aiSolvePlaceholder: "अपनी गणित समस्या या व्यंजक दर्ज करें…",
    aiSolveButton: "✨ AI से हल करें",
    aiSolveSolving: "हल हो रहा है…",
    aiSolveClose: "बंद करें",
    aboutEdition: "अल्ट्रा प्रीमियम संस्करण",
    aboutVersion: "संस्करण 1.0.0",
    aboutFeature1: "रीयल-टाइम प्रीव्यू के साथ पूर्ण अंकगणित",
    aboutFeature2: "TTS फीडबैक के साथ AI वॉयस रिकॉग्निशन",
    aboutFeature3: "गणित सूत्र संदर्भ पुस्तकालय",
    aboutFeature4: "गणना इतिहास (पिछली 20 प्रविष्टियां)",
    aboutFeature5: "अनुकूलन योग्य सेटिंग्स और भाषा समर्थन",
    aboutPoweredBy: "द्वारा संचालित",
    aiExplainSystemPrompt:
      "आप एक विशेषज्ञ गणित शिक्षक हैं। जब भी कोई गणितीय व्यंजक दिया जाए, उसे स्पष्ट क्रमांकित चरणों के साथ हल करें। संक्षिप्त लेकिन संपूर्ण रहें। हिंदी में उत्तर दें।",
    aiExplainUserPrompt: (expr) => `इसे चरण दर चरण हल करें: ${expr}`,
    aiSolveSystemPrompt:
      "आप एक सार्वभौमिक AI सहायक हैं। कोई भी प्रश्न पूछा जाए — गणित, सामान्य ज्ञान, विज्ञान, इतिहास, वर्तमान घटनाएं, खेल या कोई भी विषय — आप उसका उत्तर देंगे। हमेशा उसी भाषा में उत्तर दें जिसमें प्रश्न पूछा गया हो। हिंदी में पूछा तो हिंदी में जवाब दें, अंग्रेजी में पूछा तो अंग्रेजी में जवाब दें।",
    aiSolveHint:
      "कुछ भी पूछें — गणित, GK, विज्ञान, वर्तमान घटनाएं या कोई भी विषय। वीडियो देखने के लिए ‘video’ लिखें।",
    aiSolveVideoFound: "YouTube वीडियो खोज",
    aiSolveOpenYouTube: "YouTube पर देखें",
  },

  "fr-FR": {
    hello: "BONJOUR",
    welcome: "✦ Bienvenue ✦",
    madeBy: "CRÉÉ PAR SHREYASH STUDIO",
    toolHistory: "Historique",
    toolFormulas: "Formules",
    toolGraph: "Graphe",
    toolExplain: "Expliquer",
    toolAiSolve: "IA Résoudre",
    toolPdf: "PDF",
    toolSettings: "Paramètres",
    themeLabel: "Thème",
    voiceLabel: "Voix",
    voiceProcessing: "Traitement…",
    copied: "Copié !",
    pdfExported: "PDF exporté !",
    pdfNotLoaded: "Bibliothèque PDF non chargée. Veuillez réessayer.",
    settingsTitle: "Paramètres",
    settingsSoundLabel: "🔊 Son des boutons",
    settingsSoundDesc: "Jouer un son au clic",
    settingsHapticLabel: "📳 Retour haptique",
    settingsHapticDesc: "Vibrer à chaque clic (si supporté)",
    settingsContinuousLabel: "🎤 Voix continue",
    settingsContinuousDesc: "Continuer à écouter après chaque résultat",
    settingsSensitivityLabel: "🎙️ Sensibilité vocale",
    settingsLanguageLabel: "🌐 Langue vocale",
    settingsAbout: "ℹ️ À propos",
    historyTitle: "Historique",
    historyEmpty: "Aucun calcul pour l'instant",
    historyNone: "📋",
    formulasTitle: "Formules mathématiques",
    graphTitle: "Graphe",
    graphPlaceholder: "Entrez une expression à tracer",
    explainTitle: "IA Expliquer",
    explainLoading: "L'IA génère une explication…",
    explainEnterValid: "Veuillez d'abord entrer un calcul valide",
    explainExample: "Exemple : 5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError: "Impossible d'expliquer ce calcul. Essayez plus simple.",
    explainTryAgain: "Réessayer",
    explainClose: "Fermer",
    aiSolveTitle: "IA Résoudre",
    aiSolveProblemLabel: "Problème mathématique",
    aiSolvePlaceholder: "Entrez votre problème mathématique…",
    aiSolveButton: "✨ Résoudre avec l'IA",
    aiSolveSolving: "Résolution…",
    aiSolveClose: "Fermer",
    aboutEdition: "Édition Ultra Premium",
    aboutVersion: "Version 1.0.0",
    aboutFeature1: "Arithmétique complète avec aperçu en temps réel",
    aboutFeature2: "Reconnaissance vocale IA avec retour TTS",
    aboutFeature3: "Bibliothèque de formules mathématiques",
    aboutFeature4: "Historique des calculs (20 dernières entrées)",
    aboutFeature5: "Paramètres personnalisables et support multilingue",
    aboutPoweredBy: "Propulsé par",
    aiExplainSystemPrompt:
      "Vous êtes un expert en mathématiques. Résolvez l'expression donnée étape par étape avec des numéros clairs. Soyez concis mais complet. Répondez en français.",
    aiExplainUserPrompt: (expr) => `Résoudre étape par étape : ${expr}`,
    aiSolveSystemPrompt:
      "Vous êtes un assistant IA universel. Répondez à toute question posée — mathématiques, culture générale, actualités, sciences, histoire ou tout autre sujet. Détectez toujours la langue de la question et répondez dans la MÊMME langue.",
    aiSolveHint:
      "Posez n'importe quelle question — math, culture générale, science, actualités. Tapez 'video' pour chercher sur YouTube.",
    aiSolveVideoFound: "Recherche vidéo YouTube",
    aiSolveOpenYouTube: "Ouvrir sur YouTube",
  },

  "es-ES": {
    hello: "HOLA",
    welcome: "✦ Bienvenido ✦",
    madeBy: "HECHO POR SHREYASH STUDIO",
    toolHistory: "Historial",
    toolFormulas: "Fórmulas",
    toolGraph: "Gráfico",
    toolExplain: "Explicar",
    toolAiSolve: "IA Resolver",
    toolPdf: "PDF",
    toolSettings: "Ajustes",
    themeLabel: "Tema",
    voiceLabel: "Voz",
    voiceProcessing: "Procesando…",
    copied: "¡Copiado!",
    pdfExported: "¡PDF exportado!",
    pdfNotLoaded: "Biblioteca PDF no cargada. Inténtalo de nuevo.",
    settingsTitle: "Ajustes",
    settingsSoundLabel: "🔊 Sonido de botones",
    settingsSoundDesc: "Reproducir sonido al pulsar",
    settingsHapticLabel: "📳 Respuesta háptica",
    settingsHapticDesc: "Vibrar al pulsar (si es compatible)",
    settingsContinuousLabel: "🎤 Voz continua",
    settingsContinuousDesc: "Seguir escuchando tras cada resultado",
    settingsSensitivityLabel: "🎙️ Sensibilidad de voz",
    settingsLanguageLabel: "🌐 Idioma de voz",
    settingsAbout: "ℹ️ Acerca de",
    historyTitle: "Historial",
    historyEmpty: "Sin cálculos aún",
    historyNone: "📋",
    formulasTitle: "Fórmulas matemáticas",
    graphTitle: "Gráfico",
    graphPlaceholder: "Introduce una expresión para graficar",
    explainTitle: "IA Explicar",
    explainLoading: "La IA está generando la explicación…",
    explainEnterValid: "Por favor introduce un cálculo válido primero",
    explainExample: "Ejemplo: 5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError:
      "No se puede explicar este cálculo. Intenta uno más sencillo.",
    explainTryAgain: "Intentar de nuevo",
    explainClose: "Cerrar",
    aiSolveTitle: "IA Resolver",
    aiSolveProblemLabel: "Problema matemático",
    aiSolvePlaceholder: "Introduce tu problema matemático…",
    aiSolveButton: "✨ Resolver con IA",
    aiSolveSolving: "Resolviendo…",
    aiSolveClose: "Cerrar",
    aboutEdition: "Edición Ultra Premium",
    aboutVersion: "Versión 1.0.0",
    aboutFeature1: "Aritmética completa con vista previa en tiempo real",
    aboutFeature2: "Reconocimiento de voz IA con retroalimentación TTS",
    aboutFeature3: "Biblioteca de referencia de fórmulas matemáticas",
    aboutFeature4: "Historial de cálculos (últimas 20 entradas)",
    aboutFeature5: "Ajustes personalizables y soporte de idiomas",
    aboutPoweredBy: "Desarrollado por",
    aiExplainSystemPrompt:
      "Eres un tutor experto en matemáticas. Resuelve la expresión dada paso a paso con pasos numerados claros. Sé conciso pero completo. Responde en español.",
    aiExplainUserPrompt: (expr) => `Resuelve esto paso a paso: ${expr}`,
    aiSolveSystemPrompt:
      "Eres un asistente de IA universal. Responde cualquier pregunta — matemáticas, cultura general, ciencia, historia o cualquier tema. Detecta siempre el idioma de la pregunta y responde en el MISMO idioma.",
    aiSolveHint:
      "Pregunta cualquier cosa — matemáticas, cultura general, ciencia, actualidad. Escribe 'video' para buscar en YouTube.",
    aiSolveVideoFound: "Búsqueda de video en YouTube",
    aiSolveOpenYouTube: "Abrir en YouTube",
  },

  "de-DE": {
    hello: "HALLO",
    welcome: "✦ Willkommen ✦",
    madeBy: "ERSTELLT VON SHREYASH STUDIO",
    toolHistory: "Verlauf",
    toolFormulas: "Formeln",
    toolGraph: "Graph",
    toolExplain: "Erklären",
    toolAiSolve: "KI Lösen",
    toolPdf: "PDF",
    toolSettings: "Einstellungen",
    themeLabel: "Thema",
    voiceLabel: "Stimme",
    voiceProcessing: "Verarbeitung…",
    copied: "Kopiert!",
    pdfExported: "PDF exportiert!",
    pdfNotLoaded: "PDF-Bibliothek nicht geladen. Bitte erneut versuchen.",
    settingsTitle: "Einstellungen",
    settingsSoundLabel: "🔊 Tastenton",
    settingsSoundDesc: "Klickton beim Drücken abspielen",
    settingsHapticLabel: "📳 Haptisches Feedback",
    settingsHapticDesc: "Beim Drücken vibrieren (falls unterstützt)",
    settingsContinuousLabel: "🎤 Kontinuierliche Stimme",
    settingsContinuousDesc: "Nach jedem Ergebnis weiterzuhören",
    settingsSensitivityLabel: "🎙️ Stimmempfindlichkeit",
    settingsLanguageLabel: "🌐 Stimmensprache",
    settingsAbout: "ℹ️ Über",
    historyTitle: "Verlauf",
    historyEmpty: "Noch keine Berechnungen",
    historyNone: "📋",
    formulasTitle: "Mathematische Formeln",
    graphTitle: "Graph",
    graphPlaceholder: "Ausdruck zum Plotten eingeben",
    explainTitle: "KI Erklären",
    explainLoading: "KI generiert Erklärung…",
    explainEnterValid: "Bitte zuerst eine gültige Berechnung eingeben",
    explainExample: "Beispiel: 5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError:
      "Diese Berechnung kann nicht erklärt werden. Versuche eine einfachere.",
    explainTryAgain: "Erneut versuchen",
    explainClose: "Schließen",
    aiSolveTitle: "KI Lösen",
    aiSolveProblemLabel: "Mathematisches Problem",
    aiSolvePlaceholder: "Mathematisches Problem oder Ausdruck eingeben…",
    aiSolveButton: "✨ Mit KI lösen",
    aiSolveSolving: "Lösung…",
    aiSolveClose: "Schließen",
    aboutEdition: "Ultra Premium Edition",
    aboutVersion: "Version 1.0.0",
    aboutFeature1: "Vollständige Arithmetik mit Echtzeit-Vorschau",
    aboutFeature2: "KI-Spracherkennung mit TTS-Feedback",
    aboutFeature3: "Mathematische Formelreferenzbibliothek",
    aboutFeature4: "Berechnungsverlauf (letzte 20 Einträge)",
    aboutFeature5: "Anpassbare Einstellungen und Sprachunterstützung",
    aboutPoweredBy: "Bereitgestellt von",
    aiExplainSystemPrompt:
      "Du bist ein Mathe-Experte. Löse den gegebenen Ausdruck Schritt für Schritt mit klaren nummerierten Schritten. Sei präzise aber gründlich. Antworte auf Deutsch.",
    aiExplainUserPrompt: (expr) => `Löse dies Schritt für Schritt: ${expr}`,
    aiSolveSystemPrompt:
      "Du bist ein universeller KI-Assistent. Beantworte jede gestellte Frage — Mathematik, Allgemeinwissen, Wissenschaft, Geschichte oder jedes Thema. Erkenne immer die Sprache der Frage und antworte in DERSELBEN Sprache.",
    aiSolveHint:
      "Stelle beliebige Fragen — Mathe, Allgemeinwissen, Wissenschaft, Aktuelles. Tippe 'video' für YouTube-Suche.",
    aiSolveVideoFound: "YouTube-Videosuche",
    aiSolveOpenYouTube: "Auf YouTube öffnen",
  },

  "zh-CN": {
    hello: "你好",
    welcome: "✦ 欢迎 ✦",
    madeBy: "由 SHREYASH STUDIO 制作",
    toolHistory: "历史",
    toolFormulas: "公式",
    toolGraph: "图表",
    toolExplain: "解释",
    toolAiSolve: "AI求解",
    toolPdf: "PDF",
    toolSettings: "设置",
    themeLabel: "主题",
    voiceLabel: "语音",
    voiceProcessing: "处理中…",
    copied: "已复制！",
    pdfExported: "PDF已导出！",
    pdfNotLoaded: "PDF库未加载，请重试。",
    settingsTitle: "设置",
    settingsSoundLabel: "🔊 按键音效",
    settingsSoundDesc: "按下按键时播放点击声",
    settingsHapticLabel: "📳 触觉反馈",
    settingsHapticDesc: "按键时振动（如支持）",
    settingsContinuousLabel: "🎤 连续语音",
    settingsContinuousDesc: "每次结果后继续收听",
    settingsSensitivityLabel: "🎙️ 语音灵敏度",
    settingsLanguageLabel: "🌐 语音语言",
    settingsAbout: "ℹ️ 关于",
    historyTitle: "历史记录",
    historyEmpty: "暂无计算记录",
    historyNone: "📋",
    formulasTitle: "数学公式",
    graphTitle: "图表",
    graphPlaceholder: "输入要绘制的表达式",
    explainTitle: "AI解释",
    explainLoading: "AI正在生成解释…",
    explainEnterValid: "请先输入有效的计算",
    explainExample: "示例：5 + 3, 10 - 4, 6 × 7, 20 ÷ 5",
    explainError: "无法解释此计算，请尝试更简单的。",
    explainTryAgain: "重试",
    explainClose: "关闭",
    aiSolveTitle: "AI求解",
    aiSolveProblemLabel: "数学问题",
    aiSolvePlaceholder: "输入您的数学问题或表达式…",
    aiSolveButton: "✨ 用AI求解",
    aiSolveSolving: "求解中…",
    aiSolveClose: "关闭",
    aboutEdition: "超级高级版",
    aboutVersion: "版本 1.0.0",
    aboutFeature1: "实时预览的完整算术",
    aboutFeature2: "带TTS反馈的AI语音识别",
    aboutFeature3: "数学公式参考库",
    aboutFeature4: "计算历史（最近20条）",
    aboutFeature5: "可自定义设置和语言支持",
    aboutPoweredBy: "由以下提供支持",
    aiExplainSystemPrompt:
      "你是一位数学专家。当给定数学表达式时，用清晰的编号步骤逐步求解。简洁而全面。用中文回答。",
    aiExplainUserPrompt: (expr) => `逐步求解：${expr}`,
    aiSolveSystemPrompt:
      "你是一位通用AI助手。回答任何问题—数学、常识、科学、历史或任何主题。始终检测问题的语言并用相同的语言回答。",
    aiSolveHint:
      "可以提问任何问题—数学、常识、科学、时事。输入‘video’在YouTube搜索。",
    aiSolveVideoFound: "YouTube视频搜索",
    aiSolveOpenYouTube: "在YouTube上打开",
  },
};

export function getT(lang: string): Translations {
  return translations[lang as LangCode] ?? translations["en-US"];
}
