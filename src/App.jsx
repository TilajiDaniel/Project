import { Routes, Route, NavLink, Navigate } from "react-router-dom"
import { EtelKereses } from "./pages/Etel-kereses"
import { Main } from "./pages/MainPage"
import { Statisztika } from "./pages/Statisztika"
import { Naplo } from "./pages/naplo"
import { Kalorie} from "./pages/Kalorie-kalkulator"
import { AuthProvider, useAuth } from './contexts/AuthContext'
import Login from './components/Login'
import Register from './components/Register'
import { About } from "./pages/About"
import { AddFood } from "./pages/AddFood"
import { EtelkElrendezese } from './pages/Etelek-elrendezese.jsx'; 
import AdminRoute from './components/AdminRoute'
import AdminDashboard from './pages/AdminDashboard'


function ProtectedRoute({ children }) {
  const { token, loading } = useAuth()
  
  if (loading) return <div>Betöltés...</div>
  return token ? children : <Navigate to="/login" />
}

function AppContent() {
  return (
    <div className="App">
      
      <Routes>
        {/* Nyilvános oldalak */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/about" element={<About />} />
        {/* Védett oldalak */}
        <Route 
          path="/MainPage" 
          element={
            <ProtectedRoute>
              <Main />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/etel-kereses" 
          element={
            <ProtectedRoute>
              <EtelKereses />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/statisztika" 
          element={
            <ProtectedRoute>
              <Statisztika />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/naplo" 
          element={
            <ProtectedRoute>
              <Naplo />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/kalorie-kalkulator" 
          element={
            <ProtectedRoute>
              <Kalorie />
            </ProtectedRoute>
          } 
        />
        <Route path="/etel-elrendezese" element={<ProtectedRoute><EtelkElrendezese /></ProtectedRoute>} />
        <Route path="/addfood" element={<ProtectedRoute><AddFood /></ProtectedRoute>} />

        <Route 
          path="/admin" 
          element={
            <ProtectedRoute>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </ProtectedRoute>
          } 
        />
        
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="*" element={<h2>404 - Nincs ilyen oldal!</h2>} />
      </Routes>
    </div>
  )
}

export const App = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
