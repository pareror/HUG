import React from "react";
import {jwtDecode} from "jwt-decode";
import ProtectedRoute from "../Components/ProtectedRoute";
import DashboardPazienti from "./Pazienti/PazientiPage";
// import DashboardCaregiver from "./DashboardCaregiver";
// import DashboardTouroperator from "./DashboardTouroperator";
// import DashboardEnteEsterno from "./DashboardEnteEsterno";
import DashboardDirettoreCentro from "./Dashboard"; // usata come dashboard per direttore centro
import Dashboard from "./Dashboard"; // fallback generico

// Mapping dei ruoli
const ROLE_PERMISSIONS = {
  paziente: 1,
  caregiver: 2,
  touroperator: 3,
  entiesterno: 4,
  direttorecentro: 5,
};

// Mapping dei ruoli ai componenti dashboard
const dashboardComponents = {
  paziente: DashboardPazienti,
  // caregiver: DashboardCaregiver,
  // touroperator: DashboardTouroperator,
  // entiesterno: DashboardEnteEsterno,
  direttorecentro: DashboardDirettoreCentro,
};

const DashboardRouter = () => {
  const token = localStorage.getItem("jwt");
  let role = null;
  if (token) {
    try {
      const decoded = jwtDecode(token);
      role = decoded.role; // il token deve contenere la proprietà "role"
    } catch (error) {
      console.error("Errore nella decodifica del token:", error);
    }
  }

  // Scegliamo il componente in base al ruolo oppure usiamo il fallback
  const Component = dashboardComponents[role] || Dashboard;

  // Se il ruolo è "paziente", richiediamo il permesso 1, altrimenti usiamo il mapping
  const requiredPermission =
    role === "paziente" ? [1] : role ? [ROLE_PERMISSIONS[role]] : [];

  return (
    <ProtectedRoute requiredPermission={requiredPermission}>
      <Component />
    </ProtectedRoute>
  );
};

export default DashboardRouter;
