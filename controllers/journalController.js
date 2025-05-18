const db = require('../models/db');

exports.createJournal = async (req, res) => {
  const { description, published_at } = req.body;
  const { filename, mimetype } = req.file || {};
  let student_ids = [];

  try {
    // Parse student_ids from stringified JSON
    if (req.body.student_ids) {
      student_ids = JSON.parse(req.body.student_ids);
      if (!Array.isArray(student_ids)) throw new Error("student_ids must be an array");
    }

    const result = await db.query(
      `INSERT INTO journals (description, attachment_type, attachment_path, published_at, created_by)
       VALUES ($1, $2, $3, $4, $5) RETURNING id`,
      [description, mimetype, filename, published_at, req.user.id]
    );

    const journalId = result.rows[0].id;

    for (let id of student_ids) {
      await db.query(
        `INSERT INTO journal_students (journal_id, student_id) VALUES ($1, $2)`,
        [journalId, id]
      );
    }

    res.status(201).json({ journalId });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateJournal = async (req, res) => {
  const { id } = req.params;
  const { description, published_at } = req.body;

  try {
    await db.query(
      `UPDATE journals SET description=$1, published_at=$2 WHERE id=$3 AND created_by=$4`,
      [description, published_at, id, req.user.id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteJournal = async (req, res) => {
  const { id } = req.params;

  try {
    await db.query(`DELETE FROM journals WHERE id=$1 AND created_by=$2`, [id, req.user.id]);
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.publishJournal = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query(
      `UPDATE journals SET is_published=true WHERE id=$1 AND created_by=$2`,
      [id, req.user.id]
    );
    res.sendStatus(200);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getFeed = async (req, res) => {
  const { role, id } = req.user;
  try {
    if (role === 'teacher') {
      const journals = await db.query(
        `SELECT * FROM journals WHERE created_by = $1`,
        [id]
      );
      res.json(journals.rows);
    } else {
      const journals = await db.query(
        `SELECT j.* FROM journals j
         JOIN journal_students js ON js.journal_id = j.id
         WHERE js.student_id = $1 AND j.is_published = true AND j.published_at <= NOW()`,
        [id]
      );
      res.json(journals.rows);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};