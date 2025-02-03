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
    // Funzione per creare la tabella delle disabilità
    const createDisabilitiesTable = () => {
        db.run(
            `CREATE TABLE IF NOT EXISTS disabilities (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                disabilitaFisiche INTEGER CHECK(disabilitaFisiche BETWEEN 0 AND 5) DEFAULT 0,
                disabilitaSensoriali INTEGER CHECK(disabilitaSensoriali BETWEEN 0 AND 5) DEFAULT 0,
                disabilitaPsichiche INTEGER CHECK(disabilitaPsichiche BETWEEN 0 AND 5) DEFAULT 0,
                assistenzaContinuativa INTEGER CHECK(assistenzaContinuativa BETWEEN 0 AND 1) DEFAULT 0
            )`,
            (err) => {
                if (err) {
                    console.error("❌ Errore nella creazione della tabella 'disabilities':", err.message);
                } else {
                    console.log("✅ Tabella 'disabilities' creata con successo.");
                }
            }
        );
    };
  // Funzione per creare la tabella pazienti con riferimento alla tabella disabilità
    const createPatientsTable = () => {
        db.run(
            `CREATE TABLE IF NOT EXISTS patients (
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              nome TEXT NOT NULL,
              cognome TEXT NOT NULL,
              email TEXT UNIQUE NOT NULL,
              dataNascita DATE NOT NULL,
              comuneResidenza TEXT NOT NULL,
              indirizzoResidenza TEXT NOT NULL,
              codiceFiscale TEXT UNIQUE NOT NULL,
              username TEXT UNIQUE NOT NULL,
              password TEXT NOT NULL,
              genere TEXT CHECK(genere IN ('M', 'F', 'Altro')) NOT NULL,
              telefono TEXT NOT NULL,
              centroDiurnoId INTEGER NOT NULL,
              fotoProfilo TEXT DEFAULT NULL,
              disabilityId INTEGER DEFAULT NULL,
              FOREIGN KEY (centroDiurnoId) REFERENCES users(id) ON DELETE CASCADE,
              FOREIGN KEY (disabilityId) REFERENCES disabilities(id) ON DELETE SET NULL
            )`,
            (err) => {
                if (err) {
                    console.error("❌ Errore nella creazione della tabella 'patients':", err.message);
                } else {
                    console.log("✅ Tabella 'patients' creata con successo e collegata ai centri diurni e disabilità.");
                }
            }
        );
    };
    

// Funzione principale per inizializzare il database
const initializeDatabase = () => {
    console.log("🔄 Inizializzazione del database...");
    createUsersTable();
    createDisabilitiesTable();
    createPatientsTable();
    
};

// Esegui l'inizializzazione del database
initializeDatabase();

module.exports = { initializeDatabase };
