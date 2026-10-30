
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader } from '../../components/ui/index.js'
import { useReservations } from '../../services/reservationsStore.js'
import './Equipamiento.css'

// Materiales y stock simulado
const MATERIALES = [
  { id: 'volleyball', nombre: 'Pelota de volleyball', stock: 8 },
  { id: 'futbol', nombre: 'Pelota de fútbol', stock: 10 },
  { id: 'basquetbol', nombre: 'Pelota de básquetbol', stock: 6 },
  { id: 'tenis', nombre: 'Raqueta de tenis', stock: 4 },
  { id: 'pingpong', nombre: 'Paleta de ping pong', stock: 8 },
  { id: 'squash', nombre: 'Raqueta de squash', stock: 4 },
]

const BLOQUES = [
  '09:40 - 10:50',
  '11:05 - 12:15',
  '12:30 - 13:40',
  '14:40 - 15:50',
  '16:05 - 17:15',
  '17:30 - 18:40',
  '18:50 - 20:00',
  '20:15 - 21:25',
]

function formatoFecha(fecha) {
  return fecha.toLocaleDateString('es-CL', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

function fechaLocal(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')
  return `${anio}-${mes}-${dia}`
}

// Genera los próximos 14 días
function generarDias() {
  const dias = []
  const hoy = new Date()

  for (let i = 0; i < 14; i++) {
    const fecha = new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate() + i
    )
    dias.push({
      clave: fechaLocal(fecha),
      etiqueta: formatoFecha(fecha),
    })
  }

  return dias
}

export default function Equipamiento() {
  const { reservations, addReservation } = useReservations()

  const [materialId, setMaterialId] = useState('volleyball')
  const [fecha, setFecha] = useState(fechaLocal(new Date()))
  const [bloque, setBloque] = useState('')
  const [cantidad, setCantidad] = useState(1)
  const [confirmando, setConfirmando] = useState(false)
  const [aviso, setAviso] = useState('')

  const dias = generarDias()
  const material = MATERIALES.find(m => m.id === materialId)

  // Calcula las unidades ya reservadas para la selección
  const ocupadas = reservations
    .filter(r =>
      r.tipo === 'Equipamiento' &&
      r.materialId === materialId &&
      r.fecha === fecha &&
      r.bloque === bloque
    )
    .reduce((total, r) => total + Number(r.cantidad || 0), 0)

  const disponibles = Math.max(0, material.stock - ocupadas)

  function bloquePasado(horario) {
    const [hora, minuto] = horario.split(' - ')[0].split(':').map(Number)
    const inicio = new Date(`${fecha}T00:00:00`)
    inicio.setHours(hora, minuto, 0, 0)
    return inicio <= new Date()
  }

  function seleccionarMaterial(id) {
    setMaterialId(id)
    setCantidad(1)
    setAviso('')
  }

  function confirmarReserva() {
    if (!bloque || bloquePasado(bloque)) return
    if (cantidad < 1 || cantidad > disponibles) return

    addReservation({
      clave: `equipment|${materialId}|${fecha}|${bloque}|${Date.now()}`,
      tipo: 'Equipamiento',
      materialId,
      fecha,
      bloque,
      cantidad,
      titulo: material.nombre,
      detalle: `${formatoFecha(new Date(`${fecha}T12:00:00`))} · ${bloque} · Cantidad: ${cantidad}`,
    })

    setConfirmando(false)
    setAviso(`Reserva confirmada: ${cantidad} unidad(es) de ${material.nombre}.`)
    setCantidad(1)
    setBloque('')
  }

  const puedeReservar =
    bloque !== '' &&
    !bloquePasado(bloque) &&
    Number.isInteger(cantidad) &&
    cantidad >= 1 &&
    cantidad <= disponibles

  return (
    <div className="equipment">
      <PageHeader
        title="Reserva de equipamiento"
        description="Selecciona el material deportivo, día, horario y cantidad que necesitas."
      />

      {aviso && (
        <div className="equipment-aviso" role="status">
          <strong>{aviso}</strong>
          <Link to="/mis-reservas">Ver en Mis reservas</Link>
          <button type="button" onClick={() => setAviso('')}>
            Cerrar
          </button>
        </div>
      )}

      <section className="equipment-paso">
        <h2>
          <span className="equipment-num">1</span>
          Selecciona el equipamiento
        </h2>

        <div className="equipment-grid">
          {MATERIALES.map(m => (
            <button
              key={m.id}
              type="button"
              className={`equipment-card ${materialId === m.id ? 'is-active' : ''}`}
              onClick={() => seleccionarMaterial(m.id)}
              aria-pressed={materialId === m.id}
            >
              <strong>{m.nombre}</strong>
              <span>Stock total: {m.stock}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="equipment-paso">
        <h2>
          <span className="equipment-num">2</span>
          Selecciona el día
        </h2>

        <select
          className="equipment-select"
          value={fecha}
          onChange={e => {
            setFecha(e.target.value)
            setBloque('')
            setCantidad(1)
          }}
        >
          {dias.map(d => (
            <option key={d.clave} value={d.clave}>
              {d.etiqueta}
            </option>
          ))}
        </select>
      </section>

      <section className="equipment-paso">
        <h2>
          <span className="equipment-num">3</span>
          Selecciona un bloque horario
        </h2>

        <div className="equipment-grid">
          {BLOQUES.map(horario => {
            const pasado = bloquePasado(horario)

            return (
              <button
                key={horario}
                type="button"
                disabled={pasado}
                className={`equipment-card ${bloque === horario ? 'is-active' : ''}`}
                onClick={() => {
                  setBloque(horario)
                  setCantidad(1)
                }}
                aria-pressed={bloque === horario}
              >
                <strong>{horario}</strong>
                {pasado && <span>Horario pasado</span>}
              </button>
            )
          })}
        </div>
      </section>

      <section className="equipment-paso">
        <h2>
          <span className="equipment-num">4</span>
          Selecciona la cantidad
        </h2>

        <p>
          {bloque
            ? `Unidades disponibles: ${disponibles}`
            : 'Selecciona primero un horario.'}
        </p>

        <input
          className="equipment-cantidad"
          type="number"
          min="1"
          max={disponibles}
          value={cantidad}
          disabled={!bloque || disponibles === 0}
          onChange={e => setCantidad(Number(e.target.value))}
          aria-label="Cantidad de materiales"
        />
      </section>

      <div className="equipment-acciones">
        <button
          className="equipment-reservar"
          type="button"
          disabled={!puedeReservar}
          onClick={() => setConfirmando(true)}
        >
          Reservar equipamiento
        </button>
      </div>

      {confirmando && (
        <div
          className="equipment-modal"
          onClick={() => setConfirmando(false)}
        >
          <div
            className="equipment-modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="equipment-confirmar-titulo"
            onClick={e => e.stopPropagation()}
          >
            <h2 id="equipment-confirmar-titulo">
              Confirma tu reserva
            </h2>
            <p><strong>Material:</strong> {material.nombre}</p>
            <p><strong>Fecha:</strong> {formatoFecha(new Date(`${fecha}T12:00:00`))}</p>
            <p><strong>Horario:</strong> {bloque}</p>
            <p><strong>Cantidad:</strong> {cantidad}</p>

            <div className="equipment-modal-acciones">
              <button type="button" onClick={() => setConfirmando(false)}>
                Volver
              </button>
              <button
                type="button"
                className="equipment-reservar"
                disabled={!puedeReservar}
                onClick={confirmarReserva}
              >
                Confirmar reserva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
