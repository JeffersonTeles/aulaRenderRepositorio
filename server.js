const express = require('express');
const path = require('path');
const pool = require('./db');

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

/* =========================
   HOME
========================= */

app.get('/', (req, res) => {

    res.sendFile(
        path.join(__dirname, 'public', 'index.html')
    );

});

/* =========================
   LISTAR
========================= */

app.get('/notes', async (req, res) => {

    try {

        const result = await pool.query(
            'SELECT * FROM notes ORDER BY position ASC'
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
   CRIAR
========================= */

app.post('/notes', async (req, res) => {

    try {

        const { title, text } = req.body;

        const maxPosition = await pool.query(
            'SELECT COALESCE(MAX(position), 0) + 1 AS next FROM notes'
        );

        const position = maxPosition.rows[0].next;

        const result = await pool.query(
            `
            INSERT INTO notes(title, text, position)
            VALUES($1, $2, $3)
            RETURNING *
            `,
            [title, text, position]
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
   REMOVER
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

/* =========================
   REORDENAR
========================= */

app.put('/notes/reorder', async (req, res) => {

    try {

        const { items } = req.body;

        for (const item of items) {

            await pool.query(
                `
                UPDATE notes
                SET position = $1
                WHERE id = $2
                `,
                [item.position, item.id]
            );

        }

        res.json({
            success: true
        });

    } catch (err) {

        console.error(err);

        res.status(500).json({
            error: 'Erro ao reordenar'
        });

    }

});

app.listen(PORT, () => {

    console.log(
        `Servidor rodando na porta ${PORT}`
    );

});