import db from '../db/index.js';

export const getAllSMEs = (req, res) => {
  try {
    const smes = db.prepare(`
      SELECT s.*, l.total_ldvs 
      FROM smes s 
      LEFT JOIN ldvs_scores l ON s.id = l.sme_id 
      WHERE l.id = (SELECT MAX(id) FROM ldvs_scores WHERE sme_id = s.id) OR l.id IS NULL
    `).all();
    res.json(smes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSMEById = (req, res) => {
  try {
    const sme = db.prepare('SELECT * FROM smes WHERE id = ?').get(req.params.id);
    if (!sme) return res.status(404).json({ error: 'SME not found' });
    
    const latestScore = db.prepare('SELECT * FROM ldvs_scores WHERE sme_id = ? ORDER BY computed_at DESC LIMIT 1').get(req.params.id);
    const platforms = db.prepare('SELECT * FROM platforms WHERE sme_id = ?').all();
    
    res.json({ ...sme, latestScore, platforms });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createSME = (req, res) => {
  const { name, owner_name, category, location, platforms } = req.body;
  try {
    const info = db.prepare('INSERT INTO smes (name, owner_name, category, location) VALUES (?, ?, ?, ?)').run(name, owner_name, category, location);
    const smeId = info.lastInsertRowid;
    
    if (platforms && Array.isArray(platforms)) {
      const insertPlatform = db.prepare('INSERT INTO platforms (sme_id, platform_name, is_active, connected_at) VALUES (?, ?, ?, ?)');
      platforms.forEach(p => {
        insertPlatform.run(smeId, p.name, p.isActive ? 1 : 0, p.isActive ? new Date().toISOString() : null);
      });
    }
    
    res.status(201).json({ id: smeId });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateSME = (req, res) => {
  const { name, owner_name, category, location } = req.body;
  try {
    db.prepare('UPDATE smes SET name = ?, owner_name = ?, category = ?, location = ? WHERE id = ?')
      .run(name, owner_name, category, location, req.params.id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
