function FormActions({ onCancel }) {
    return (
      <div className="form-actions">
        <button type="submit" className="create-activity-submit-button">
          Salva
        </button>
        <button type="button" className="create-activity-cancel-button" onClick={onCancel}>
          Annulla
        </button>
      </div>
    )
  }
  
  export default FormActions
  
  