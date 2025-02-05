import { useState, useEffect } from "react"

function ParticipantsSection({ minParticipants, maxParticipants, location, onChange }) {
  const [error, setError] = useState("")

  useEffect(() => {
    validateParticipants(minParticipants, maxParticipants)
  }, [minParticipants, maxParticipants])

  const validateParticipants = (min, max) => {
    if (min && max && Number.parseInt(min) > Number.parseInt(max)) {
      setError("Il numero minimo di partecipanti deve essere minore o uguale al numero massimo.")
    } else {
      setError("")
    }
  }

  const handleChange = (field, value) => {
    onChange(field, value)
    if (field === "minParticipants" || field === "maxParticipants") {
      validateParticipants(
        field === "minParticipants" ? value : minParticipants,
        field === "maxParticipants" ? value : maxParticipants,
      )
    }
  }

  return (
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="minParticipants">Numero minimo partecipanti</label>
        <input
          type="number"
          id="minParticipants"
          min="0"
          value={minParticipants}
          onChange={(e) => handleChange("minParticipants", e.target.value)}
          aria-invalid={error ? "true" : "false"}
        />
      </div>

      <div className="form-group">
        <label htmlFor="maxParticipants">Numero massimo partecipanti</label>
        <input
          type="number"
          id="maxParticipants"
          min="0"
          value={maxParticipants}
          onChange={(e) => handleChange("maxParticipants", e.target.value)}
          aria-invalid={error ? "true" : "false"}
        />
      </div>

      <div className="form-group">
        <label htmlFor="location">Luogo</label>
        <input type="text" id="location" value={location} onChange={(e) => handleChange("location", e.target.value)} />
      </div>

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  )
}

export default ParticipantsSection

