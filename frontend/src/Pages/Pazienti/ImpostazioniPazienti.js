import React from 'react';
import '../../css/Pazienti/ImpostazioniPazienti.css';
import NavbarPazienti from "../../Components/Pazienti/NavbarPazienti"
import { ArrowLeft } from "lucide-react";
import { useNavigate } from 'react-router-dom';

import ImpostazioniTabPazienti from '../../Components/Pazienti/ImpostazioniTabPazienti';

const ImpostazioniPazienti = () => {

        const navigate = useNavigate(); //Inizializza navigate
    
    return (
        <div className='pazienti-impostazioni'>
            <NavbarPazienti />
            <div className='pazienti-impostazioni-content'>
                <div className='pazienti-impostazioni-header'>
                     {/* Bottone per tornare indietro */}
         {/* Bottone per tornare indietro */}
          <button className="back-button" onClick={() => navigate(-1)}>
              <ArrowLeft size={20} />
              Torna indietro
          </button>
                </div>

                <ImpostazioniTabPazienti />              
            </div>   
        </div>
    );
};

export default ImpostazioniPazienti;