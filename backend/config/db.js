const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

// Percorso del database
const DB_DIR = path.join(__dirname, '../data');  // Cartella del database
const DB_PATH = path.join(DB_DIR, 'database.db'); // Percorso del file DB

// Controlla se la directory del database esiste, se no la crea
if (!fs.existsSync(DB_DIR)) {
    fs.mkdirSync(DB_DIR, { recursive: true });
    console.log("📁 Creata cartella 'data/' per il database.");
}

// Connessione al database SQLite
const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error("❌ Errore nella connessione al database:", err.message);
    } else {
        console.log("✅ Database SQLite connesso correttamente.");
    }
});

// Esporta la connessione per usarla in altri file
module.exports = db;
