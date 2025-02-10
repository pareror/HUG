import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../Components/ActivityComponents/Header";
import TitleSection from "../Components/ActivityComponents/TitleSection";
import DescriptionSection from "../Components/ActivityComponents/DescriptionSection";
import DateTimeSection from "../Components/ActivityComponents/DateTimeSection";
import ParticipantsSection from "../Components/ActivityComponents/ParticipantsSection";
import InstructorSection from "../Components/ActivityComponents/InstructorSection";
import FormActions from "../Components/ActivityComponents/FormActions";
import NavbarDashboard from "../Components/NavbarDashboard";
import PopupAnnulla from "../Components/PopupAnnulla";
import "../css/CreateActivity.css";
import "../css/SuccessPopup.css";  // ✅ Import del CSS per il popup di successo
import "../css/ErrorPopup.css";    // ✅ Import del CSS per il popup di errore

function EditActivity() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    duration: "",
    deadline: "",
    minParticipants: "",
    maxParticipants: "",
    location: "",
    instructor: "",
    image: null,
  });

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);  // ✅ Stato per il popup di successo
  const [errorMessage, setErrorMessage] = useState(null);      // ✅ Stato per il popup di errore

  useEffect(() => {
    if (id) {
      const fetchActivity = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/api/attivita-interna/${id}`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            },
          });

          const activity = response.data.activity;

          setFormData({
            title: activity.titolo || "",
            description: activity.descrizione || "",
            date: activity.datainizio || "",
            time: activity.orainizio || "",
            duration: activity.durata || "",
            deadline: activity.scadenzaIscrizioni || "",
            minParticipants: activity.numeroMinimoPartecipanti || "",
            maxParticipants: activity.numeroMassimoPartecipanti || "",
            location: activity.luogo || "",
            instructor: activity.istruttore || "",
            image: activity.immagine || null,
          });
        } catch (error) {
          console.error("❌ Errore durante il recupero dell'attività:", error);
          setErrorMessage("Errore durante il caricamento dell'attività.");
        }
      };

      fetchActivity();
    }
  }, [id]);

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (file) => {
    setFormData((prev) => ({
      ...prev,
      image: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }

      if (id) {
        await axios.put(`http://localhost:5000/api/attivita-interna/${id}`, formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Attività aggiornata con successo!");
      } else {
        await axios.post("http://localhost:5000/api/attivita-interna", formDataToSend, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-Type": "multipart/form-data",
          },
        });
        setSuccessMessage("Attività creata con successo!");
      }

      setTimeout(() => navigate("/dashboard/attivita/interna"), 2000);
    } catch (error) {
      console.error("❌ Errore durante il salvataggio dell'attività:", error);
      setErrorMessage("Errore durante il salvataggio dell'attività.");
    }
  };

  const handleCancelClick = () => {
    setIsPopupOpen(true);
  };

  const handleConfirmCancel = (redirectUrl) => {
    navigate(redirectUrl);
  };

  return (
    <div className="primary-create-activity">
      <NavbarDashboard />
      <Header />

      <form onSubmit={handleSubmit} className="create-activity-form">
        <TitleSection value={formData.title} onChange={(value) => handleInputChange("title", value)} />
        <DescriptionSection value={formData.description} onChange={(value) => handleInputChange("description", value)} />
        <DateTimeSection
          date={formData.date}
          time={formData.time}
          duration={formData.duration}
          deadline={formData.deadline}
          onChange={handleInputChange}
        />
        <ParticipantsSection
          minParticipants={formData.minParticipants}
          maxParticipants={formData.maxParticipants}
          location={formData.location}
          onChange={handleInputChange}
        />
        <InstructorSection instructor={formData.instructor} image={formData.image} onChange={handleInputChange} />

        <FormActions onSubmit={handleSubmit} onCancel={handleCancelClick} />
      </form>

      <PopupAnnulla
        isOpen={isPopupOpen}
        onConfirm={handleConfirmCancel}
        onCancel={() => setIsPopupOpen(false)}
        redirectUrl="/dashboard/attivita/interna"
      />

      {/* ✅ Popup di Successo */}
      {successMessage && (
        <div className="success-popup">
          <div className="success-text">{successMessage}</div>
          <div className="success-bar"></div>
        </div>
      )}

      {/* ✅ Popup di Errore */}
      {errorMessage && (
        <div className="error-popup">
          <div className="error-text">{errorMessage}</div>
          <div className="error-bar"></div>
        </div>
      )}
    </div>
  );
}

export default EditActivity;
