import { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

function DateTimeSection({ date, time, duration, deadline, onChange }) {
  const [error, setError] = useState("");

  useEffect(() => {
    validateDates(date, deadline);
  }, [date, deadline]);

  const isDateInPast = (dateToCheck) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return new Date(dateToCheck) < today;
  };

  const validateDates = (activityDate, deadlineDate) => {
    if (activityDate) {
      if (isDateInPast(activityDate)) {
        setError("La data dell'attività non può essere nel passato.");
        return;
      }

      if (deadlineDate && new Date(activityDate) <= new Date(deadlineDate)) {
        setError("La data dell'attività deve essere successiva alla data di scadenza delle iscrizioni.");
        return;
      }
    }
    setError("");
  };

  const handleChange = (field, value) => {
    onChange(field, value);
    if (field === "date" || field === "deadline") {
      validateDates(field === "date" ? value : date, field === "deadline" ? value : deadline);
    }
  };

  return (
    <div className="create-activity-form-row date-time-section">
      <div className="create-activity-form-group">
        <label htmlFor="date">Data</label>
        <div className="create-activity-input-icon-wrapper">
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => handleChange("date", e.target.value)}
            className="date-input"
            aria-invalid={error ? "true" : "false"}
            required
          />
          <Calendar className="create-activity-input-icon" />
        </div>
      </div>

      <div className="create-activity-form-group">
        <label htmlFor="time">Ora</label>
        <div className="create-activity-input-icon-wrapper">
          <input
            type="time"
            id="time"
            value={time}
            onChange={(e) => handleChange("time", e.target.value)}
            className="time-input"
            required
          />
          <Clock className="create-activity-input-icon" />
        </div>
      </div>

      <div className="create-activity-form-group">
        <label htmlFor="duration">Durata (ore)</label>
        <input
          type="number"
          id="duration"
          min="0"
          value={duration}
          onChange={(e) => handleChange("duration", e.target.value)}
          className="create-activity-duration-input"
          required
        />
      </div>

      <div className="create-activity-form-group">
        <label htmlFor="deadline">Scadenza iscrizioni</label>
        <div className="create-activity-input-icon-wrapper">
          <input
            type="date"
            id="deadline"
            value={deadline}
            onChange={(e) => handleChange("deadline", e.target.value)}
            className="date-input"
            aria-invalid={error ? "true" : "false"}
            required
          />
          <Calendar className="create-activity-input-icon" />
        </div>
      </div>

      {error && (
        <div className="create-activity-error-message" role="alert">
          {error}
        </div>
      )}
    </div>
  );
}

export default DateTimeSection;

