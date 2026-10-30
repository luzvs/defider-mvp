import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Icon } from '../../components/ui/index.js'
import { useReservations } from '../../services/reservationsStore.js'
import './Canchas.css'

/* ---------- Datos ---------- */
const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

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

const RECINTOS = [
  { clave: 'multicancha7x7', nombre: 'Multicancha 7x7', ubicacion: 'Casa Central' },
  { clave: 'multicancha5x5', nombre: 'Multicancha 5x5', ubicacion: 'Casa Central' },
  { clave: 'squash', nombre: 'Cancha Squash', ubicacion: 'Casa Central' },
  { clave: 'tenis', nombre: 'Cancha Tenis', ubicacion: 'Casa Central' },
  { clave: 'gimnasio1', nombre: 'Gimnasio 1', ubicacion: 'Casa Central' },
  { clave: 'gimnasio2', nombre: 'Gimnasio 2', ubicacion: 'Casa Central' },
  { clave: 'estadio', nombre: 'Estadio USM', ubicacion: 'Casa Central' },
  { clave: 'piscina', nombre: 'Piscina USM', ubicacion: 'Casa Central' },
  { clave: 'ajedrez', nombre: 'Sala de Ajedrez', ubicacion: 'Casa Central' },
]

/* ---------- Fechas ---------- */
function lunesDeSemana(semana) {
  const hoy = new Date()
  const dow = hoy.getDay()
  return new Date(hoy.getFullYear(), hoy.getMonth(), hoy.getDate() + (dow === 0 ? 1 : 1 - dow) + 7 * semana)
}

function fechaDia(semana, dia) {
  const l = lunesDeSemana(semana)
  return new Date(l.getFullYear(), l.getMonth(), l.getDate() + dia)
}

const fmt = (d) => `${d.getDate()}/${d.getMonth() + 1}`
const rangoSemana = (semana) => `${fmt(fechaDia(semana, 0))} al ${fmt(fechaDia(semana, 5))}`

function inicioBloque(semana, dia, bloque) {
  const [h, m] = bloque.split(' - ')[0].split(':').map(Number)
  const f = fechaDia(semana, dia)
  f.setHours(h, m, 0, 0)
  return f
}

/* ---------- Generar semanas hasta 2026 ---------- */
function generarSemanasPorMes() {
  const meses = []
  const hoy = new Date()
  const fin2026 = new Date(2026, 11, 31)
  
  const nombresMeses = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  
  let i = 0
  let lunes = lunesDeSemana(0)
  
  while (lunes <= fin2026) {
    const año = lunes.getFullYear()
    const mes = lunes.getMonth()
    const claveMes = `${año}-${mes}`
    
    let mesExistente = meses.find((m) => m.clave === claveMes)
    if (!mesExistente) {
      mesExistente = {
        clave: claveMes,
        año,
        mes,
        nombre: nombresMeses[mes],
        semanas: [],
      }
      meses.push(mesExistente)
    }
    
    // Calcular número de semana dentro del mes
    const primerDiaMes = new Date(año, mes, 1)
    const primerDiaMesDow = primerDiaMes.getDay()
    const primerLunesMes = new Date(primerDiaMes)
    primerLunesMes.setDate(primerDiaMes.getDate() + (primerDiaMesDow === 0 ? 1 : 1 - primerDiaMesDow))
    
    let semanaDelMes = 1
    let lunesTemp = new Date(primerLunesMes)
    while (lunesTemp < lunes) {
      lunesTemp.setDate(lunesTemp.getDate() + 7)
      semanaDelMes++
    }
    
    mesExistente.semanas.push({
      indice: i,
      etiqueta: i === 0 ? 'Esta semana' : i === 1 ? 'Próxima semana' : `Semana ${semanaDelMes}`,
      rango: rangoSemana(i),
      semanaDelMes,
    })
    
    i++
    lunes = lunesDeSemana(i)
  }
  
  return meses
}

const MESES = generarSemanasPorMes()

/* ---------- Ventana de confirmación ---------- */
function Confirmacion({ seleccion, onConfirmar, onCerrar }) {
  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  return (
    <div className="court-modal" role="presentation" onClick={onCerrar}>
      <div
        className="court-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="court-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="court-modal-titulo" className="court-modal__titulo">Confirma tu reserva</h2>
        <p className="court-modal__titulo-reserva">{seleccion.recinto}</p>
        <p className="court-modal__detalle">{seleccion.detalle}</p>
        <div className="court-modal__acciones">
          <button type="button" className="court-btn" onClick={onCerrar}>
            Volver
          </button>
          <button
            type="button"
            className="court-btn court-btn--primario"
            onClick={onConfirmar}
            autoFocus
          >
            Confirmar reserva
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Canchas() {
  const { reservations: reservas, addReservations: agregarReservas } = useReservations()
  const [semana, setSemana] = useState(0)
  const [mesSeleccionado, setMesSeleccionado] = useState(0)
  const [recinto, setRecinto] = useState('multicancha7x7')
  const [dia, setDia] = useState(0)
  const [bloquesSeleccionados, setBloquesSeleccionados] = useState([])
  const [seleccion, setSeleccion] = useState(null)
  const [aviso, setAviso] = useState(null)

  const recintoActual = RECINTOS.find((r) => r.clave === recinto)
  const ahora = new Date()

  function toggleBloque(bi) {
    const clave = `court|${recinto}|${semana}|${dia}|${bi}`
    const existente = reservas.find((r) => r.clave === clave)
    if (existente) return

    setBloquesSeleccionados((prev) => {
      if (prev.includes(bi)) {
        return prev.filter((b) => b !== bi)
      }
      return [...prev, bi]
    })
  }

  function confirmar() {
    if (bloquesSeleccionados.length === 0) return

    const nuevasReservas = bloquesSeleccionados.map((bi) => {
      const clave = `court|${recinto}|${semana}|${dia}|${bi}`
      return {
        clave,
        tipo: 'Cancha',
        recinto,
        semana,
        dia,
        bloque: bi,
        titulo: `${recintoActual.nombre}`,
        detalle: `Semana ${semana + 1} · ${rangoSemana(semana)} · ${DIAS[dia]} · ${BLOQUES[bi]}`,
      }
    })

    agregarReservas(nuevasReservas)
    setBloquesSeleccionados([])
    setAviso({
      texto: `${nuevasReservas.length} reserva(s) confirmada(s).`,
      detalle: `${recintoActual.nombre} · ${DIAS[dia]} · ${nuevasReservas.length} bloque(s)`,
      ver: true,
    })
    setSeleccion(null)
  }

  function estadoBloque(bi) {
    const clave = `court|${recinto}|${semana}|${dia}|${bi}`
    if (reservas.some((r) => r.clave === clave)) return { estado: 'reservada' }
    if (inicioBloque(semana, dia, BLOQUES[bi]) < ahora) return { estado: 'bloqueada', motivo: 'Horario pasado' }
    return { estado: 'libre' }
  }

  return (
    <>
      <PageHeader
        title="Canchas y recintos"
        description="Elige recinto, día y bloques, luego presiona Reservar."
      />

      {aviso && (
        <div className="court-aviso" role="status">
          <div>
            <strong>{aviso.texto}</strong>
            <span className="court-aviso__detalle">{aviso.detalle}</span>
          </div>
          <div className="court-aviso__acciones">
            {aviso.ver && <Link to="/mis-reservas" className="court-aviso__link">Ver en Mis reservas</Link>}
            <button type="button" className="court-aviso__cerrar" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Paso 1: semana */}
      <section className="court-paso" aria-labelledby="court-paso-semana">
        <h2 id="court-paso-semana" className="court-paso__titulo">
          <span className="court-paso__num" aria-hidden="true">1</span> Elige la semana
        </h2>
        
        {/* Selector de mes */}
        <div className="court-meses-wrap">
          <select
            className="court-mes-select"
            value={mesSeleccionado}
            onChange={(e) => {
              setMesSeleccionado(Number(e.target.value))
              // Seleccionar la primera semana del nuevo mes
              const primerSemanaMes = MESES[Number(e.target.value)].semanas[0]
              setSemana(primerSemanaMes.indice)
            }}
            aria-label="Seleccionar mes"
          >
            {MESES.map((m, mi) => (
              <option key={m.clave} value={mi}>
                {m.nombre} {m.año}
              </option>
            ))}
          </select>
        </div>

        {/* Semanas del mes seleccionado */}
        <div className="court-semanas-mes" role="group" aria-label="Semanas del mes">
          {MESES[mesSeleccionado]?.semanas.map((s) => (
            <button
              key={s.indice}
              type="button"
              className={`court-semana-mes${semana === s.indice ? ' is-active' : ''}`}
              aria-pressed={semana === s.indice}
              onClick={() => setSemana(s.indice)}
            >
              <span className="court-semana-mes__tag">{s.etiqueta}</span>
              <span className="court-semana-mes__rango">{s.rango}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Paso 2: recinto */}
      <section className="court-paso" aria-labelledby="court-paso-recinto">
        <h2 id="court-paso-recinto" className="court-paso__titulo">
          <span className="court-paso__num" aria-hidden="true">2</span> Elige el recinto
        </h2>
        <div className="court-recintos" role="group" aria-label="Recintos disponibles">
          {RECINTOS.map((r) => (
            <button
              key={r.clave}
              type="button"
              className={`court-recinto${recinto === r.clave ? ' is-active' : ''}`}
              aria-pressed={recinto === r.clave}
              onClick={() => {
                setRecinto(r.clave)
                setBloquesSeleccionados([])
              }}
            >
              <span className="court-recinto__nombre">{r.nombre}</span>
              <span className="court-recinto__ubicacion">{r.ubicacion}</span>
            </button>
          ))}
        </div>
        <p className="court-nota">
          Recintos sin reserva directa: Sala Fitness, Sala de Musculación, Sala Multiuso Gimnasio 3.
        </p>
      </section>

      {/* Paso 3: día y bloques */}
      <section className="court-paso" aria-labelledby="court-paso-bloque">
        <h2 id="court-paso-bloque" className="court-paso__titulo">
          <span className="court-paso__num" aria-hidden="true">3</span> Elige día y bloques
        </h2>

        <div className="court-contexto">
          <span className="court-contexto__eyebrow">Estás reservando en</span>
          <span className="court-contexto__texto">
            {recintoActual.nombre} · Semana {semana + 1} <span className="court-contexto__fechas">({rangoSemana(semana)})</span>
          </span>
        </div>

        {/* Selector de días */}
        <div className="court-dias" role="group" aria-label="Día de la semana">
          {DIAS.map((d, di) => (
            <button
              key={d}
              type="button"
              className={`court-dia${dia === di ? ' is-active' : ''}`}
              aria-pressed={dia === di}
              onClick={() => {
                setDia(di)
                setBloquesSeleccionados([])
              }}
            >
              {d}
              <span className="court-dia__fecha">{fmt(fechaDia(semana, di))}</span>
            </button>
          ))}
        </div>

        {/* Bloques horarios */}
        <div className="court-bloques" role="group" aria-label="Bloques horarios">
          {BLOQUES.map((b, bi) => {
            const { estado, motivo } = estadoBloque(bi)
            const seleccionado = bloquesSeleccionados.includes(bi)
            return (
              <button
                key={b}
                type="button"
                className={`court-bloque court-bloque--${estado}${seleccionado ? ' is-selected' : ''}`}
                disabled={estado === 'bloqueada' || estado === 'reservada'}
                onClick={() => toggleBloque(bi)}
                aria-pressed={seleccionado}
              >
                <span className="court-bloque__hora">{b}</span>
                {estado === 'reservada' && (
                  <span className="court-bloque__tag"><Icon name="check" size={14} /> Tu reserva</span>
                )}
                {motivo && <span className="court-bloque__tag">{motivo}</span>}
                {seleccionado && (
                  <span className="court-bloque__check"><Icon name="check" size={16} /></span>
                )}
              </button>
            )
          })}
        </div>

        {bloquesSeleccionados.length === 0 && (
          <p className="court-mensaje">Selecciona bloques para continuar.</p>
        )}

        {/* Botón reservar */}
        <div className="court-acciones">
          <button
            type="button"
            className={`court-reservar${bloquesSeleccionados.length > 0 ? '' : ' is-disabled'}`}
            disabled={bloquesSeleccionados.length === 0}
            onClick={() => {
              setSeleccion({
                recinto: recintoActual.nombre,
                detalle: `${DIAS[dia]} · ${bloquesSeleccionados.length} bloque(s): ${bloquesSeleccionados.map(bi => BLOQUES[bi]).join(', ')}`,
              })
            }}
          >
            Reservar ({bloquesSeleccionados.length})
          </button>
        </div>
      </section>

      {seleccion && (
        <Confirmacion seleccion={seleccion} onConfirmar={confirmar} onCerrar={() => setSeleccion(null)} />
      )}
    </>
  )
}