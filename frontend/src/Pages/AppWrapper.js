import Home from './App'
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../Components/ProtectedRoute";
import CalendarPage from './CalendarPage';
import DayActivitiesPage from './DayActivitiesPage';
import PatientsManagement from './PatientsManagement';
import CaregiversManagement from './CaregiversManagement';
import CreatePatient from './CreatePatient';
import AttivitaInterne from './AttivitaInterne';
import AttivitaEsterne from './AttivitaEsterne';
import Notifiche from './Notifiche';
import CreateActivity from './CreateActivity';
import PreventiviPage from './PreventiviPage';
import Impostazioni from './Impostazioni';
import Profilo from './Profilo';
import EditPatient from './EditPatient';
import PagamentiPazienti from './PagamentiPazienti';

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
            <Route path="/dashboard/utenza/pazienti" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <PatientsManagement />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/caregiver" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <CaregiversManagement />
                </ProtectedRoute>
            }
            />

            <Route path="/dashboard/attivita/interna" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <AttivitaInterne />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/attivita/interna/crea" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <CreateActivity />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/attivita/esterna" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <AttivitaEsterne />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/utenza/pazienti/nuovo" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <CreatePatient />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/pazienti/:id/modifica" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <EditPatient />
                </ProtectedRoute>
                 }
            />

            <Route path="/dashboard/notifiche" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <Notifiche />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/preventivi" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <PreventiviPage />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/impostazioni" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <Impostazioni />
                </ProtectedRoute>
                 }
                 />
            <Route path="/dashboard/profilo" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <Profilo />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/pagamenti/paziente" element={
                <ProtectedRoute requiredPermission={[2,3,5]}>
                <PagamentiPazienti />
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