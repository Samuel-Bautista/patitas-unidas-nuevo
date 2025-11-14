import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.render('adopcion');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar la página');
  }
});

router.get('/api/adopciones', async (req, res) => {
  try {
    const [animales] = await pool.query(`
      SELECT 
        a.id AS id_animal,
        a.nombre,
        a.raza,
        a.edad,
        a.descripcion,
        a.foto_url,
        pa.link_formulario
      FROM publicacion_adopcion pa
      JOIN animal a ON pa.id_animal = a.id
    `);
    res.json(animales);
  } catch (error) {
    console.error('Error al obtener los animales:', error);
    res.status(500).json({ error: 'Error al obtener los animales' });
  }
});

export default router;
