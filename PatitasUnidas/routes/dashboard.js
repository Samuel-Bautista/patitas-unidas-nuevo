import express from 'express';
import { pool } from '../config/db.js';
const router = express.Router();

router.get('/animales', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM animal');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.post('/animales', async (req, res) => {
    try {
        const { nombre, especie, raza, edad, descripcion, foto_url } = req.body;
        const sql = 'INSERT INTO animal (nombre, especie, raza, edad, descripcion, foto_url) VALUES (?, ?, ?, ?, ?, ?)';
        await pool.query(sql, [nombre, especie, raza, edad, descripcion, foto_url]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/animales/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const [rows] = await pool.query(
            'SELECT * FROM animal WHERE id = ?',
            [id]
        );

        if (rows.length === 0) {
            return res.status(404).json({ error: 'Animal no encontrado' });
        }

        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el animal' });
    }
});



router.get('/publicaciones', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT 
                p.id_publicacion,
                p.titulo,
                p.contenido,
                p.imagen_url,
                p.fecha_publicacion,
                a.id_animal,
                a.link_formulario AS link_adopcion,
                e.fecha_fin,
                e.link_formulario AS link_evento,
                CASE
                    WHEN a.id_adopcion IS NOT NULL THEN 'adopcion'
                    WHEN e.id_evento IS NOT NULL THEN 'evento'
                    ELSE 'general'
                END AS tipo
            FROM publicacion p
            LEFT JOIN publicacion_adopcion a ON p.id_publicacion = a.id_publicacion
            LEFT JOIN publicacion_evento e ON p.id_publicacion = e.id_publicacion
            ORDER BY p.fecha_publicacion DESC
        `);

        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.post('/publicaciones', async (req, res) => {
    try {
        const data = req.body;

        let titulo = data.titulo || null;
        let contenido = data.contenido || null;
        let imagen_url = data.imagen_url || null;

        if (data.tipo === 'adopcion') {
            if (!data.id_animal || !data.link_formulario) {
                return res.status(400).json({ error: 'Debe proporcionar un ID de animal y un link de formulario.' });
            }

            const [rows] = await pool.query('SELECT * FROM animal WHERE id = ?', [data.id_animal]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Animal no encontrado.' });
            }
            const animal = rows[0];
            if (animal.estado !== 'disponible') {
                return res.status(400).json({ error: 'El animal debe estar en estado disponible.' });
            }

            titulo = animal.nombre;
            contenido = animal.descripcion;
            imagen_url = animal.foto_url;
        }

        const [result] = await pool.query(
            'INSERT INTO publicacion (id_admin, titulo, contenido, imagen_url) VALUES (?, ?, ?, ?)',
            [2, titulo, contenido, imagen_url]
        );

        const id_publicacion = result.insertId;

        if (data.tipo === 'adopcion') {
            await pool.query(
                'INSERT INTO publicacion_adopcion (id_publicacion, id_animal, link_formulario) VALUES (?, ?, ?)',
                [id_publicacion, data.id_animal, data.link_formulario]
            );
        } else if (data.tipo === 'evento') {
            await pool.query(
                'INSERT INTO publicacion_evento (id_publicacion, fecha_fin, link_formulario) VALUES (?, ?, ?)',
                [id_publicacion, data.fecha_fin || null, data.link_formulario || null]
            );
        }

        res.json({ ok: true, id_publicacion });

    } catch (err) {
        console.error('Error al crear publicación:', err);
        res.status(500).json({ error: 'Error al crear publicación' });
    }
});




router.put('/animales/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, especie, raza, edad, descripcion, foto_url, estado, adoptante_id } = req.body;
        const sql = `
            UPDATE animal
            SET nombre = ?, especie = ?, raza = ?, edad = ?, descripcion = ?, foto_url = ?, estado = ?, adoptante_id = ?
            WHERE id = ?
        `;
        await pool.query(sql, [nombre, especie, raza, edad, descripcion, foto_url, estado, adoptante_id || null, id]);
        res.sendStatus(200);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.put('/publicaciones/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, contenido, imagen_url, fecha_fin, link_formulario, id_animal, tipo } = req.body;

        await pool.query(
            'UPDATE publicacion SET titulo = ?, contenido = ?, imagen_url = ? WHERE id_publicacion = ?',
            [titulo, contenido, imagen_url, id]
        );

        if (tipo === 'adopcion') {
            await pool.query(
                'UPDATE publicacion_adopcion SET id_animal = ?, link_formulario = ? WHERE id_publicacion = ?',
                [id_animal, link_formulario, id]
            );
        } else if (tipo === 'evento') {
            await pool.query(
                'UPDATE publicacion_evento SET fecha_fin = ?, link_formulario = ? WHERE id_publicacion = ?',
                [fecha_fin, link_formulario, id]
            );
        }

        res.sendStatus(200);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message });
    }
});

router.delete('/animales/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM animal WHERE id = ?', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar el animal');
    }
});

router.delete('/publicaciones/:id', async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM publicacion WHERE id_publicacion = ?', [id]);
        res.sendStatus(200);
    } catch (err) {
        console.error(err);
        res.status(500).send('Error al eliminar la publicación');
    }
});

router.get('/', async (req, res) => {
    const [animales] = await pool.query('SELECT * FROM animal');
    const [publicaciones] = await pool.query('SELECT * FROM publicacion');
    res.render('dashboard', { animales, publicaciones });
});

export default router;
