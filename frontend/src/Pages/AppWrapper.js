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
import PagamentiAttivita from './PagamentiAttivita';
import DettaglioPagamenti from './DettaglioPagamenti';
import PagamentiPaziente from './PagamentiPaziente';
import CreateCaregiver from './CreateCaregiver';
import EditCaregiver from './EditCaregiver';
import PaginaDettaglioAttivita from './PaginaDettaglioAttivita';
import EditActivity from './EditActivity';
import ConsultaPreventivi from './ConsultaPreventivi';
import GestisciAttivita from './GestisciAttivita';
import DettaglioPreventivo from './DettaglioPreventivo';
import DettaglioAttivitaEsterne from '../Components/CartellaAttivitaEsterna/DettaglioAttivitaEsterne';
import PaginaDettaglioAttivitaEsterne from './PaginaDettaglioAttivitaEsterne';
import PazientiPage from './Pazienti/PazientiPage'
import AttivitaInternePazienti from './Pazienti/AttivitaInternePazienti';
import AttivitaEsternePazienti from './Pazienti/AttivitaEsternePazienti';
import PagamentiAttivitaPaziente from './Pazienti/PagamentiAttivitaPaziente';
import ImpostazioniPazienti from './Pazienti/ImpostazioniPazienti';
import NotifichePazienti from './Pazienti/NotifichePazienti';
import ProfiloPazienti from './Pazienti/ProfiloPazienti';
import DashboardRouter from "./DashboardRouter";
import AttivitaIscrittoPazienti from "./Pazienti/AttivitaIscrittoPazienti";
import CalendarioPazienti from "./Pazienti/CalendarioPazienti";
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
                <DashboardRouter />
            }
            />
            <Route path="/dashboard/calendario" element={
                <CalendarPage />
            }
            />
            <Route path="/dashboard/calendario/day/:day/:month/:year" element={
                <ProtectedRoute requiredPermission={[5]}>
                <DayActivitiesPage />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/pazienti" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PatientsManagement />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/caregiver" element={
                <ProtectedRoute requiredPermission={[5]}>
                <CaregiversManagement />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/caregiver/:id/modifica" element={
                <ProtectedRoute requiredPermission={[5]}>
                <EditCaregiver />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/caregiver/nuovo" element={
                <ProtectedRoute requiredPermission={[5]}>
                <CreateCaregiver />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/attivita/interna" element={
                <ProtectedRoute requiredPermission={[5]}>
                <AttivitaInterne />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/attivita/interna/crea" element={
                <ProtectedRoute requiredPermission={[5]}>
                <CreateActivity />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/attivita/esterna" element={
                <ProtectedRoute requiredPermission={[5]}>
                <AttivitaEsterne />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/utenza/pazienti/nuovo" element={
                <ProtectedRoute requiredPermission={[5]}>
                <CreatePatient />
                </ProtectedRoute>
            }
            />
            <Route path="/dashboard/utenza/pazienti/:id/modifica" element={
                <ProtectedRoute requiredPermission={[5]}>
                <EditPatient />
                </ProtectedRoute>
                 }
            />
            

            <Route path="/dashboard/notifiche" element={
                <ProtectedRoute requiredPermission={[5]}>
                <Notifiche />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/preventivi" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PreventiviPage />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/impostazioni" element={
                <ProtectedRoute requiredPermission={[5]}>
                <Impostazioni />
                </ProtectedRoute>
                 }
                 />
            <Route path="/dashboard/profilo" element={
                <ProtectedRoute requiredPermission={[5]}>
                <Profilo />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/pagamenti/paziente" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PagamentiPazienti />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/pagamenti/attivita" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PagamentiAttivita />
                </ProtectedRoute>
                 }
                 />
            
            <Route path="/dashboard/pagamenti/attivita/:activityId" element={
                <ProtectedRoute requiredPermission={[5]}>
                <DettaglioPagamenti />
                </ProtectedRoute>
                 }
                />
            <Route path="/dashboard/pagamenti/paziente/:id" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PagamentiPaziente />
                </ProtectedRoute>
                 }
                 />

            <Route path="/dashboard/attivita/interna/:id" element={
                
                <ProtectedRoute requiredPermission={[5]}>
                <PaginaDettaglioAttivita />
                </ProtectedRoute>
             
                 }
                 />
            <Route path="/dashboard/attivita/interna/:id/modifica" element={
        
                <ProtectedRoute requiredPermission={[5]}>
                <EditActivity />
                </ProtectedRoute>
        
            }
            />

            <Route path="/dashboard/attivita/esterna/preventivi/:id" element={
        
                <ProtectedRoute requiredPermission={[5]}>
                <ConsultaPreventivi />
                </ProtectedRoute>

            }
            />
            <Route path="/dashboard/attivita/esterna/gestisciattivita" element={
                 <ProtectedRoute requiredPermission={[5]}>
                    <GestisciAttivita />
                    </ProtectedRoute>
            }
            />

             <Route path="/dashboard/attivita/esterna/preventivi/:idAttivita/preventivo/:idPreventivo" element={

                  <ProtectedRoute requiredPermission={[5]}>
                    <DettaglioPreventivo />
                </ProtectedRoute>
            }
            />
               
             <Route path="/dashboard/attivita/esterna/:id" element={
                <ProtectedRoute requiredPermission={[5]}>
                <PaginaDettaglioAttivitaEsterne />
                </ProtectedRoute>
                }
             />

{/** PAZIENTI */}
            <Route path="/pazienti" element={
                <ProtectedRoute requiredPermission={[1]}>
                <PazientiPage />
                </ProtectedRoute>
                 }
                 />

            <Route path="/pazienti/attivita/interna" element={
                <ProtectedRoute requiredPermission={[1]}>
                <AttivitaInternePazienti />
                </ProtectedRoute>
                 }
                 />

            <Route path="/pazienti/attivita/esterna" element={
                <ProtectedRoute requiredPermission={[1]}>
                <AttivitaEsternePazienti />
                </ProtectedRoute>
                 }
                 />

            <Route path="/pazienti/pagamenti/attivita" element={
                <ProtectedRoute requiredPermission={[1]}>
                <PagamentiAttivitaPaziente />
                </ProtectedRoute>
                 }
                 />

            <Route path="/pazienti/attivita/iscritto" element={
                <ProtectedRoute requiredPermission={[1]}>
                <AttivitaIscrittoPazienti />
                </ProtectedRoute>
                }       
                />
            <Route path="/pazienti/impostazioni" element={
                <ProtectedRoute requiredPermission={[1]}>
                <ImpostazioniPazienti />
                </ProtectedRoute>
                 }
                 />

            <Route path="/pazienti/notifiche" element={
                <ProtectedRoute requiredPermission={[1]}>
                <NotifichePazienti />
                </ProtectedRoute>
                 }
                 />

                <Route path="/pazienti/profilo" element={
                    <ProtectedRoute requiredPermission={[1]}>
                    <ProfiloPazienti />                 
                    </ProtectedRoute>
                }       
                />  
                <Route path="pazienti/calendario" element={
                    <ProtectedRoute requiredPermission={[1]}>
                    <CalendarioPazienti />                 
                    </ProtectedRoute>
                }       
                /> 
                <Route path="pazienti/calendario/day/:day/:month/:year" element={
                <ProtectedRoute requiredPermission={[1]}>
                <DayActivitiesPage />
                </ProtectedRoute>
            }
            />
               <Route path="/pazienti/attivita/esterna/:id" element={
                <ProtectedRoute requiredPermission={[1]}>
                <PaginaDettaglioAttivitaEsterne />
                </ProtectedRoute>
                }
             />
             <Route path="/pazienti/attivita/interna/:id" element={
                
                <ProtectedRoute requiredPermission={[1]}>
                <PaginaDettaglioAttivita />
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