import { Routes, Route, NavLink } from "react-router-dom"
import { EtelKereses } from "./pages/Etel-kereses"
import { Main } from "./pages/MainPage"
import { Statisztika } from "./pages/Statisztika"
import { Naplo } from "./pages/naplo"
import { Kalorie} from "./pages/Kalorie-kalkulator"
import './styles/App.css';

export const App = () => {

  return (
    <>
   
      <h1>Termékek - feladat</h1>
      
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/etel-keres" element={<EtelKereses />} />
          <Route path="/statisztika" element={<Statisztika />} />
          <Route path="/naplo" element={<Naplo />} />
          <Route path="/kalorie-kalkulator" element={<Kalorie />} />
          <Route path="*" element={<h2>404 - Nincs ilyen oldal!</h2>} />
        </Routes>
    </>
  )
}

export default App