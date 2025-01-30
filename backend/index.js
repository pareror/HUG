const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const app = express();

// Middleware per il parsing JSON
app.use(express.json());

// Percorso del database
const DB_PATH = path.join(__dirname, 'data', 'database.db');

// Verifica se la cartella "data" esiste, altrimenti creala
const DATA_DIR = path.dirname(DB_PATH);
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Verifica se il file database esiste, se no lo crea
const dbExists = fs.existsSync(DB_PATH);

// Connessione al database SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Errore nella connessione al database:', err.message);
    } else {
        console.log('Connesso al database SQLite');

        // Se il file database non esisteva, creiamo le tabelle
        if (!dbExists) {
            console.log('Database non trovato, creazione delle tabelle...');
            db.run(`CREATE TABLE IF NOT EXISTS tasks (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                title TEXT NOT NULL,
                completed BOOLEAN NOT NULL DEFAULT 0
            )`, (err) => {
                if (err) {
                    console.error('Errore nella creazione della tabella:', err.message);
                } else {
                    console.log('Tabella "tasks" creata con successo');
                }
            });
        }
    }
});

// Endpoint per ottenere tutti i task
app.get('/api/tasks', (req, res) => {
    db.all('SELECT * FROM tasks', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Endpoint per aggiungere un task
app.post('/api/tasks', (req, res) => {
    const { title, completed } = req.body;
    if (!title) {
        return res.status(400).json({ error: 'Il campo title è obbligatorio' });
    }

    db.run('INSERT INTO tasks (title, completed) VALUES (?, ?)', 
        [title, completed ? 1 : 0], 
        function(err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, title, completed });
        }
    );
});

// Avvio del server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server avviato su http://localhost:${PORT}`));
