import express from 'express';
import { pool } from '../config/db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    res.render('voluntariado');
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al cargar la página');
  }
});

router.get('/api/voluntariado', async (req, res) => {
  try {
    const [evento] = await pool.query(`
      SELECT 
        pe.id_evento,
        p.titulo,
        p.contenido,
        p.fecha_publicacion,
        p.imagen_url,
        pe.fecha_fin,
        pe.link_formulario
    FROM publicacion_evento pe
    JOIN publicacion p ON pe.id_publicacion = p.id_publicacion;

    `);
    res.json(evento);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

export default router;
