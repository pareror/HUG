import react from 'react'
import { ArrowLeft } from 'lucide-react'
import NavbarDashboard from '../Components/NavbarDashboard'
import "../css/DettaglioPreventivo.css"

const datiPreventivo = {
  titolo: "Preventivo per Visita al Museo Archeologico",
  
  TourOperator: "Viaggio Serves S.r.l",
  data: "22/12/2024",
  durata: "1 giorno",
  prezzo: 50.0,
  numPartecipanti: 20,
  prezzoTotale: 1000.0,
  dettagliTrasporto: "Pullman GT con aria condizionata, partenza alle ore 7:00 da Piazza Duomo",
  servizi: [
    "• Trasporto in pullman GT",
    "• Servizio guida giornata giornata",
    "• Pranzo in ristorante tipico (bevande incluse)",
    "• Giro in centro città",
    "• Assicurazione medica",
  ],
  itinerario: [
    "7:00 - Partenza da Piazza Duomo",
    "8:00 - Arrivo in città e visita guidata del centro storico",
    "12:30 - Pranzo al ristorante 'La Terrazza sul Lago'",
    "14:30 - Visita al Museo",
    "16:30 - Tempo libero per shopping",
    "18:00 - Partenza per il rientro",
    "21:00 - Arrivo a Palazzo Duomo",
  ],
}

const DettaglioPreventivo = () => {
    return (
        <div className="pre-det-base">
          <NavbarDashboard />
          <div className="pre-det-container">
            <div className="pre-det-content-box">
              <div className="pre-det-header">
                <button className="pre-det-back-button">← Torna indietro</button>
                <h1 className="pre-det-title">Dettagli preventivo</h1>
              </div>
    
              <h2 className="pre-det-subtitle">{datiPreventivo.titolo}</h2>
    
              <div className="pre-det-main-info">
                <div className="pre-det-left-section">
                  <div className="pre-det-row">
                    <div className="pre-det-field">
                      <span className="pre-det-label">Ragione Sociale</span>
                      <span>{datiPreventivo.TourOperator}</span>
                    </div>
                    <div className="pre-det-field">
                      <span className="pre-det-label">Data</span>
                      <span>{datiPreventivo.data}</span>
                    </div>
                  </div>
    
                  <div className="pre-det-row">
                    <div className="pre-det-field">
                      <span className="pre-det-label">Durata</span>
                      <span>{datiPreventivo.durata}</span>
                    </div>
                    <div className="pre-det-field">
                      <span className="pre-det-label">Numero minimo partecipanti</span>
                      <span>{datiPreventivo.numPartecipanti}</span>
                    </div>
                  </div>
                </div>
    
                <div className="pre-det-right-section">
                  <div className="pre-det-servizi">
                    <h3 className="pre-det-label">Servizi inclusi:</h3>
                    <ul>
                      {datiPreventivo.servizi.map((servizio, index) => (
                        <li key={index}>{servizio}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
    
              <div className="pre-det-pricing-row">
                <div className="pre-det-price-item">
                  <span className="pre-det-label">Prezzo per Persona</span>
                  <span className="pre-det-price">€{datiPreventivo.prezzo.toFixed(2)}</span>
                </div>
                <div className="pre-det-price-item">
                  <span className="pre-det-label">N. min. Partecipanti</span>
                  <span className="pre-det-price">{datiPreventivo.numPartecipanti}</span>
                </div>
                <div className="pre-det-price-item">
                  <span className="pre-det-label">Prezzo Totale</span>
                  <span className="pre-det-price">€{datiPreventivo.prezzoTotale.toFixed(2)}</span>
                </div>
              </div>
    
              <div className="pre-det-transport">
                <h3 className="pre-det-label">Dettagli Trasporto:</h3>
                <p>{datiPreventivo.dettagliTrasporto}</p>
              </div>
    
              <div className="pre-det-section">
                <h3 className="pre-det-label">Itinerario:</h3>
                <ul className="pre-det-itinerario">
                  {datiPreventivo.itinerario.map((tappa, index) => (
                    <li key={index}>{tappa}</li>
                  ))}
                </ul>
              </div>
    
              <div className="pre-det-footer">
                <p className="pre-det-nota">Il prezzo include tutti i servizi elencati.</p>
                <button className="pre-det-submit">Accetta preventivo</button>
              </div>
            </div>
          </div>
        </div>
      )
    }

    export default DettaglioPreventivo