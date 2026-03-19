import db from '../db/index.js';
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateRecommendations = async (req, res) => {
  const { sme_id } = req.body;
  try {
    const score = db.prepare('SELECT * FROM ldvs_scores WHERE sme_id = ? ORDER BY computed_at DESC LIMIT 1').get(sme_id);
    if (!score) return res.status(404).json({ error: 'No score found for this SME' });

    const prompt = `You are a digital business advisor for Kenyan small businesses with limited technical knowledge.
A business has the following digital visibility scores:
- Profile Completeness: ${score.profile_score}/100
- Posting Consistency: ${score.posting_score}/100
- Engagement Level: ${score.engagement_score}/100
- Responsiveness: ${score.responsiveness_score}/100
- Platform Presence: ${score.platform_score}/100
- Overall LDVS: ${score.total_ldvs}/100

Give exactly 3 to 5 prioritized, practical recommendations to improve this SME's online visibility.
Use simple, encouraging language. Be specific. Start with the weakest areas.
Format as a numbered list. Each recommendation must be 1–2 sentences only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const recommendationText = response.text;
    db.prepare('INSERT INTO recommendations (sme_id, recommendation_text) VALUES (?, ?)').run(sme_id, recommendationText);

    res.json({ recommendation_text: recommendationText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getLatestRecommendations = (req, res) => {
  try {
    const rec = db.prepare('SELECT * FROM recommendations WHERE sme_id = ? ORDER BY generated_at DESC LIMIT 1').get(req.params.sme_id);
    res.json(rec || { recommendation_text: "" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const translateRecommendations = async (req, res) => {
  const { sme_id, text } = req.body;
  try {
    const prompt = `Translate the following digital business recommendations for a Kenyan SME into Swahili. Keep the tone encouraging and simple:
    
    ${text}`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });

    const translatedText = response.text;
    db.prepare('INSERT INTO recommendations (sme_id, recommendation_text, language) VALUES (?, ?, ?)').run(sme_id, translatedText, 'swahili');

    res.json({ recommendation_text: translatedText });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
