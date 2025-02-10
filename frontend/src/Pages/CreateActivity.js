import { useState } from "react";
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

function CreateActivity() {
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

      await axios.post("http://localhost:5000/api/attivita-interna", formDataToSend, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Attività creata con successo!");
      window.location.href = "/dashboard/attivita/interna";
    } catch (error) {
      console.error("❌ Errore durante la creazione dell'attività:", error);
      alert("Errore durante la creazione dell'attività.");
    }
  };

  const handleCancelClick = () => {
    setIsPopupOpen(true);
  };

  const handleConfirmCancel = (redirectUrl) => {
    window.location.href = redirectUrl;
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
    </div>
  );
}

export default CreateActivity;
