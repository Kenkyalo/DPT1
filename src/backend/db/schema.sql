-- schema.sql
CREATE TABLE IF NOT EXISTS smes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  owner_name TEXT,
  category TEXT,
  location TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS platforms (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sme_id INTEGER REFERENCES smes(id),
  platform_name TEXT,
  is_active BOOLEAN DEFAULT 0,
  connected_at DATETIME
);

CREATE TABLE IF NOT EXISTS activity_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sme_id INTEGER REFERENCES smes(id),
  platform TEXT,
  posts_per_week REAL,
  avg_response_hours REAL,
  avg_engagement REAL,
  profile_completeness_pct REAL,
  logged_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS ldvs_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sme_id INTEGER REFERENCES smes(id),
  profile_score REAL,
  posting_score REAL,
  engagement_score REAL,
  responsiveness_score REAL,
  platform_score REAL,
  total_ldvs REAL,
  computed_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS recommendations (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sme_id INTEGER REFERENCES smes(id),
  recommendation_text TEXT,
  language TEXT DEFAULT 'english',
  generated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
