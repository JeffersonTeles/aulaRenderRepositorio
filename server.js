const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

/* =========================
   LISTAR NOTAS
========================= */

app.get('/notes', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM notes ORDER BY id DESC'
        );

        res.json(result.rows);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Erro ao buscar notas'
        });

    }

});

/* =========================
   SALVAR NOTA
========================= */

app.post('/notes', async (req, res) => {

    try {

        const { title, text } = req.body;

        const result = await pool.query(
            'INSERT INTO notes(title, text) VALUES($1, $2) RETURNING *',
            [title, text]
        );

        res.json(result.rows[0]);

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Erro ao salvar nota'
        });

    }

});

/* =========================
   REMOVER NOTA
========================= */

app.delete('/notes/:id', async (req, res) => {

    try {

        const { id } = req.params;

        await pool.query(
            'DELETE FROM notes WHERE id = $1',
            [id]
        );

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Erro ao remover nota'
        });

    }

});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});