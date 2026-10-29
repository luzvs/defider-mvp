import { useState } from 'react'
import { PageHeader, Button } from '../../components/ui/index.js'
import './perfil.css'

const MAX_POR_SALA = 2
const MAX_TOTAL = 3

const CAMPOS = [
  { name: 'nombre', label: 'Nombre completo', type: 'text', autoComplete: 'name' },
  { name: 'rol', label: 'Rol USM', type: 'text', inputMode: 'numeric' },
  { name: 'rut', label: 'RUT', type: 'text' },
  { name: 'correo', label: 'Correo institucional', type: 'email', autoComplete: 'email' },
]

const DATOS_INICIALES = {
  nombre: 'Estudiante USM',
  rol: '202312345-6',
  rut: '21.345.678-9',
  correo: 'estudiante@usm.cl',
}

// Provisorio: cuando las reservas vivan en un estado compartido, reemplazar por los datos reales.
const USO_SEMANAS = [
  { semana: 1, maquinas: 0, multiuso: 0 },
  { semana: 2, maquinas: 0, multiuso: 0 },
]
const RESERVAS_ACTIVAS = 0

export default function Perfil() {
  const [datos, setDatos] = useState(DATOS_INICIALES)
  const [guardado, setGuardado] = useState(false)

  const alCambiar = (e) => {
    setDatos((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setGuardado(false)
  }

  const alGuardar = (e) => {
    e.preventDefault()
    setGuardado(true)
  }

  return (
    <>
      <PageHeader title="Perfil" description="Tus datos y tu uso del gimnasio." />

      <div className="perfil">
        <form className="perfil__form" onSubmit={alGuardar}>
          {CAMPOS.map(({ name, label, ...rest }) => (
            <div key={name} className="perfil__campo">
              <label htmlFor={`perfil-${name}`} className="perfil__label">{label}</label>
              <input
                id={`perfil-${name}`}
                name={name}
                className="perfil__input"
                value={datos[name]}
                onChange={alCambiar}
                {...rest}
              />
            </div>
          ))}

          <div className="perfil__acciones">
            <Button type="submit" size="sm">Guardar cambios</Button>
            {guardado && <span className="perfil__ok" role="status">Cambios guardados.</span>}
          </div>
        </form>

        <aside className="perfil__lateral">
          <section className="perfil__uso" aria-labelledby="perfil-uso">
            <h2 id="perfil-uso" className="perfil__uso-titulo">Uso del gimnasio</h2>
            {USO_SEMANAS.map(({ semana, maquinas, multiuso }) => (
              <div key={semana} className="perfil__semana">
                <p className="perfil__semana-nombre">Semana {semana}</p>
                <p>Sala de Máquinas: {maquinas}/{MAX_POR_SALA} horas</p>
                <p>Sala Multiuso: {multiuso}/{MAX_POR_SALA} horas</p>
                <p>Total: {maquinas + multiuso}/{MAX_TOTAL} horas</p>
              </div>
            ))}
          </section>

          <p className="perfil__activas">
            Reservas activas: <strong>{RESERVAS_ACTIVAS}</strong>
          </p>
        </aside>
      </div>
    </>
  )
}
