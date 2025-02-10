function DescriptionSection({ value, onChange }) {
    return (
      <div className="create-activity-form-group">
        <label htmlFor="description">Descrizione</label>
        <div className="create-activity-input-counter-wrapper">
          <textarea
            id="description"
            placeholder="Inserisci la descrizione"
            maxLength={500}
            required
            value={value}
            onChange={(e) => onChange(e.target.value)}
          />
          <span className="create-activity-character-counter">{value.length}/500</span>
        </div>
      </div>
    )
  }
  
  export default DescriptionSection
  
  