import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/Layout/Layout.jsx'
import Inicio from './pages/Inicio/Inicio.jsx'
import Gimnasio from './pages/Gimnasio/Gimnasio.jsx'
import Equipamiento from './pages/Equipamiento/Equipamiento.jsx'
import Canchas from './pages/Canchas/Canchas.jsx'
import Talleres from './pages/Talleres/Talleres.jsx'
import MisReservas from './pages/MisReservas/MisReservas.jsx'
import Perfil from './pages/Perfil/Perfil.jsx'

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Inicio />} />
        <Route path="gimnasio" element={<Gimnasio />} />
        <Route path="equipamiento" element={<Equipamiento />} />
        <Route path="canchas" element={<Canchas />} />
        <Route path="talleres" element={<Talleres />} />
        <Route path="mis-reservas" element={<MisReservas />} />
        <Route path="perfil" element={<Perfil />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}