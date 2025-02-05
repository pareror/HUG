import React from "react";
import "../css/PreventiviPage.css";
import Preventivo from "./Preventivo";
import { Search } from "lucide-react"


export default function PreventiviTab() {
    
    const activities = [
        {
          titoloPreventivo: "Visita al museo archeologico",
          data: "27/11/2024",
          numeroPreventivi: 2,
          status: "Preventivo accettato",
        },
        {
          titoloPreventivo: "Gita al lago di Como",
          data: "27/11/2024",
          numeroPreventivi: 2,
          status: "In attesa di accettazione",
        },
        {
          titoloPreventivo: "Tour delle ville Venete",
          data: "27/11/2024",
          numeroPreventivi: 1,
          status: "In attesa di accettazione",
        },
        {
            titoloPreventivo: "Tour delle ville Venete",
            data: "27/11/2024",
            numeroPreventivi: 1,
            status: "In attesa di accettazione",
          },
          {
            titoloPreventivo: "Tour delle ville Venete",
            data: "27/11/2024",
            numeroPreventivi: 1,
            status: "In attesa di accettazione",
          },
          
      ];
    
    return (
        <div className="container">
      <div className="header">
        <h1>Preventivi Attività esterne</h1>
        <p>Qui troverai la lista delle attività esterne e i loro preventivi</p>
      </div>

      <div className="search-containerr">
        <Search className="search-icon" />
        <input type="text" placeholder="Cerca attività..." className="search-inputt" />
      </div>

      <div className="activities-list">
        {activities.map((activity, index) => (
          <Preventivo
            key={index}
            titoloPreventivo={activity.titoloPreventivo}
            data={activity.data}
            numeroPreventivi={activity.numeroPreventivi}
            status={activity.status}
          />
        ))}
      </div>
    </div>
    );
  }
