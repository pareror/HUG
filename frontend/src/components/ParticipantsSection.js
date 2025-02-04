function ParticipantsSection({ minParticipants, maxParticipants, location, onChange }) {
    return (
      <div className="form-row">
        <div className="form-group">
          <label htmlFor="minParticipants">Numero minimo partecipanti</label>
          <input
            type="number"
            id="minParticipants"
            min="0"
            value={minParticipants}
            onChange={(e) => onChange("minParticipants", e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="maxParticipants">Numero massimo partecipanti</label>
          <input
            type="number"
            id="maxParticipants"
            min="0"
            value={maxParticipants}
            onChange={(e) => onChange("maxParticipants", e.target.value)}
          />
        </div>
  
        <div className="form-group">
          <label htmlFor="location">Luogo</label>
          <input type="text" id="location" value={location} onChange={(e) => onChange("location", e.target.value)} />
        </div>
      </div>
    )
  }
  
  export default ParticipantsSection
  
  