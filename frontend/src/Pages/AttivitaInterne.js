"use client"

import { ArrowLeft, Search, Plus } from "lucide-react"
import "../css/AttivitaInterne.css"

export default function AttivitaInterne() {
  return (
    <div className="attivita-interne">
      {/* Header */}
      <header className="page-header">
        <div className="header-left">
          <button className="back-button">
            <ArrowLeft className="w-5 h-5" />
            <span>Torna indietro</span>
          </button>
          <h1 className="page-title">Attività Interne</h1>
        </div>

        <div className="header-right">
          {/* Search Bar */}
          <div className="search-container">
            <Search className="search-icon" />
            <input type="text" placeholder="Cerca attività..." className="search-input" />
          </div>

          {/* Create Activity Button */}
          <button className="create-button">
            <Plus className="w-5 h-5" />
            Crea Attività
          </button>
        </div>
      </header>

      {/* Subtitle */}
      <p className="page-subtitle">Qui troverai la lista delle attività interne del centro</p>

      {/* Activities Grid - Placeholder */}
      <div className="activities-grid">
        {/* Activity cards will be added here later */}
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
        <div className="activity-card-placeholder" />
      </div>
    </div>
  )
}