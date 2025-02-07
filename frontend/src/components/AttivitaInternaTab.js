import React from 'react';
import "../css/AttivitaIntEst.css"
import AttivitaInterna from './AttivitaInterna';


const attivita = [
    {
      image:"/images/pittura.png",  
      titolo: "Visita al museo archeologico",
      descrizione: "Vivi una fantastica giornatag iornatagiornataggiornatagi ornatagiornatagiornatai ornatagiornatag iornata al museo archeologico di Bari",
      data: "27/11/2024",
      orarioInizio: "16:00",
      orarioFine: "17:00",
      luogo: "Bari",
      part: "10/12",
      minPart: 10,
      istruttore: "Mario Rossi",
      scadIscData: "26/11/2024",
      scadIscOrario: "12:00",
    },
    {
      image:"/images/vecchi.png",
      titolo: "Escursione in montagna",
      descrizione: "Vivi una fantastica giornata al museo archeologico di Bari",
      data: "15/12/2024",
      orarioInizio: "08:00",
      orarioFine: "18:00",
      luogo: "Dolomiti",
      part: "5/10",
      minPart: 5,
      istruttore: "Luca Bianchi",
      scadIscData: "14/12/2024",
      scadIscOrario: "18:00",
    },
    {
        image:"/images/vecchi1.png",
        titolo: "Escursione in montagna",
        descrizione: "Vivi una fantastica giornata al museo archeologico di Bari",
        data: "15/12/2024",
        orarioInizio: "08:00",
        orarioFine: "18:00",
        luogo: "Dolomiti",
        part: "5/10",
        minPart: 5,
        istruttore: "Luca Bianchi",
        scadIscData: "14/12/2024",
        scadIscOrario: "18:00",
      },
  ];

const AttivitaInternaTab = () => {
    return (
<div className="activities-grid">           
     {attivita.map((activity, index) => (
                <AttivitaInterna
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

export default AttivitaInternaTab;