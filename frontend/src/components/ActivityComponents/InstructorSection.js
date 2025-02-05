import { useState, useRef } from "react"
import { X } from "lucide-react"

function InstructorSection({ instructor, image, onChange }) {
  const [imagePreview, setImagePreview] = useState(null)
  const fileInputRef = useRef(null)

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

  const handleFileButtonClick = () => {
    fileInputRef.current.click()
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    onChange("image", null)
    fileInputRef.current.value = "" // Reset input file
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
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleImageChange}
            style={{ display: "none" }}
            accept="image/*"
          />
          <button type="button" onClick={handleFileButtonClick} className="file-select-button">
            Scegli file
          </button>
          <div className="image-preview-wrapper">
            <div className="image-preview">
              {imagePreview ? (
                <>
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" />
                  <button
                    type="button"
                    className="remove-image-button"
                    onClick={handleRemoveImage}
                    aria-label="Rimuovi immagine"
                  >
                    <X size={16} />
                  </button>
                </>
              ) : (
                <div className="image-placeholder"></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InstructorSection

