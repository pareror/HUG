import Home from './App'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import CalendarPage from './CalendarPage';
import DayActivitiesPage from './DayActivitiesPage';
const Website = () => {
    return ( 
        <div className="x">

        {/* Rotte per gestire la pagina di login */}
      
        <Routes>
            {/* Rotte pubbliche */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Rotte protette */}
            <Route path="/dashboard" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <Dashboard />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/calendario" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <CalendarPage />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/calendario/day/:day" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <DayActivitiesPage />
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