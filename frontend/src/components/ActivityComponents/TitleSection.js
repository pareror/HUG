function TitleSection({ value, onChange }) {
    return (
      <div className="form-group">
        <label htmlFor="title">Titolo</label>
        <div className="input-counter-wrapper">
          <input
            type="text"
            id="title"
            placeholder="Inserisci il titolo"
            maxLength={100}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="character-counter">{value.length}/100</span>
        </div>
      </div>
    )
  }
  
  export default TitleSection
  
  