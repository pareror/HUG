import { useState } from "react"

function InstructorSection({ instructor, image, onChange }) {
  const [imagePreview, setImagePreview] = useState(null)

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onChange("image", file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <div className="form-row">
      <div className="form-group">
        <label htmlFor="instructor">Istruttore</label>
        <input
          type="text"
          id="instructor"
          value={instructor}
          onChange={(e) => onChange("instructor", e.target.value)}
        />
      </div>

      <div className="form-group image-upload-group">
        <label>Immagine attuale</label>
        <div className="image-upload-container">
          <input type="file" id="image" accept="image/*" onChange={handleImageChange} className="file-input" />
          <button type="button" className="file-select-button">
            Scegli file
          </button>
          <div className="image-preview">
            {imagePreview ? (
              <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
            ) : (
              <div className="image-placeholder"></div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection

