import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";
import AdminPage from "./pages/Admin/AdminPage";
import SiteInchargePage from "./pages/SiteIncharge/SiteInchargePage";

function App() {

  return (
    <>
     <Router>
      <Routes>
        {/* Login */}
        <Route path="/" element={<Login />} />

        {/* Admin */}
        <Route
            path="/admin/:encodedUserId"
            element={
              <ProtectedRoute role="admin">
                <AdminPage />
             </ProtectedRoute>
            }
          />
        {/* Site Incharge */}
          <Route
            path="/site-incharge/:encodedUserId"
            element={
               <ProtectedRoute role="site incharge">
                <SiteInchargePage />
              </ProtectedRoute>
            }
          />

          
      </Routes>

     </Router>
       
    </>
  )
}

export default App
