import React from 'react';
import NavbarDashboard from "../Components/NavbarDashboard"
import PreventivoCard from '../Components/PreventivoCard';

import { ArrowLeft, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import "../css/ConsultaPreventivi.css";

const ConsultaPreventivi = () => {

    const preventivi = [
        {
            id: 1,
            title: "Tour Operator 1",
            date: "22/10/2024",
            amount: "250 €"
        },
        {
            id: 2,
            title: "Tour Operator 2",
            date: "23/10/2024",
            amount: "300 €"
        },
        {
            id: 3,
            title: "Tour Operator 3",
            date: "24/10/2024",
            amount: "350 €"
        },
        {
            id: 4,
            title: "Tour Operator 4",
            date: "22/10/2024",
            amount: "250 €"
        }
    ];

    const navigate = useNavigate(); //Inizializza navigate
    
    return (
        <div className='preventivi'>
            <NavbarDashboard />
            <div className = "main-content">
            <button className="back-button" onClick={() => navigate(-1)}>
                <ArrowLeft size={20} />
                Torna indietro
            </button>

    <div className="container">
      <div className="header">
        <h1>Preventivi per Visita al museo archeologico</h1>
        <p>Qui troverai la lista dei preventivi per attività </p>
      </div>
      <div className="search-containerr">
        <Search className="search-icon" />
        <input type="text" placeholder="Cerca tour operator..." className="search-inputt" />
      </div>

      <div className="preventivi-list">

        {preventivi.map((preventivo) => (
            <PreventivoCard
            id={preventivo.id}
            titolo={preventivo.title}
            data={preventivo.date}
            cifra={preventivo.amount}
            />
        ))}

      </div>
    </div>

          </div>



        </div>
    );
};

export default ConsultaPreventivi;