import "../css/PopupAnnulla.css"

function PopupAnnulla({ isOpen, onConfirm, onCancel, redirectUrl }) {
  if (!isOpen) return null

  return (
    <div className="cancel-popup-overlay">
      <div className="cancel-popup-content">
        <h2>Conferma annullamento</h2>
        <p>Sei sicuro di voler annullare? Tutte le modifiche non salvate andranno perse.</p>
        <div className="cancel-popup-actions">
          <button onClick={onCancel} className="cancel-popup-button cancel-popup-button-cancel">
            No, continua la modifica
          </button>
          <button onClick={() => onConfirm(redirectUrl)} className="cancel-popup-button cancel-popup-button-confirm">
            Sì, annulla
          </button>
        </div>
      </div>
    </div>
  )
}

export default PopupAnnulla