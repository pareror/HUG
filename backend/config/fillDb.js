const db = require('./db'); // Importa la connessione al database

const aggiungiAttivitaEsterneFittizie = () => {
    const attività = [
      // ✅ 3 Attività visibili
      {
        tipo: "E",
        titolo: "Giornata di Trekking sulle Dolomiti",
        descrizione: "Un'avventura mozzafiato tra le cime delle Dolomiti, immersi nella natura.",
        datainizio: "2025-08-12",
        orainizio: "07:30",
        durata: 6,
        scadenzaIscrizioni: "2025-08-05",
        numeroMinimoPartecipanti: 5,
        numeroMassimoPartecipanti: 20,
        luogo: "Dolomiti, Trentino-Alto Adige",
        istruttore: "Luca Bianchi",
        immagine: "http://localhost:5000/uploads/trekking-dolomiti.png",
        createdBy: null
      },
      {
        tipo: "E",
        titolo: "Tour Enogastronomico in Toscana",
        descrizione: "Scopri i sapori autentici della Toscana con degustazioni di vini e prodotti tipici.",
        datainizio: "2025-12-02",
        orainizio: "12:00",
        durata: 4,
        scadenzaIscrizioni: "2025-11-25",
        numeroMinimoPartecipanti: 6,
        numeroMassimoPartecipanti: 18,
        luogo: "Chianti, Toscana",
        istruttore: "Giovanni Verdi",
        immagine: "http://localhost:5000/uploads/tour-toscana.png",
        createdBy: null
      },
      {
        tipo: "E",
        titolo: "Weekend di Relax alle Terme",
        descrizione: "Un fine settimana all'insegna del benessere e del relax nelle migliori terme italiane.",
        datainizio: "2025-11-15",
        orainizio: "10:00",
        durata: 5,
        scadenzaIscrizioni: "2025-11-05",
        numeroMinimoPartecipanti: 8,
        numeroMassimoPartecipanti: 25,
        luogo: "Bagni di Bormio, Lombardia",
        istruttore: "Elena Rossi",
        immagine: "http://localhost:5000/uploads/terme-bormio.png",
        createdBy: null
      },
  
      // 🔴 3 Attività da approvare
      {
        tipo: "E",
        titolo: "Visita guidata ai Castelli della Loira",
        descrizione: "Un viaggio culturale tra i castelli più affascinanti della Loira, in Francia.",
        datainizio: "2025-09-05",
        orainizio: "09:00",
        durata: 8,
        scadenzaIscrizioni: "2025-08-25",
        numeroMinimoPartecipanti: 10,
        numeroMassimoPartecipanti: 30,
        luogo: "Valle della Loira, Francia",
        istruttore: "Sofia Morelli",
        immagine: "http://localhost:5000/uploads/castelli-loira.png",
        createdBy: null
      },
      {
        tipo: "E",
        titolo: "Esperienza di Safari in Africa",
        descrizione: "Un safari nel cuore dell'Africa per ammirare la fauna selvatica nel suo habitat naturale.",
        datainizio: "2025-10-20",
        orainizio: "06:00",
        durata: 10,
        scadenzaIscrizioni: "2025-09-30",
        numeroMinimoPartecipanti: 6,
        numeroMassimoPartecipanti: 15,
        luogo: "Parco Serengeti, Tanzania",
        istruttore: "Marco Ricci",
        immagine: "http://localhost:5000/uploads/safari-africa.png",
        createdBy: null
      },
      {
        tipo: "E",
        titolo: "Corso di Cucina Giapponese",
        descrizione: "Impara a preparare sushi, ramen e altre specialità giapponesi con un vero chef.",
        datainizio: "2026-01-10",
        orainizio: "14:00",
        durata: 3,
        scadenzaIscrizioni: "2026-01-05",
        numeroMinimoPartecipanti: 4,
        numeroMassimoPartecipanti: 12,
        luogo: "Tokyo, Giappone",
        istruttore: "Haruto Tanaka",
        immagine: "http://localhost:5000/uploads/cucina-giapponese.png",
        createdBy: null
      }
    ];
  
    attività.forEach(attività => {
      const sql = `
        INSERT INTO activities 
        (tipo, titolo, descrizione, datainizio, orainizio, durata, scadenzaIscrizioni, numeroMinimoPartecipanti, numeroMassimoPartecipanti, luogo, istruttore, immagine, createdBy)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.run(sql, [
        attività.tipo,
        attività.titolo,
        attività.descrizione,
        attività.datainizio,
        attività.orainizio,
        attività.durata,
        attività.scadenzaIscrizioni,
        attività.numeroMinimoPartecipanti,
        attività.numeroMassimoPartecipanti,
        attività.luogo,
        attività.istruttore,
        attività.immagine,
        attività.createdBy
      ], function (err) {
        if (err) {
          console.error("❌ Errore durante l'inserimento dell'attività:", err.message);
        } else {
          console.log(`✅ Attività "${attività.titolo}" aggiunta con successo.`);
  
          // 🔄 Inseriamo la visibilità (solo per le prime 3)
          if (this.lastID && [1, 2, 3].includes(this.lastID)) {
            db.run(
              `INSERT INTO activity_visibility (activityId, centerId, visibile) VALUES (?, ?, ?)`,
              [this.lastID, 1, 1], // Qui ipotizziamo che il centro 1 le abbia approvate
              (err) => {
                if (err) console.error("❌ Errore nell'impostazione della visibilità:", err.message);
                else console.log(`✅ Attività "${attività.titolo}" approvata per il centro 1.`);
              }
            );
          }
        }
      });
    });
  };
  const insertFakePreventivi = () => {
    const preventivi = [
      {
        idAttivita: 10,
        idTouroperator: 21,
        dataPreventivo: "2025-06-15",
        durataViaggio: 5,
        partecipantiMinimi: 10,
        serviziInclusi: "Alloggio in hotel 4 stelle, pasti inclusi, guida turistica, escursioni guidate",
        prezzoPerPersona: 350.0,
        prezzoTotale: 3500.0,
        dettagliTrasporto: "Pullman privato con Wi-Fi, servizio navetta per escursioni",
        itinerario: "Giorno 1: Arrivo e sistemazione\nGiorno 2: Tour storico\nGiorno 3: Escursione in montagna\nGiorno 4: Relax e attività libere\nGiorno 5: Partenza",
        note: "Possibilità di aggiungere attività extra a richiesta"
      },
      {
        idAttivita: 14,
        idTouroperator: 21,
        dataPreventivo: "2025-07-10",
        durataViaggio: 7,
        partecipantiMinimi: 8,
        serviziInclusi: "Resort 5 stelle, mezza pensione, escursioni guidate, attività sportive incluse",
        prezzoPerPersona: 550.0,
        prezzoTotale: 4400.0,
        dettagliTrasporto: "Volo A/R incluso, transfer privato aeroporto-hotel",
        itinerario: "Giorno 1: Volo e arrivo in resort\nGiorno 2: Attività di benvenuto\nGiorno 3: Tour naturalistico\nGiorno 4: Giornata di sport acquatici\nGiorno 5: Relax\nGiorno 6: Escursione in città\nGiorno 7: Partenza",
        note: "Tariffe speciali per gruppi numerosi (>15 pax)"
      },
      {
        idAttivita: 11,
        idTouroperator: 21,
        dataPreventivo: "2025-08-05",
        durataViaggio: 3,
        partecipantiMinimi: 12,
        serviziInclusi: "Hotel 3 stelle, colazione inclusa, ingressi ai musei, visita guidata della città",
        prezzoPerPersona: 220.0,
        prezzoTotale: 2640.0,
        dettagliTrasporto: "Minivan con autista per tutta la durata del viaggio",
        itinerario: "Giorno 1: Arrivo e visita ai monumenti storici\nGiorno 2: Tour gastronomico\nGiorno 3: Escursione panoramica e partenza",
        note: "Extra disponibili su richiesta: pasti aggiuntivi, tour personalizzati"
      }
    ];
  
    preventivi.forEach((p) => {
      const sql = `
        INSERT INTO preventivi 
        (idAttivita, idTouroperator, dataPreventivo, durataViaggio, partecipantiMinimi, serviziInclusi, prezzoPerPersona, prezzoTotale, dettagliTrasporto, itinerario, note)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;
  
      db.run(
        sql,
        [
          p.idAttivita,
          p.idTouroperator,
          p.dataPreventivo,
          p.durataViaggio,
          p.partecipantiMinimi,
          p.serviziInclusi,
          p.prezzoPerPersona,
          p.prezzoTotale,
          p.dettagliTrasporto,
          p.itinerario,
          p.note
        ],
        function (err) {
          if (err) {
            console.error("❌ Errore durante l'inserimento del preventivo:", err.message);
          } else {
            console.log(`✅ Preventivo per l'attività ${p.idAttivita} aggiunto con successo.`);
          }
        }
      );
    });
  };
  module.exports = {aggiungiAttivitaEsterneFittizie, insertFakePreventivi};