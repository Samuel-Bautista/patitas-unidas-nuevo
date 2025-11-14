import express from 'express';
import { pool } from '../config/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
    const [publicaciones] = await pool.query('SELECT * FROM publicacion');
    res.render('publicaciones/listar', { publicaciones });
});

router.get('/crear', async (req, res) => {
    const [animales] = await pool.query('SELECT * FROM animal');
    res.render('publicaciones/crear', { animales });
});

router.post('/crear', async (req, res) => {
    const { id_admin, titulo, contenido, imagen_url, tipo, id_animal, fecha_fin, link_formulario } = req.body;

    const [result] = await pool.query(
        'INSERT INTO publicacion (id_admin, titulo, contenido, imagen_url) VALUES (?, ?, ?, ?)',
        [id_admin, titulo, contenido, imagen_url]
    );

    const id_publicacion = result.insertId;

    if(tipo === 'adopcion') {
        await pool.query(
            'INSERT INTO publicacion_adopcion (id_publicacion, id_animal, link_formulario) VALUES (?, ?, ?)',
            [id_publicacion, id_animal, link_formulario]
        );
    } else if(tipo === 'evento') {
        await pool.query(
            'INSERT INTO publicacion_evento (id_publicacion, fecha_fin, link_formulario) VALUES (?, ?, ?)',
            [id_publicacion, fecha_fin, link_formulario]
        );
    }

    res.redirect('/publicaciones');
});

export default router;
