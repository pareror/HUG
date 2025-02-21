const db = require('./db'); // Importa la connessione al database
const { aggiungiAttivitaEsterneFittizie, insertFakePreventivi } = require("./fillDb");

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
const createActivitiesTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activities (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL CHECK (tipo IN ('I', 'E')), -- I = Interna, E = Esterna
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
      immagine TEXT,
      costo REAL DEFAULT 0,
      createdBy INTEGER,
      FOREIGN KEY (createdBy) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'activities':", err.message);
      } else {
        console.log("✅ Tabella 'activities' creata con successo.");
      }
    }
  );
};

const createActivityParticipantsTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activity_participants (
      activityId INTEGER NOT NULL,  -- ID dell'attività
      patientId INTEGER NOT NULL,   -- ID del paziente
      saldato INTEGER DEFAULT 0,    -- 1 = sì, 0 = no
      paymentDate TEXT,
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

const createActivityVisibilityTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS activity_visibility (
      activityId INTEGER NOT NULL,  -- ID dell'attività
      centerId INTEGER NOT NULL,    -- ID del centro diurno
      visibile INTEGER DEFAULT 1,   -- 1 = visibile, 0 = nascosto

      -- Chiave primaria composta per evitare duplicati
      PRIMARY KEY (activityId, centerId),

      -- Chiave esterna verso la tabella 'activities'
      FOREIGN KEY (activityId) REFERENCES activities(id) ON DELETE CASCADE,

      -- Chiave esterna verso la tabella 'profiles' (solo centri possono nascondere attività)
      FOREIGN KEY (centerId) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'activity_visibility':", err.message);
      } else {
        console.log("✅ Tabella 'activity_visibility' creata con successo.");
      }
    }
  );
};
const createPreventiviTable = () => {
  db.run(
    `CREATE TABLE IF NOT EXISTS preventivi (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      idAttivita INTEGER NOT NULL,        -- ID dell'attività esterna (collegato alla tabella activities)
      idTouroperator INTEGER NOT NULL,    -- ID del tour operator che ha fatto il preventivo (collegato a profiles)
      dataPreventivo DATE NOT NULL,       -- Data di creazione del preventivo
      durataViaggio INTEGER,              -- Durata del viaggio in giorni
      partecipantiMinimi INTEGER,         -- Numero minimo di partecipanti richiesto
      serviziInclusi TEXT,                -- Descrizione dei servizi inclusi (testo lungo)
      prezzoPerPersona REAL,              -- Prezzo per singolo partecipante
      prezzoTotale REAL,                  -- Prezzo totale
      dettagliTrasporto TEXT,             -- Informazioni sui trasporti
      itinerario TEXT,                    -- Itinerario dettagliato
      note TEXT,                          -- Eventuali note aggiuntive
      luogoPartenza TEXT,                 -- Luogo di partenza
      luogoArrivo TEXT,                   -- Luogo di arrivo
      accettato INTEGER DEFAULT 0,        
      FOREIGN KEY (idAttivita) REFERENCES activities(id) ON DELETE CASCADE,
      FOREIGN KEY (idTouroperator) REFERENCES profiles(id) ON DELETE CASCADE
    )`,
    (err) => {
      if (err) {
        console.error("❌ Errore nella creazione della tabella 'preventivi':", err.message);
      } else {
        console.log("✅ Tabella 'preventivi' creata con successo.");
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
  createActivitiesTable();
  createActivityParticipantsTable();
  createActivityVisibilityTable();
  createPreventiviTable();
};

initializeDatabase();
//aggiungiAttivitaEsterneFittizie();
//insertFakePreventivi();
module.exports = { initializeDatabase };
