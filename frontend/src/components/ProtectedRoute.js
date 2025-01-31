import React from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

function ProtectedRoute({ children, requiredPermission }) {
  const token = localStorage.getItem('jwt');
  if (!token) {
    // Niente token => non loggato
    return <Navigate to="/login" replace />;
  }

  try {
    const decoded = jwtDecode(token); 
    // Esempio: decoded = { id, username, permissionLevel, iat, exp }

    // Controllo scadenza
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      // Token scaduto
      return <Navigate to="/login" replace />;
    }
    // Controllo permessi
    if (decoded.permissionLevel != requiredPermission) {
      // Permessi insufficienti => potresti reindirizzare ad una pagina 403
      return <Navigate to="/login" replace />;
    }

    // Tutto ok
    return children; 
  } catch (e) {
    // Decodifica fallita => token malformato => reindirizza
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
