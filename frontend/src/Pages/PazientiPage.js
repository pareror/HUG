import React from 'react';
import NavbarPazienti from  '../Components/NavbarPazienti'
import '../css/PazientiPage.css'

const PazientiPage = () => {
    return (
        <div className='pazienti-container'>
            <NavbarPazienti />
            <h1>Pazienti Page</h1>
        </div>
    );
};

export default PazientiPage;