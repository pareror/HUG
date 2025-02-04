const db = require('./db'); // Importa la connessione al database

const createProfilesTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS profiles (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('paziente', 'direttorecentro', 'caregiver', 'touroperator', 'enteesterno')),
      
      -- Campi per il profilo "paziente"
      nome TEXT,
      cognome TEXT,
      email TEXT UNIQUE,
      dataNascita DATE,
      comuneDiResidenza TEXT,
      indirizzoResidenza TEXT,
      codiceFiscale TEXT UNIQUE,
      genere TEXT CHECK(genere IN ('M', 'F', 'Altro')),
      telefono TEXT,
      fotoProfilo TEXT,
      
      -- Se il profilo è di un paziente che opera in un centro (o per indicare il centro di riferimento)
      centroDiurnoId INTEGER,
      
      -- Campi per profili aziendali / enti (usati per direttore, touroperator, enteesterno)
      ragioneSociale TEXT,
      pIva TEXT,
      codiceSdi TEXT,
      indirizzo TEXT,
      emailPec TEXT,
      
      -- Campi per le disabilità (applicabili, per esempio, ai pazienti)
      disabilitaFisiche INTEGER CHECK(disabilitaFisiche BETWEEN 0 AND 5) DEFAULT 0,
      disabilitaSensoriali INTEGER CHECK(disabilitaSensoriali BETWEEN 0 AND 5) DEFAULT 0,
      disabilitaPsichiche INTEGER CHECK(disabilitaPsichiche BETWEEN 0 AND 5) DEFAULT 0,
      assistenzaContinuativa INTEGER CHECK(assistenzaContinuativa BETWEEN 0 AND 1) DEFAULT 0,
      
      FOREIGN KEY (centroDiurnoId) REFERENCES profiles(id) ON DELETE SET NULL
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'profiles':", err.message);
      } else {
        console.log("✅ Tabella 'profiles' creata con successo.");
      }
    }
  );
};

// Funzione principale per inizializzare il database
const initializeDatabase = () => {
  console.log("🔄 Inizializzazione del database...");
  createProfilesTable();
};

initializeDatabase();

module.exports = { initializeDatabase };
