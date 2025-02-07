import React from 'react';
import "../css/AttivitaIntEst.css"
import AttivitaEsterna from './AttivitaEsterna';

const attivitaEsterne = [
  {
    image: "/images/museo.png",  
    titolo: "Esplorazione archeologica al Museo Egizio",
    descrizione: "Un viaggio nel tempo tra le meraviglie dell'antico Egitto. Scopri sarcofagi, mummie e artefatti unici con una guida esperta.",
    data: "05/01/2025",
    orarioInizio: "10:00",
    orarioFine: "12:00",
    luogo: "Torino",
    part: "8/20",
    minPart: 10,
    istruttore: "Francesca De Luca",
    scadIscData: "04/01/2025",
    scadIscOrario: "09:00",
  },
  {
    image: "/images/gita.png",
    titolo: "Escursione al Parco Nazionale del Gran Paradiso",
    descrizione: "Un'escursione tra i boschi e le vette del Gran Paradiso, con panorami mozzafiato e la possibilità di avvistare animali selvatici.",
    data: "22/01/2025",
    orarioInizio: "07:00",
    orarioFine: "16:00",
    luogo: "Valle d'Aosta",
    part: "3/12",
    minPart: 6,
    istruttore: "Marco Bianco",
    scadIscData: "21/01/2025",
    scadIscOrario: "15:00",
  },
  {
    image: "/images/escursione.png",
    titolo: "Weekend a Venezia: storia e cultura",
    descrizione: "Immergiti nell'atmosfera unica di Venezia con un weekend di visite guidate, passeggiate tra i canali e storie affascinanti della città lagunare.",
    data: "15/02/2025",
    orarioInizio: "10:00",
    orarioFine: "20:00",
    luogo: "Venezia",
    part: "12/15",
    minPart: 8,
    istruttore: "Giulia Moretti",
    scadIscData: "14/02/2025",
    scadIscOrario: "12:00",
  },
];



const AttivitaEsternaTab = () => {
    return (
<div className="activities-grid">           
     {attivitaEsterne.map((activity, index) => (
                <AttivitaEsterna
                    key={index}
                    image={activity.image}
                    titolo={activity.titolo}
                    descrizione={activity.descrizione}
                    data={activity.data}
                    orarioInizio={activity.orarioInizio}
                    orarioFine={activity.orarioFine}
                    luogo={activity.luogo}
                    part={activity.part}
                    minPart={activity.minPart}
                    istruttore={activity.istruttore}
                    scadIscData={activity.scadIscData}
                    scadIscOrario={activity.scadIscOrario}
                />
            ))}
        </div>
    );
};

export default AttivitaEsternaTab;