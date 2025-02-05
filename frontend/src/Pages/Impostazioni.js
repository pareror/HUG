import React from 'react';
import '../css/Impostazioni.css';
import NavbarDashboard from "../Components/NavbarDashboard"
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import ImpostazioniTab from '../Components/ImpostazioniTab';

const Impostazioni = () => {

        const navigate = useNavigate(); //Inizializza navigate
    
    return (
        <div className='impostazioni'>
            <NavbarDashboard />
            <div className='impostazioni-content'>
                <div className='impostazioni-header'>
                     {/* Bottone per tornare indietro */}
                    <button onClick={() => navigate(-1)} className="back-link">
                        <ArrowLeft className="back-icon" />
                        <span className="back-text">Torna indietro</span>
                    </button>
                </div>

                <ImpostazioniTab />              
            </div>   
        </div>
    );
};

export default Impostazioni;