import express from "express";
import { pool } from "../config/db.js";
import crypto from "crypto";

const router = express.Router();

router.get("/", (req, res) => {
  res.render("login");
});

router.post("/", async (req, res) => {
  const { usuario, contrasena } = req.body;

  const hashedPassword = crypto.createHash('sha256').update(contrasena).digest('hex');

  try {
    const [rows] = await pool.query(
      "SELECT * FROM administrador WHERE usuario = ? AND contrasena = ?",
      [usuario, hashedPassword]
    );

    if (rows.length > 0) {
      res.json({ success: true });
    } else {
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

export default router;
