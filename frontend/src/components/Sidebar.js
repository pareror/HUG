// src/Components/Sidebar.js
import React from 'react';
import '../css/Sidebar.css';

/*function Sidebar() {
  return (
    <div className="sidebar-container">
      <h2 className="sidebar-title">KORIAN <br/> CENTRO DIURNO</h2>
      <nav className="sidebar-nav">
        <ul>
          <li>Calendario Attività</li>
          <li>Attività
            <ul>
              <li>Interna</li>
              <li>Esterna</li>
            </ul>
          </li>
          <li>Gestione Utenza
            <ul>
              <li>Pazienti</li>
              <li>Caregiver</li>
            </ul>
          </li>
          <li>Gestione Pagamenti
            <ul>
              <li>Pag. per paziente</li>
              <li>Pag. per attività</li>
            </ul>
          </li>
          <li>Lista Preventivi</li>
        </ul>
      </nav>
    </div>
  );
}


*/
import '../css/Sidebar.css'

 function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2 className="sidebar-title">KORIAN</h2>
        <p className="sidebar-subtitle">CENTRO DIURNO</p>
      </div>
      
      <nav className="sidebar-nav">
        <ul className="nav-list">
          <li className="nav-item">
            <span className="nav-label">CALENDARIO ATTIVITÀ</span>
          </li>
          
          <li className="nav-item">
            <span className="nav-label">ATTIVITÀ</span>
            <ul className="nav-sublist">
              <li><a href="#" className="nav-link">Interna</a></li>
              <li><a href="#" className="nav-link">Esterna</a></li>
            </ul>
          </li>
          
          <li className="nav-item">
            <span className="nav-label">GESTIONE UTENZA</span>
            <ul className="nav-sublist">
              <li><a href="#" className="nav-link">Pazienti</a></li>
              <li><a href="#" className="nav-link">Caregiver</a></li>
            </ul>
          </li>
          
          <li className="nav-item">
            <span className="nav-label">GESTIONE PAGAMENTI</span>
            <ul className="nav-sublist">
              <li><a href="#" className="nav-link">Pag. per paziente</a></li>
              <li><a href="#" className="nav-link">Pag. per attività</a></li>
            </ul>
          </li>
          
          <li className="nav-item">
            <a href="#" className="nav-link">LISTA PREVENTIVI</a>
          </li>
        </ul>
      </nav>
    </aside>
  )
}



export default Sidebar;