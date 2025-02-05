function FormActions({ onCancel }) {
    return (
      <div className="form-actions">
        <button type="submit" className="submit-button">
          Crea Attività
        </button>
        <button type="button" className="cancel-button" onClick={onCancel}>
          Annulla
        </button>
      </div>
    )
  }
  
  export default FormActions
  
  