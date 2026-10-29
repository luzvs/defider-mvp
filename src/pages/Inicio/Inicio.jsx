import { Link } from 'react-router-dom'
import { Button, Icon } from '../../components/ui/index.js'
import './inicio.css'

// Provisorio: cuando la persona 2 publique utils/fechas.js, reemplazar por su función.
function semanaActual() {
  const hoy = new Date()
  const dow = hoy.getDay() // 0 = domingo
  const lunes = new Date(hoy)
  lunes.setDate(hoy.getDate() + (dow === 0 ? 1 : 1 - dow))
  const sabado = new Date(lunes)
  sabado.setDate(lunes.getDate() + 5)
  const fmt = (d) => `${d.getDate()}/${d.getMonth() + 1}`
  return `${fmt(lunes)} al ${fmt(sabado)}`
}

const FEATURES = [
  { to: '/gimnasio', icon: 'gym', title: 'Gimnasio',
    text: 'Sala de Máquinas y Sala Multiuso. Máximo 2 horas por sala y 3 en total por semana.', cta: 'Reservar gimnasio' },
  { to: '/equipamiento', icon: 'ball', title: 'Equipamiento',
    text: 'Balones, raquetas y más. 13 tipos de implementos con stock por bloque horario.', cta: 'Pedir equipamiento' },
  { to: '/canchas', icon: 'court', title: 'Canchas y recintos',
    text: 'Multicanchas 7x7 y 5x5, squash, tenis y gimnasios de Casa Central.', cta: 'Reservar cancha' },
  { to: '/talleres', icon: 'calendar', title: 'Talleres',
    text: 'Judo, karate, ajedrez, futsal y más. No requieren reserva: solo asiste en el horario indicado.', cta: 'Ver talleres' },
  { to: '/mis-reservas', icon: 'list', title: 'Mis reservas',
    text: 'Revisa tus reservas activas de las próximas dos semanas y cancélalas cuando quieras.', cta: 'Ver mis reservas' }
]

const STEPS = [
  'Elige el servicio: gimnasio, equipamiento o cancha.',
  'Selecciona la semana, el día y el bloque horario.',
  'Confirma y revisa tu reserva en Mis reservas.'
]

const RULES = [
  'Gimnasio: máximo 2 horas por sala a la semana y 3 en total.',
  'Puedes reservar dentro de las próximas dos semanas.',
  'Cancela cuando quieras desde Mis reservas.',
  'Los talleres no requieren reserva.'
]

export default function Inicio() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero__eyebrow">Casa Central · Semana del {semanaActual()}</p>
        <h1 id="hero-title" className="hero__title">Reserva tu hora deportiva en DEFIDER USM</h1>
        <p className="hero__text">
          Gimnasio, equipamiento y canchas en un solo lugar. Puedes reservar dentro de las próximas
          dos semanas y cancelar cuando quieras desde Mis reservas.
        </p>
        <div className="hero__actions">
          <Button to="/gimnasio" variant="light" size="lg">Reservar gimnasio</Button>
          <Button to="/talleres" variant="outline-light" size="lg">Ver talleres</Button>
        </div>
      </section>

      <section className="section" aria-labelledby="que-hacer">
        <h2 id="que-hacer" className="section__title">¿Qué quieres hacer?</h2>
        <ul className="features">
          {FEATURES.map(({ to, icon, title, text, cta }) => (
            <li key={to} className="features__item">
              <Link to={to} className="feature-card">
                <span className="feature-card__icon"><Icon name={icon} size={22} /></span>
                <h3 className="feature-card__title">{title}</h3>
                <p className="feature-card__text">{text}</p>
                <span className="feature-card__cta">{cta} <Icon name="arrow" size={16} /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="section info" aria-label="Cómo reservar y reglas">
        <div className="info__col">
          <h2 className="section__title">Cómo reservar en 3 pasos</h2>
          <ol className="steps">
            {STEPS.map((s, i) => (
              <li key={s} className="steps__item">
                <span className="steps__num" aria-hidden="true">{i + 1}</span>
                <span>{s}</span>
              </li>
            ))}
          </ol>
        </div>
        <div className="info__col">
          <h2 className="section__title">Reglas a tener en cuenta</h2>
          <ul className="rules">
            {RULES.map((r) => (
              <li key={r} className="rules__item">
                <Icon name="check" size={18} className="rules__icon" />
                <span>{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}