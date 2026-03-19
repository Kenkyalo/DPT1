// seed.js
import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database('dpt.db');

const schema = fs.readFileSync(path.join(__dirname, 'schema.sql'), 'utf8');
db.exec(schema);

const seedSMEs = [
  { name: "Mama Njeri's Kitchen", owner_name: "Njeri Kamau", category: "Food & Beverage", location: "Nairobi" },
  { name: "Nairobi Tech Hub", owner_name: "John Doe", category: "Technology Services", location: "Nairobi" },
  { name: "Kisumu Fashion House", owner_name: "Achieng Otieno", category: "Retail/Fashion", location: "Kisumu" }
];

const insertSME = db.prepare('INSERT INTO smes (name, owner_name, category, location) VALUES (?, ?, ?, ?)');

seedSMEs.forEach(sme => {
  const result = insertSME.run(sme.name, sme.owner_name, sme.category, sme.location);
  const smeId = result.lastInsertRowid;

  // Seed platforms
  const insertPlatform = db.prepare('INSERT INTO platforms (sme_id, platform_name, is_active, connected_at) VALUES (?, ?, ?, ?)');
  ['Facebook', 'Instagram', 'WhatsApp Business', 'Google My Business', 'Website'].forEach(p => {
    insertPlatform.run(smeId, p, 1, new Date().toISOString());
  });

  // Seed activity logs
  const insertLog = db.prepare('INSERT INTO activity_logs (sme_id, platform, posts_per_week, avg_response_hours, avg_engagement, profile_completeness_pct) VALUES (?, ?, ?, ?, ?, ?)');
  insertLog.run(smeId, 'Aggregated', 5, 2, 150, 85);

  // Seed LDVS scores
  const insertScore = db.prepare('INSERT INTO ldvs_scores (sme_id, profile_score, posting_score, engagement_score, responsiveness_score, platform_score, total_ldvs) VALUES (?, ?, ?, ?, ?, ?, ?)');
  
  // Mock calculation for seed
  const profile_score = 85;
  const posting_score = 70; // 5 posts/week
  const engagement_score = (150 / 500) * 100; // 30
  const responsiveness_score = 80; // 2 hours
  const platform_score = 100; // 5 platforms
  const total_ldvs = (profile_score * 0.20) + (posting_score * 0.20) + (engagement_score * 0.25) + (responsiveness_score * 0.20) + (platform_score * 0.15);
  
  insertScore.run(smeId, profile_score, posting_score, engagement_score, responsiveness_score, platform_score, total_ldvs);

  // Seed recommendations
  const insertRec = db.prepare('INSERT INTO recommendations (sme_id, recommendation_text) VALUES (?, ?)');
  insertRec.run(smeId, "1. Post more consistently on Instagram to boost engagement. 2. Update your business hours on Google My Business. 3. Respond to WhatsApp messages within 1 hour.");
});

console.log('Database seeded successfully!');
db.close();
