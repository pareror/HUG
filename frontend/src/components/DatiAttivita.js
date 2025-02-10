import React from "react";
import "../css/DettaglioAttivita.css"
import DettaglioAttivita from "./DettaglioAttivita";
import { Key } from "lucide-react";

// Creiamo un oggetto con i dati dell'attività
const attivita = [
     {
      Key: 1,
      title: "Corso di Pittura",
      date: "27 Novembre 2024",
      startTime: "15:00",
      duration: 2,
      location: "Sala arte",
      participants: 10,
      minParticipants: 5,
      maxParticipants: 22,
      instructor: "Maria Rossi",
      registrationDeadline: "24 Nov 2024 h15:00",
      description:
        "Corso di pittura base per principianti. Imparerai le tecniche fondamentali della pittura ad acquerello, esplorando passo dopo passo il magico mondo dei colori e delle sfumature. Sotto la guida esperta di Maria Rossi, ogni lezione ti accompagnerà alla scoperta di come creare opere uniche, partendo dalle basi come la scelta dei pennelli e la preparazione della tela, fino alle tecniche di miscelazione dei colori e alla composizione artistica.",
      image: "/images/pittura.png",
    },
    {
        Key: 2,
        title: "Corso di Teatro",
        date: "31 Novembre 2024",
        startTime: "15:00",
        duration: 2,
        location: "Sala a",
        participants: 10,
        minParticipants: 5,
        maxParticipants: 22,
        instructor: "AAAA Rossi",
        registrationDeadline: "24 Nov 2024 h15:00",
        description:
          "Corso di pittura base per principianti. Imparerai le tecniche fondamentali della pittura ad acquerello, esplorando passo dopo passo il magico mondo dei colori e delle sfumature. Sotto la guida esperta di Maria Rossi, ogni lezione ti accompagnerà alla scoperta di come creare opere uniche, partendo dalle basi come la scelta dei pennelli e la preparazione della tela, fino alle tecniche di miscelazione dei colori e alla composizione artistica.",
        image: "/images/pittura.png",
      },
];
// Componente "genitore"
const DatiAttivita = ({ selectedKey }) => {
    // 1. Filtro o trovo l'elemento con la key che mi interessa
    const activity = attivita.find((item) => item.Key === selectedKey);

    // 2. Se non trovo nulla, gestisco il caso
    if (!activity) {
        return <div>Attività non trovata.</div>;
      }
    
      // 3. Passo la singola attività a DettaglioAttivita
      return <DettaglioAttivita {...activity} />;
    };

           
     


  
  // Esportiamo l'oggetto come default
  export default DatiAttivita
  
  