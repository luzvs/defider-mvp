import { PageHeader } from '../../components/ui/index.js'
import './Talleres.css'

export default function Talleres() {
  const talleres = [
    {
      nombre: 'Ajedrez',
      instructor: 'Raúl Molina Muñoz',
      lugar: 'Sala de Estar',
      horarios: ['Jueves 12:30 - 13:40'],
    },
    {
      nombre: 'Básquetbol',
      instructor: 'Antonio López Pérez',
      lugar: 'Cancha 5x5',
      horarios: ['Viernes 14:40 - 15:50'],
    },
    {
      nombre: 'Futsal',
      instructor: 'Pablo Fernández Troncoso',
      lugar: 'Cancha 7x7',
      horarios: ['Lunes 17:30 - 18:40', 'Jueves 17:30 - 18:40'],
    },
    {
      nombre: 'Judo',
      instructor: 'Gaston Vergara Verdejo',
      lugar: 'Sala Multiuso Gimnasio 3',
      horarios: ['Lunes 18:50 - 20:00', 'Miércoles 18:50 - 20:00', 'Miércoles 20:15 - 21:25'],
    },
    {
      nombre: 'Gimnasia Artística',
      instructor: 'Bruce Gallardo',
      lugar: 'Gimnasio 1',
      horarios: ['Martes 12:30 - 13:40', 'Jueves 12:30 - 13:40'],
    },
    {
      nombre: 'Karate',
      instructor: 'Germán Oliveros Santos',
      lugar: 'Sala Multiuso Gimnasio 3',
      horarios: ['Martes 12:30 - 13:40'],
    },
    {
      nombre: 'Vóleibol',
      instructor: 'Jorge Botau Mancilla',
      lugar: 'Gimnasio 2',
      horarios: ['Martes 12:30 - 13:40'],
    },
    {
      nombre: 'Ultimate Frisbee',
      instructor: 'Antonio López Pérez',
      lugar: 'Estadio USM',
      horarios: ['Viernes 14:40 - 15:50'],
    },
    {
      nombre: 'Squash',
      instructor: 'Equipo DEFIDER',
      lugar: 'Cancha Squash',
      horarios: ['Lunes 17:30 - 18:40', 'Miércoles 17:30 - 18:40'],
    },
    {
      nombre: 'Tenis',
      instructor: 'Enrique Cabello Contreras',
      lugar: 'Cancha Tenis',
      horarios: ['Jueves 11:05 - 11:15'],
    },
    {
      nombre: 'Taekwondo',
      instructor: 'Sebastián Aguilar Garrido',
      lugar: 'Gimnasio 2',
      horarios: ['Martes 18:50 - 20:00', 'Viernes 17:30 - 18:40'],
    },
  ]

  return (
    <>
      <PageHeader
        title="Talleres"
        description="Los talleres no requieren reserva. Solo asiste al recinto en el horario indicado."
      />

      <section className="talleres-grid" aria-label="Lista de talleres">
        {talleres.map((taller) => (
          <article className="taller-card" key={taller.nombre}>
            <h2 className="taller-card__nombre">{taller.nombre}</h2>
            <p className="taller-card__recinto">Casa Central</p>
            <div className="taller-card__datos">
              <p>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 4-6 8-6s8 2 8 6" /></svg>
                <span>{taller.instructor}</span>
              </p>
              <p>
                <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></svg>
                <span>{taller.lugar}</span>
              </p>
              <p>
                <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3.5 2" /></svg>
                <span>
                  {taller.horarios.map((horario, index) => (
                    <span className="taller-card__horario" key={horario}>
                      {index > 0 && <br />}
                      {horario}
                    </span>
                  ))}
                </span>
              </p>
            </div>
          </article>
        ))}
      </section>
    </>
  )
}