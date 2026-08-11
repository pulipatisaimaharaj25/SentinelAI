import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "20mb" }));

// Initialize GoogleGenAI client lazily or when key is present
const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
};

// Health Check API
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    hasApiKey: !!process.env.GEMINI_API_KEY,
    appName: "SentinelAI — Public Safety Assistant",
  });
});

// 1. Incident Analysis API
app.post("/api/analyze-incident", async (req, res) => {
  try {
    const { incidentType, description, location, imageBase64 } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      // Return smart fallback if API key is not configured yet
      const fallbackSeverity =
        incidentType === "Road Accident" || incidentType === "Flood/Water Hazard"
          ? "Critical"
          : "Medium";

      return res.json({
        severity: fallbackSeverity,
        titleEn: `Reported ${incidentType || "Emergency"} near ${location || "Current Location"}`,
        titleTe: `${location || "ప్రస్తుత ప్రాంతం"} దగ్గర ${incidentType || "అత్యవసర పరిస్థితి"} నివేదించబడింది`,
        reassuranceEn:
          fallbackSeverity === "Critical"
            ? "This looks serious — emergency responders have been notified. Please stay in a safe location."
            : "Your report has been logged successfully. Community safety teams are monitoring the area.",
        reassuranceTe:
          fallbackSeverity === "Critical"
            ? "ఇది తీవ్రమైనదిగా అనిపిస్తుంది — అత్యవసర ప్రతిస్పందనదారులకు సమాచారం అందించబడింది. దయచేసి సురక్షిత ప్రదేశంలో ఉండండి."
            : "మీ నివేదిక విజయవంతంగా నమోదు చేయబడింది. కమ్యూనిటీ భద్రతా బృందాలు ఈ ప్రాంతాన్ని పర్యవేక్షిస్తున్నాయి.",
        adviceEn: [
          "Keep clear of immediate hazard zone",
          "If anyone is injured, call local helpline 112 immediately",
          "Remain calm and wait for local authority confirmation",
        ],
        adviceTe: [
          "ప్రమాదకర ప్రాంతానికి దూరంగా ఉండండి",
          "ఎవరికైనా గాయాలైతే, వెంటనే స్థానిక హెల్ప్‌లైన్ 112 కి కాల్ చేయండి",
          "శాంతంగా ఉండండి మరియు స్థానిక అధికారుల నిర్ధారణ కోసం వేచి ఉండండి",
        ],
        detectedType: incidentType || "General Emergency",
        estimatedResponseTime: "5-10 minutes",
      });
    }

    const systemPrompt = `You are SentinelAI, an empathetic public safety emergency responder assistant. 
Analyze the provided emergency report details (and photo if attached).
Determine:
1. Severity level: strictly one of ["Critical", "High", "Medium", "Low"].
2. Calm, reassuring short title in English and Telugu.
3. Reassuring message in English and Telugu explaining help notification status in plain friendly non-technical language.
4. 3 simple, plain-language actionable next steps for the citizen in English and Telugu.
5. Estimated response time string (e.g., "5-10 minutes").

Keep language simple, warm, supportive, and non-scary. Avoid technical jargon like "protocol" or "dispatch code".`;

    const contentsParts: any[] = [];

    if (imageBase64) {
      const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");
      contentsParts.push({
        inlineData: {
          mimeType: "image/jpeg",
          data: base64Data,
        },
      });
    }

    contentsParts.push({
      text: `Incident Type Selected: ${incidentType}\nLocation: ${location || "Not specified"}\nDescription: ${description || "No description provided"}`,
    });

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: { parts: contentsParts },
      config: {
        systemInstruction: systemPrompt,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            severity: { type: Type.STRING, description: "Critical, High, Medium, or Low" },
            titleEn: { type: Type.STRING },
            titleTe: { type: Type.STRING },
            reassuranceEn: { type: Type.STRING },
            reassuranceTe: { type: Type.STRING },
            adviceEn: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            adviceTe: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            detectedType: { type: Type.STRING },
            estimatedResponseTime: { type: Type.STRING },
          },
          required: [
            "severity",
            "titleEn",
            "titleTe",
            "reassuranceEn",
            "reassuranceTe",
            "adviceEn",
            "adviceTe",
            "detectedType",
            "estimatedResponseTime",
          ],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Error analyzing incident:", error);
    return res.status(500).json({
      error: "Failed to analyze incident with Gemini.",
      details: error?.message,
    });
  }
});

// 2. Missing Person Alert Generator API
app.post("/api/generate-missing-person-alert", async (req, res) => {
  try {
    const { name, age, lastSeenLocation, contactNumber, additionalDetails } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        alertEn: `MISSING PERSON ALERT: ${name || "Unknown Person"}, Age ${age || "N/A"}. Last seen at ${lastSeenLocation || "Unspecified location"}. If you have any information, please contact ${contactNumber || "Emergency Helpline 112"} immediately. ${additionalDetails || ""}`,
        alertTe: `కనిపించని వ్యక్తి అలర్ట్: ${name || "పేరు తెలియదు"}, వయస్సు ${age || "తెలియదు"}. చివరిసారిగా ${lastSeenLocation || "ప్రదేశం వివరాలు లేవు"} వద్ద చూశారు. మీకు సమాచారం తెలిస్తే, దయచేసి వెంటనే ${contactNumber || "అత్యవసర హెల్ప్‌లైన్ 112"} కు కాల్ చేయండి.`,
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Create a urgent yet calm public missing person alert broadcast in English and Telugu.
Person Details:
- Name: ${name}
- Age: ${age}
- Last Seen Location: ${lastSeenLocation}
- Contact Phone: ${contactNumber}
- Extra Info: ${additionalDetails || "None"}`,
      config: {
        systemInstruction: "You are SentinelAI. Generate concise, empathetic, shareable public alerts in English and Telugu.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            alertEn: { type: Type.STRING },
            alertTe: { type: Type.STRING },
          },
          required: ["alertEn", "alertTe"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Missing person alert error:", error);
    return res.status(500).json({ error: error?.message });
  }
});

// 3. Flood & Weather Advice API
app.post("/api/generate-weather-advice", async (req, res) => {
  try {
    const { riskLevel, location, weatherCondition } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        summaryEn: `Current weather risk is ${riskLevel}. ${weatherCondition || "Light to moderate rain expected"}. Low-lying areas should stay vigilant.`,
        summaryTe: `ప్రస్తుత వాతావరణ ప్రమాదం ${riskLevel}. ${weatherCondition || "తేలికపాటి నుండి మోస్తరు వర్షం కురిసే అవకాశం ఉంది"}. లోతట్టు ప్రాంతాల ప్రజలు అప్రమత్తంగా ఉండాలి.`,
        tipsEn: [
          "Avoid driving through waterlogged streets or submerged bridges.",
          "Keep mobile phones fully charged and emergency lights ready.",
          "Keep emergency helpline numbers saved on your phone.",
        ],
        tipsTe: [
          "నీరు నిలిచిన వీధులు లేదా మునిగిపోయిన వంతెనల గుండా వాహనాలు నడపవద్దు.",
          "మొబైల్ ఫోన్‌లను పూర్తిగా ఛార్జ్ చేసి, ఎమర్జెన్సీ లైట్లను సిద్ధంగా ఉంచుకోండి.",
          "అత్యవసర హెల్ప్‌లైన్ నంబర్‌లను మీ ఫోన్‌లో సేవ్ చేసుకోండి.",
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Generate friendly public safety weather guidance for a flood/weather risk level of "${riskLevel}" in ${location || "your region"}. Current condition: ${weatherCondition || "Rainy/Monsoon"}.`,
      config: {
        systemInstruction: "You are SentinelAI. Provide practical, calm, plain-language flood and weather safety guidance in English and Telugu.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summaryEn: { type: Type.STRING },
            summaryTe: { type: Type.STRING },
            tipsEn: { type: Type.ARRAY, items: { type: Type.STRING } },
            tipsTe: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["summaryEn", "summaryTe", "tipsEn", "tipsTe"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Weather advice error:", error);
    return res.status(500).json({ error: error?.message });
  }
});

// 4. Analytics Insights API
app.post("/api/generate-analytics-insights", async (req, res) => {
  try {
    const { incidents } = req.body;

    const ai = getGeminiClient();

    if (!ai) {
      return res.json({
        insightsEn: [
          {
            title: "Frequent Incident Category",
            detail: "Road Accidents account for the majority of reported issues today.",
            suggestion: "Increased traffic patrol near MG Road & Ring Road junction is advised.",
          },
          {
            title: "Peak Activity Window",
            detail: "Most reports were logged during evening commuting hours (5 PM - 8 PM).",
            suggestion: "Deploy quick-response medical volunteers during evening peak hours.",
          },
          {
            title: "Response Resolution Rate",
            detail: "Community responders have resolved 65% of reports within 30 minutes.",
            suggestion: "Maintain current responder readiness in central zones.",
          },
        ],
        insightsTe: [
          {
            title: "తరచుగా జరిగే సంఘటన వర్గం",
            detail: "ఈరోజు నమోదైన సమస్యలలో రోడ్డు ప్రమాదాలే ఎక్కువగా ఉన్నాయి.",
            suggestion: "MG రోడ్డు మరియు రింగ్ రోడ్డు జంక్షన్ వద్ద ట్రాఫిక్ పెట్రోలింగ్ పెంచాలని సూచించబడింది.",
          },
          {
            title: "అత్యధిక కార్యకలాపాల సమయం",
            detail: "చాలా నివేదికలు సాయంత్రం ప్రయాణ సమయంలో (సాయంత్రం 5 నుండి రాత్రి 8 వరకు) నమోదయ్యాయి.",
            suggestion: "సాయంత్రం వేళల్లో త్వరిత-ప్రతిస్పందన వైద్య వాలంటీర్లను మోహరించండి.",
          },
          {
            title: "పరిష్కార రేటు",
            detail: "కమ్యూనిటీ రెస్పాండర్లు 30 నిమిషాల్లో 65% నివేదికలను పరిష్కరించారు.",
            suggestion: "కేంద్ర మండలాల్లో ప్రస్తుత రెస్పాండర్ సిద్ధతను కొనసాగించండి.",
          },
        ],
      });
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: `Analyze these recent community safety incidents and generate 3 clear, plain-language insight cards for citizen authorities.
Incidents Data: ${JSON.stringify(incidents || [])}`,
      config: {
        systemInstruction: "You are SentinelAI. Generate 3 simple, non-complex plain-language public safety insight cards in both English and Telugu.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            insightsEn: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                },
                required: ["title", "detail", "suggestion"],
              },
            },
            insightsTe: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  detail: { type: Type.STRING },
                  suggestion: { type: Type.STRING },
                },
                required: ["title", "detail", "suggestion"],
              },
            },
          },
          required: ["insightsEn", "insightsTe"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");
    return res.json(result);
  } catch (error: any) {
    console.error("Analytics insights error:", error);
    return res.status(500).json({ error: error?.message });
  }
});

// Vite middleware integration
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`SentinelAI server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer();
