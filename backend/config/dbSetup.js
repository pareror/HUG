const db = require('./db'); // Importa la connessione al database

// Funzione per creare la tabella utenti con la colonna "role"
const createUsersTable = () => {
    db.run(
      `CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        username TEXT NOT NULL UNIQUE,
        comuneDiResidenza TEXT NOT NULL,
        tipologia TEXT NOT NULL,
        ragioneSociale TEXT,
        pIva TEXT,
        telefono TEXT,
        codiceSdi TEXT,
        indirizzo TEXT,
        emailPec TEXT,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('paziente', 'direttorecentro', 'caregiver', 'touroperator', 'enteesterno'))
      )`,
      (err) => {
        if (err) {
          console.error("❌ Errore nella creazione della tabella users:", err.message);
        } else {
          console.log("✅ Tabella 'users' pronta con i nuovi campi e ruoli validati.");
        }
      }
    );
  };
  

// Funzione principale per inizializzare il database
const initializeDatabase = () => {
    console.log("🔄 Inizializzazione del database...");
    createUsersTable();
};

// Esegui l'inizializzazione del database
initializeDatabase();

module.exports = { initializeDatabase };
