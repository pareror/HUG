import { useState } from "react"
import Header from "../Components/Header"
import TitleSection from "../Components/TitleSection"
import DescriptionSection from "../Components/DescriptionSection"
import DateTimeSection from "../Components/DateTimeSection"
import ParticipantsSection from "../Components/ParticipantsSection"
import InstructorSection from "../Components/InstructorSection"
import FormActions from "../Components/FormActions"
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

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
    // Aggiungi qui la logica di invio del form
  }

  return (
    <div className="create-activity">
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

        <FormActions onCancel={() => console.log("Cancelled")} />
      </form>
    </div>
  )
}

export default CreateActivity

