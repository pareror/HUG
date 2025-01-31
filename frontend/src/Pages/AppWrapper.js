import Home from './App'
import Login from "./Login";
import Dashboard from "./Dashboard";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
const Website = () => {
    return ( 
        <div className="x">

        {/* Rotte per gestire la pagina di login */}
      
        <Routes>
            {/* Rotte pubbliche */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />

            {/* Rotte protette */}
            <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute requiredPermission={5}>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        </Routes>    
        </div>
     );
}
 
const AppWrapper = () => {
    return ( 
        <Router>
            <Website />
        </Router>
     );
}
 
export default AppWrapper;