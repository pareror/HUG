import React, { useState } from "react";
import { X } from "lucide-react"; // Se vuoi usare l'icona X di Lucide come nel tuo esempio
import "../css/ChangePassword.css"; // Usa lo stesso CSS o personalizzalo
const GestisciUtenzaModal = ({ onClose }) => {
  // Stato per selezione tipo di utenza
  const [userType, setUserType] = useState("Pazienti"); /*userType – Stato che gestisce quale tipo di utenza è selezionata (“Pazienti” o “Caregiver”)*/

  // Stato per la barra di ricerca
  const [searchTerm, setSearchTerm] = useState(""); /*searchTerm – Stato per la stringa di ricerca*/

  // Stato locale per pazienti (con la proprietà "added" che indica se l’utente è aggiunto o rimosso) 
  //pazienti e caregiver – Esempi di dati (array di oggetti) con proprietà come nome, cognome, matricola, disabilita, added. 
  const [pazienti, setPazienti] = useState([
    { id: 1, nome: "Mario", cognome: "Rossi", matricola: "ABC123", disabilita: true, added: false },
    { id: 2, nome: "Luigi", cognome: "Verdi", matricola: "DEF456", disabilita: false, added: true },
    { id: 3, nome: "Chiara", cognome: "Bianchi", matricola: "GHI789", disabilita: true, added: false },
  ]);

  // Stato locale per caregiver
  const [caregiver, setCaregiver] = useState([
    { id: 101, nome: "Anna", cognome: "Gentile", matricola: "XYZ999", added: false },
    { id: 102, nome: "Roberto", cognome: "Esposito", matricola: "ZXW111", added: true },
  ]);

  /**
   * Funzione per gestire il toggle di "Aggiungi" / "Rimuovi" di un utente.
   * Se added è true, viene settato a false, e viceversa.
   */
  const handleToggleUser = (id) => {
    if (userType === "Pazienti") {
      setPazienti((prev) =>
        prev.map((p) =>
          p.id === id ? { ...p, added: !p.added } : p
        )
      );
    } else {
      setCaregiver((prev) =>
        prev.map((c) =>
          c.id === id ? { ...c, added: !c.added } : c
        )
      );
    }
  };

  /**
   * Filtra la lista di utenti in base al searchTerm.
   * Il filtro viene applicato su nome, cognome e matricola.
   */
  const filteredUsers = (userType === "Pazienti" ? pazienti : caregiver).filter(
    (user) => {
      const fullString = `${user.nome} ${user.cognome} ${user.matricola}`.toLowerCase();
      return fullString.includes(searchTerm.toLowerCase());
    }
  );

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        {/* Bottone di chiusura in alto a destra */}
        <button className="close-button" onClick={onClose}>
          <X />
        </button>

        {/* Titolo del popup */}
        <h2>Gestisci Utenza</h2>

        {/* Sezione per menù a tendina e barra di ricerca */}
        <div className="change-password-form">
          {/* Menu a tendina per selezionare Pazienti o Caregiver */}
          <div className="form-group">
            <label>Tipo di Utenza</label>
            <select
              value={userType}
              onChange={(e) => {
                setUserType(e.target.value);
                setSearchTerm(""); // Reset della ricerca quando cambio tipo di utenza
              }}
            >
              <option value="Pazienti">Pazienti</option>
              <option value="Caregiver">Caregiver</option>
            </select>
          </div>

          {/* Barra di ricerca con placeholder dinamico */}
          <div className="form-group">
            <label>Cerca</label>
            <input
              type="text"
              placeholder={userType === "Pazienti" ? "Cerca Pazienti" : "Cerca Caregiver"}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Elenco dinamico di pazienti o caregiver */}
        <div className="gestisci-utenza-list" /* Aggiunto */>
          {filteredUsers.length === 0 ? (
            <p style={{ textAlign: "center" /* Aggiunto */ }}>Nessun utente trovato</p>
          ) : (
            filteredUsers.map((user) => (
              <div className="gestisci-utenza-list-item" key={user.id} /* Aggiunto */>
                <span>
                  <strong>{user.nome} {user.cognome}</strong> - {user.matricola}
                  {/* Se è un paziente con disabilità, mostra il simbolo */}
                  {userType === "Pazienti" && user.disabilita && (
                    <span style={{ marginLeft: "8px", color: "#00a783" /* Aggiunto */ }}>
                      ♿
                    </span>
                  )}
                </span>
                <button
                    type="button"
                    className={user.added ? "btn-red" : "btn-green"} // Uso condizionale della classe
                    onClick={() => handleToggleUser(user.id)}
                    style={{ maxWidth: "100px", marginLeft: "1rem" /* Aggiunto */ }}
                >
                    {user.added ? "Rimuovi" : "Aggiungi"}
                </button>

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default GestisciUtenzaModal;
