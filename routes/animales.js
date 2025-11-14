import express from 'express';
import { pool } from '../config/db.js';
const router = express.Router();

router.get('/', async (req, res) => {
    const [animales] = await pool.query('SELECT * FROM animal');
    res.render('animales/listar', { animales });
});

router.get('/crear', (req, res) => {
    res.render('animales/crear');
});


router.post('/crear', async (req, res) => {
    const { nombre, especie, raza, edad, descripcion, foto_url } = req.body;
    await pool.query(
        'INSERT INTO animal (nombre, especie, raza, edad, descripcion, foto_url) VALUES (?, ?, ?, ?, ?, ?)',
        [nombre, especie, raza, edad, descripcion, foto_url]
    );
    res.redirect('/animales');
});

router.get('/editar/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM animal WHERE id_animal = ?', [req.params.id]);
    res.render('animales/crear', { animal: rows[0] });
});

router.post('/editar/:id', async (req, res) => {
    const { nombre, especie, raza, edad, descripcion, foto_url } = req.body;
    await pool.query(
        'UPDATE animal SET nombre=?, especie=?, raza=?, edad=?, descripcion=?, foto_url=? WHERE id_animal=?',
        [nombre, especie, raza, edad, descripcion, foto_url, req.params.id]
    );
    res.redirect('/animales');
});

router.get('/eliminar/:id', async (req, res) => {
    await pool.query('DELETE FROM animal WHERE id_animal=?', [req.params.id]);
    res.redirect('/animales');
});

export default router;