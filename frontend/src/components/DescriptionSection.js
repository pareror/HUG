function DescriptionSection({ value, onChange }) {
    return (
      <div className="form-group">
        <label htmlFor="description">Descrizione</label>
        <div className="input-counter-wrapper">
          <textarea
            id="description"
            placeholder="Inserisci la descrizione"
            maxLength={500}
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="character-counter">{value.length}/500</span>
        </div>
      </div>
    )
  }
  
  export default DescriptionSection
  
  