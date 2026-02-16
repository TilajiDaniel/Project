import { Routes, Route, NavLink } from "react-router-dom"
import { EtelKereses } from "./pages/Etel-kereses"
import { Main } from "./pages/MainPage"
import './App.css'
// hello
export const App = () => {

  return (
    <>
    <nav className="navbar navbar-expand-sm navbar-light bg-light">
       <div className="container-fluid">
    <NavLink className="navbar-brand" to="/">Men</NavLink>

    {/* Hamburger gomb */}
    <button 
      className="navbar-toggler" 
      type="button" 
      data-bs-toggle="collapse" 
      data-bs-target="#navbarNav" 
      aria-controls="navbarNav" 
      aria-expanded="false" 
      aria-label="Toggle navigation"
    >
      <span className="navbar-toggler-icon"></span>
    </button>
      </div>
    </nav>
      <h1>Termékek - feladat</h1>
      
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/etel-keres" element={<EtelKereses />} />
          <Route path="*" element={<h2>404 - Nincs ilyen oldal!</h2>} />
        </Routes>
    </>
  )
}

export default App