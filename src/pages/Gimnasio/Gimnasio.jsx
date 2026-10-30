import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { PageHeader, Icon } from '../../components/ui/index.js'
import { useReservations } from '../../services/reservationsStore.js'
import './Gimnasio.css'

/* ---------- Datos del horario ----------
   Transcritos de las capturas del prototipo (Entrega 2). Revisar nombres de instructores. */
const MAX_POR_SALA = 2
const MAX_TOTAL = 3

const DIAS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

const BLOQUES = [
  '09:40 - 10:50',
  '11:05 - 12:15',
  '12:30 - 13:40',
  '14:40 - 15:50',
  '16:05 - 17:15',
  '17:30 - 18:40',
  '18:50 - 20:00',
]

const SALAS = [
  { clave: 'maquinas', nombre: 'Sala de Máquinas' },
  { clave: 'multiuso', nombre: 'Sala Multiuso' },
]

// Sala de Máquinas
const A = (instructor) => ({ titulo: 'Alumnos', instructor })
const AF = (instructor) => ({ titulo: 'Alumnos (incluye funcionarios)', instructor })
const F = (instructor) => ({ titulo: 'Funcionarios', instructor, soloFuncionarios: true })

// Sala Multiuso
const C = (titulo, instructor) => ({ titulo, instructor })
const CF = (titulo, instructor) => ({ titulo, instructor, soloFuncionarios: true })

// HORARIOS[sala][indiceBloque][indiceDia]  (null = sin actividad). Sábado siempre null.
const HORARIOS = {
  maquinas: [
    [A('L. Collao'), A('N. Monsalve'), A('A. Bulo'), A('G. Riesco'), A('C. Tapia'), null],
    [A('L. Collao'), A('N. Monsalve'), A('A. Bulo'), A('G. Riesco'), A('L. Collao'), null],
    [A('N. Monsalve'), A('N. Monsalve'), A('A. Bulo'), A('G. Riesco'), A('L. Collao'), null],
    [A('N. Monsalve'), A('C. Alcaíno'), A('A. Bulo'), A('N. Monsalve'), A('L. Collao'), null],
    [A('L. Collao'), A('C. Alcaíno'), A('A. Bulo'), A('C. Alcaíno'), F('C. Cabrera'), null],
    [F('L. Le-Corf'), F('A. Bulo'), F('C. Alcaíno'), F('C. Cabrera'), AF('C. Cabrera'), null],
    [AF('L. Collao'), AF('N. Monsalve'), AF('A. Bulo'), AF('G. Riesco'), AF('L. Collao'), null],
  ],
  multiuso: [
    [null, C('Funcional', 'J. Botau'), C('HIIT', 'NN'), null, C('GAP', 'G. Riesco'), null],
    [C('Yoga', 'N. Monsalve'), C('Funcional / TRX', 'J. Botau'), C('Funcional', 'NN'), null, C('TRX', 'G. Riesco'), null],
    [null, null, null, C('Pilates', 'N. Monsalve'), C('Funcional', 'G. Riesco'), null],
    [null, null, null, C('GAP', 'G. Riesco'), C('Yoga', 'C. Alcaíno'), null],
    [C('Pilates', 'N. Monsalve'), null, C('Funcional / HIIT', 'NN'), C('Yoga', 'N. Monsalve'), CF('Yoga', 'C. Alcaíno'), null],
    [CF('Funcional', 'J. Botau'), CF('Body Combat', 'J. Botau'), CF('GAP', 'J. Botau'), CF('Power Yoga', 'N. Monsalve'), null, null],
    [null, null, null, null, null, null],
  ],
}

/* ---------- Fechas ----------
   Provisorio: igual que en Inicio. Cuando exista utils/fechas.js, reemplazar estas funciones.
   Semana 0 = semana actual (lunes a sábado; si hoy es domingo, la que empieza mañana). */
function lunesDeSemana(semana) {
  const hoy = new Date()
  const dow = hoy.getDay() // 0 = domingo
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

const ETIQUETA_SEMANA = ['Esta semana', 'Próxima semana']

/* ---------- Ventana de confirmación ---------- */
function Confirmacion({ seleccion, onConfirmar, onCerrar }) {
  useEffect(() => {
    const alTeclear = (e) => e.key === 'Escape' && onCerrar()
    window.addEventListener('keydown', alTeclear)
    return () => window.removeEventListener('keydown', alTeclear)
  }, [onCerrar])

  const cancelando = seleccion.accion === 'cancelar'
  return (
    <div className="gym-modal" role="presentation" onClick={onCerrar}>
      <div
        className="gym-modal__card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="gym-modal-titulo"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 id="gym-modal-titulo" className="gym-modal__titulo">
          {cancelando ? '¿Cancelar esta reserva?' : 'Confirma tu reserva'}
        </h2>
        <p className="gym-modal__titulo-reserva">{seleccion.titulo}</p>
        <p className="gym-modal__detalle">{seleccion.detalle}</p>
        <div className="gym-modal__acciones">
          <button type="button" className="gym-btn" onClick={onCerrar}>
            {cancelando ? 'Mantener reserva' : 'Volver'}
          </button>
          <button
            type="button"
            className={`gym-btn ${cancelando ? 'gym-btn--peligro' : 'gym-btn--primario'}`}
            onClick={onConfirmar}
            autoFocus
          >
            {cancelando ? 'Sí, cancelar' : 'Confirmar reserva'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Gimnasio() {
  const { reservations: reservas, addReservation: agregarReserva, cancelReservation: cancelarReserva } = useReservations()
  const [semana, setSemana] = useState(0)
  const [sala, setSala] = useState('maquinas')
  const [seleccion, setSeleccion] = useState(null)
  const [aviso, setAviso] = useState(null)

  const salaActual = SALAS.find((s) => s.clave === sala)
  const horario = HORARIOS[sala]

  // Reservas de gimnasio de la semana mostrada
  const delGimnasio = reservas.filter((r) => r.tipo === 'Gimnasio' && r.semana === semana)
  const usadas = (clave) => delGimnasio.filter((r) => r.sala === clave).length
  const usadasTotal = delGimnasio.length
  const salaCompleta = usadas(sala) >= MAX_POR_SALA
  const totalCompleto = usadasTotal >= MAX_TOTAL

  const ahora = new Date()

  function abrirCelda(bi, di, celda) {
    const clave = `gym|${sala}|${semana}|${di}|${bi}`
    const existente = reservas.find((r) => r.clave === clave)
    if (existente) {
      setSeleccion({ accion: 'cancelar', id: existente.id, titulo: existente.titulo, detalle: existente.detalle })
      return
    }
    setSeleccion({
      accion: 'reservar',
      reserva: {
        clave,
        tipo: 'Gimnasio',
        sala,
        semana,
        titulo: `${salaActual.nombre} · ${celda.titulo} · ${celda.instructor}`,
        detalle: `Semana ${semana + 1} · ${rangoSemana(semana)} · ${DIAS[di]} · ${BLOQUES[bi]}`,
      },
      titulo: `${salaActual.nombre} · ${celda.titulo} · ${celda.instructor}`,
      detalle: `Semana ${semana + 1} · ${rangoSemana(semana)} · ${DIAS[di]} · ${BLOQUES[bi]}`,
    })
  }

  function confirmar() {
    if (seleccion.accion === 'cancelar') {
      cancelarReserva(seleccion.id)
      setAviso({ texto: 'Reserva cancelada.', detalle: seleccion.detalle })
    } else {
      agregarReserva(seleccion.reserva)
      setAviso({ texto: 'Reserva confirmada.', detalle: `${seleccion.titulo} · ${seleccion.detalle}`, ver: true })
    }
    setSeleccion(null)
  }

  function estadoCelda(bi, di, celda) {
    const clave = `gym|${sala}|${semana}|${di}|${bi}`
    if (reservas.some((r) => r.clave === clave)) return { estado: 'reservada' }
    if (celda.soloFuncionarios) return { estado: 'bloqueada', motivo: 'Solo funcionarios' }
    if (inicioBloque(semana, di, BLOQUES[bi]) < ahora) return { estado: 'bloqueada', motivo: 'Horario pasado' }
    if (salaCompleta) return { estado: 'bloqueada', motivo: 'Límite de la sala' }
    if (totalCompleto) return { estado: 'bloqueada', motivo: 'Límite semanal' }
    return { estado: 'libre' }
  }

  return (
    <>
      <PageHeader
        title="Gimnasio"
        description="Máximo 2 horas por sala a la semana y 3 en total (por ejemplo, 2 de máquinas y 1 multiuso)."
      />

      {aviso && (
        <div className="gym-aviso" role="status">
          <div>
            <strong>{aviso.texto}</strong>
            <span className="gym-aviso__detalle">{aviso.detalle}</span>
          </div>
          <div className="gym-aviso__acciones">
            {aviso.ver && <Link to="/mis-reservas" className="gym-aviso__link">Ver en Mis reservas</Link>}
            <button type="button" className="gym-aviso__cerrar" onClick={() => setAviso(null)} aria-label="Cerrar aviso">
              ×
            </button>
          </div>
        </div>
      )}

      {/* Paso 1: semana */}
      <section className="gym-paso" aria-labelledby="gym-paso-semana">
        <h2 id="gym-paso-semana" className="gym-paso__titulo">
          <span className="gym-paso__num" aria-hidden="true">1</span> Elige la semana
        </h2>
        <div className="gym-semanas" role="group" aria-label="Semana a reservar">
          {[0, 1].map((n) => (
            <button
              key={n}
              type="button"
              className={`gym-semana${semana === n ? ' is-active' : ''}`}
              aria-pressed={semana === n}
              onClick={() => setSemana(n)}
            >
              <span className="gym-semana__tag">{ETIQUETA_SEMANA[n]}</span>
              <span className="gym-semana__nombre">Semana {n + 1}</span>
              <span className="gym-semana__fechas">{rangoSemana(n)}</span>
            </button>
          ))}
        </div>
      </section>

      {/* Paso 2: sala */}
      <section className="gym-paso" aria-labelledby="gym-paso-sala">
        <h2 id="gym-paso-sala" className="gym-paso__titulo">
          <span className="gym-paso__num" aria-hidden="true">2</span> Elige la sala
        </h2>
        <div className="gym-salas" role="group" aria-label="Sala">
          {SALAS.map((s) => {
            const n = usadas(s.clave)
            return (
              <button
                key={s.clave}
                type="button"
                className={`gym-sala${sala === s.clave ? ' is-active' : ''}`}
                aria-pressed={sala === s.clave}
                onClick={() => setSala(s.clave)}
              >
                <span className="gym-sala__nombre">{s.nombre}</span>
                <span className="gym-sala__uso">{n}/{MAX_POR_SALA} horas usadas</span>
                <span className="gym-medidor" aria-hidden="true">
                  <span className="gym-medidor__fill" style={{ width: `${(n / MAX_POR_SALA) * 100}%` }} />
                </span>
              </button>
            )
          })}
        </div>
        <p className="gym-total">
          Total de la semana {semana + 1}: <strong>{usadasTotal}/{MAX_TOTAL}</strong> horas
        </p>
      </section>

      {/* Paso 3: bloque */}
      <section className="gym-paso" aria-labelledby="gym-paso-bloque">
        <h2 id="gym-paso-bloque" className="gym-paso__titulo">
          <span className="gym-paso__num" aria-hidden="true">3</span> Elige un bloque
        </h2>

        <div className="gym-contexto">
          <span className="gym-contexto__eyebrow">Estás reservando en</span>
          <span className="gym-contexto__texto">
            {salaActual.nombre} · Semana {semana + 1} <span className="gym-contexto__fechas">({rangoSemana(semana)})</span>
          </span>
        </div>

        {(salaCompleta || totalCompleto) && (
          <p className="gym-limite" role="status">
            {salaCompleta
              ? `Ya usaste tus ${MAX_POR_SALA} horas en ${salaActual.nombre} esta semana.`
              : `Ya usaste tus ${MAX_TOTAL} horas del gimnasio esta semana.`}{' '}
            Cancela una reserva para elegir otro bloque.
          </p>
        )}

        <ul className="gym-leyenda" aria-label="Leyenda">
          <li><span className="gym-leyenda__muestra gym-leyenda__muestra--libre" /> Disponible</li>
          <li><span className="gym-leyenda__muestra gym-leyenda__muestra--reservada" /> Tu reserva</li>
          <li><span className="gym-leyenda__muestra gym-leyenda__muestra--bloqueada" /> No disponible</li>
        </ul>

        <div className="gym-tabla-wrap">
          <table className="gym-tabla" aria-label={`Horario ${salaActual.nombre}, semana ${semana + 1}`}>
            <thead>
              <tr>
                <th scope="col">Bloque</th>
                {DIAS.map((d, di) => (
                  <th key={d} scope="col">
                    {d}
                    <span className="gym-tabla__fecha">{fmt(fechaDia(semana, di))}</span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {BLOQUES.map((b, bi) => (
                <tr key={b}>
                  <th scope="row">{b}</th>
                  {DIAS.map((d, di) => {
                    const celda = horario[bi][di]
                    if (!celda) {
                      return <td key={d}><span className="gym-vacio">—</span></td>
                    }
                    const { estado, motivo } = estadoCelda(bi, di, celda)
                    return (
                      <td key={d}>
                        <button
                          type="button"
                          className={`gym-celda gym-celda--${estado}`}
                          disabled={estado === 'bloqueada'}
                          onClick={() => abrirCelda(bi, di, celda)}
                        >
                          <span className="gym-celda__titulo">{celda.titulo}</span>
                          <span className="gym-celda__sub">{celda.instructor}</span>
                          {estado === 'reservada' && (
                            <span className="gym-celda__tag"><Icon name="check" size={14} /> Tu reserva</span>
                          )}
                          {motivo && <span className="gym-celda__tag">{motivo}</span>}
                        </button>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {seleccion && (
        <Confirmacion seleccion={seleccion} onConfirmar={confirmar} onCerrar={() => setSeleccion(null)} />
      )}
    </>
  )
}