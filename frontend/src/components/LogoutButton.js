import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/LogoutButton.css";
const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post("http://localhost:5000/api/logout", {}, { withCredentials: true });
    } catch (err) {
      console.error("Errore durante il logout:", err);
    }

    localStorage.removeItem("jwt");
    navigate("/login");
  };

  return (
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  );
};

export default LogoutButton;
