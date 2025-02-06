import { useState } from "react"
import Header from "../Components/ActivityComponents/Header"
import TitleSection from "../Components/ActivityComponents/TitleSection"
import DescriptionSection from "../Components/ActivityComponents/DescriptionSection"
import DateTimeSection from "../Components/ActivityComponents/DateTimeSection"
import ParticipantsSection from "../Components/ActivityComponents/ParticipantsSection"
import InstructorSection from "../Components/ActivityComponents/InstructorSection"
import FormActions from "../Components/ActivityComponents/FormActions"
import NavbarDashboard from "../Components/NavbarDashboard"
import PopupAnnulla from "../Components/PopupAnnulla"
import "../css/CreateActivity.css"

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
    })
  
    const [isPopupOpen, setIsPopupOpen] = useState(false)
  
    const handleInputChange = (name, value) => {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  
        //logica dell'invio del form
    const handleSubmit = (e) => {
      e.preventDefault()
      console.log("Form submitted:", formData)
      // Aggiungi qui la logica di invio del form
    }
  
    const handleCancelClick = () => {
      setIsPopupOpen(true)
    }
  
    // Funzione per gestire il redirect dopo la conferma del popup di annullamento
    const handleConfirmCancel = (redirectUrl) => {
      // Implementa qui la logica di reindirizzamento
      console.log("Reindirizzamento a:", redirectUrl)
       window.location.href = redirectUrl; // Decommentare questa riga per il reindirizzamento effettivo
    }
  
    return (
      <div className="primary-create-activity">
        <NavbarDashboard />
        <Header />
  
        <form onSubmit={handleSubmit} className="create-activity-form">
          <TitleSection value={formData.title} onChange={(value) => handleInputChange("title", value)} />
  
          <DescriptionSection
            value={formData.description}
            onChange={(value) => handleInputChange("description", value)}
          />
  
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
          redirectUrl="/dashboard/attivita/interna" // Modifica questa URL in base alla tua struttura di routing
        />      
      </div>
    )       //richiamo del componente con route specificata /dashboard/attivita/interna
  }
  
  export default CreateActivity
  
  