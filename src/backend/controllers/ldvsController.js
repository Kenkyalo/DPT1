import db from '../db/index.js';

export const calculateLDVS = (req, res) => {
  const { sme_id, profile_completeness_pct, posts_per_week, avg_engagement, avg_response_hours, active_platforms } = req.body;

  // Scoring Logic
  const profile_score = profile_completeness_pct;

  let posting_score = 0;
  if (posts_per_week >= 7) posting_score = 100;
  else if (posts_per_week >= 3) posting_score = 70;
  else if (posts_per_week >= 1) posting_score = 40;

  const engagement_score = Math.min(100, (avg_engagement / 500) * 100);

  let responsiveness_score = 0;
  if (avg_response_hours < 1) responsiveness_score = 100;
  else if (avg_response_hours < 6) responsiveness_score = 80;
  else if (avg_response_hours < 24) responsiveness_score = 60;
  else if (avg_response_hours < 48) responsiveness_score = 30;

  const platform_score = Math.min(100, active_platforms * 20);

  const total_ldvs = (profile_score * 0.20) + (posting_score * 0.20) + (engagement_score * 0.25) + (responsiveness_score * 0.20) + (platform_score * 0.15);

  try {
    db.prepare('INSERT INTO activity_logs (sme_id, posts_per_week, avg_response_hours, avg_engagement, profile_completeness_pct) VALUES (?, ?, ?, ?, ?)')
      .run(sme_id, posts_per_week, avg_response_hours, avg_engagement, profile_completeness_pct);

    db.prepare('INSERT INTO ldvs_scores (sme_id, profile_score, posting_score, engagement_score, responsiveness_score, platform_score, total_ldvs) VALUES (?, ?, ?, ?, ?, ?, ?)')
      .run(sme_id, profile_score, posting_score, engagement_score, responsiveness_score, platform_score, total_ldvs);

    res.json({ profile_score, posting_score, engagement_score, responsiveness_score, platform_score, total_ldvs });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getHistory = (req, res) => {
  try {
    const history = db.prepare('SELECT * FROM ldvs_scores WHERE sme_id = ? ORDER BY computed_at ASC').all(req.params.sme_id);
    res.json(history);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
