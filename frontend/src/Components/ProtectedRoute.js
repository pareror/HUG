import React from 'react';
import { Navigate } from 'react-router-dom';
// Se usi la v4 di jwt-decode:
import { jwtDecode } from 'jwt-decode';
// Se usi v2/v3, sostituisci con:
// import jwtDecode from 'jwt-decode';

function ProtectedRoute({ children, requiredPermission }) {
  // 1. Recupera il token da localStorage (o altrove, se hai scelto un'altra chiave)
  const token = localStorage.getItem("jwt");

  // 2. Se non esiste token => reindirizza a /login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    // 3. Decodifica il token
    const decoded = jwtDecode(token);
    // Esempio di shape: { id, username, permissionLevel, iat, exp }

    // 4. Controlla se è scaduto
    const now = Date.now() / 1000;
    if (decoded.exp && decoded.exp < now) {
      // Token scaduto => reindirizza
      return <Navigate to="/login" replace />;
    }

    // 5. Gestione array o singolo valore per i permessi
    let allowedPermissions = [];
    // Se requiredPermission è un array, lo usiamo direttamente
    if (Array.isArray(requiredPermission)) {
      allowedPermissions = requiredPermission;
    } else {
      // Se è un singolo numero, lo trasformiamo in array
      allowedPermissions = [requiredPermission];
    }

    // 6. Controlla se permissionLevel del token è in allowedPermissions
    if (!allowedPermissions.includes(decoded.permissionLevel)) {
      // Permessi insufficienti => redirect a /login o /403
      return <Navigate to="/login" replace />;
    }

    // 7. Se tutti i controlli superati, mostriamo i children
    return children; 
  } catch (error) {
    // Se la decodifica fallisce => token malformato => reindirizza
    console.error("Errore decodifica token:", error);
    return <Navigate to="/login" replace />;
  }
}

export default ProtectedRoute;
