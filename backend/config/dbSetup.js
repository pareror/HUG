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
      disabilita INTEGER CHECK(disabilita IN (0, 1)) DEFAULT 0,
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

// 🔹 **Tabella per i contatti di emergenza**
const createEmergencyContactsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS emergency_contacts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT NOT NULL,
      cognome TEXT NOT NULL,
      telefono TEXT NOT NULL,
      relazione TEXT NOT NULL
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'emergency_contacts':", err.message);
      } else {
        console.log("✅ Tabella 'emergency_contacts' creata con successo.");
      }
    }
  );
};

// 🔹 **Tabella di associazione tra pazienti e contatti di emergenza**
const createPatientEmergencyContactsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS patient_emergency_contacts (
      patientId INTEGER,
      contactId INTEGER,
      PRIMARY KEY (patientId, contactId),
      FOREIGN KEY (patientId) REFERENCES profiles(id) ON DELETE CASCADE,
      FOREIGN KEY (contactId) REFERENCES emergency_contacts(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'patient_emergency_contacts':", err.message);
      } else {
        console.log("✅ Tabella 'patient_emergency_contacts' creata con successo.");
      }
    }
  );
};

const createInternalActivitiesTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS internal_activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titolo TEXT NOT NULL,
      descrizione TEXT,
      datainizio DATE NOT NULL,
      orainizio TEXT NOT NULL,
      durata INTEGER, -- Durata in minuti
      scadenzaIscrizioni DATE,
      numeroMinimoPartecipanti INTEGER,
      numeroMassimoPartecipanti INTEGER,
      luogo TEXT,
      istruttore TEXT,
      immagine TEXT, -- Path dell'immagine (es. /uploads/activity.jpg)
      
      createdBy INTEGER, -- Chiave esterna verso la tabella 'profiles'
      FOREIGN KEY (createdBy) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'internal_activities':", err.message);
      } else {
        console.log("✅ Tabella 'internal_activities' creata con successo.");
      }
    }
  );
};

const createActivityParticipantsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activity_participants (
      activityId INTEGER NOT NULL,  -- ID dell'attività
      patientId INTEGER NOT NULL,   -- ID del paziente

      -- Chiave primaria composta per evitare duplicati
      PRIMARY KEY (activityId, patientId),

      -- Chiave esterna verso la tabella 'internal_activities'
      FOREIGN KEY (activityId) REFERENCES internal_activities(id) ON DELETE CASCADE,

      -- Chiave esterna verso la tabella 'profiles'
      FOREIGN KEY (patientId) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'activity_participants':", err.message);
      } else {
        console.log("✅ Tabella 'activity_participants' creata con successo.");
      }
    }
  );
};
// Funzione principale per inizializzare il database
const initializeDatabase = () => {
  console.log("🔄 Inizializzazione del database...");
  createProfilesTable();
  createEmergencyContactsTable();
  createPatientEmergencyContactsTable();
  createInternalActivitiesTable();
  createActivityParticipantsTable();
};

initializeDatabase();

module.exports = { initializeDatabase };
