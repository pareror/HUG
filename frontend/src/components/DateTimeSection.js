import { Calendar, Clock } from "lucide-react"

function DateTimeSection({ date, time, duration, deadline, onChange }) {
  return (
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="date">Data</label>
        <div className="input-icon-wrapper">
          <input type="date" id="date" value={date} onChange={(e) => onChange("date", e.target.value)} />
          <Calendar className="input-icon" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="time">Ora</label>
        <div className="input-icon-wrapper">
          <input type="time" id="time" value={time} onChange={(e) => onChange("time", e.target.value)} />
          <Clock className="input-icon" />
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="duration">Durata (ore)</label>
        <input
          type="number"
          id="duration"
          min="0"
          value={duration}
          onChange={(e) => onChange("duration", e.target.value)}
        />
      </div>

      <div className="form-group">
        <label htmlFor="deadline">Scadenza iscrizioni</label>
        <div className="input-icon-wrapper">
          <input type="date" id="deadline" value={deadline} onChange={(e) => onChange("deadline", e.target.value)} />
          <Calendar className="input-icon" />
        </div>
      </div>
    </div>
  )
}

export default DateTimeSection

