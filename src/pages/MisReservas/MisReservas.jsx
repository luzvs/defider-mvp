import { PageHeader, Button } from '../../components/ui/index.js'
import { useReservations } from '../../services/reservationsStore.js'
import './MisReservas.css'

export default function MisReservas() {
  const { reservations, cancelReservation } = useReservations()

  return (
    <>
      <PageHeader
        title="Mis reservas"
        description="Puedes cancelar cualquier reserva activa."
      />

      {reservations.length > 0 ? (
        <div className="reservations-list" aria-label="Reservas activas">
          {reservations.map((reservation) => (
            <article className="reservation-card" key={reservation.id}>
              <div className="reservation-card__content">
                <span className="reservation-card__type">{reservation.tipo}</span>
                <h2 className="reservation-card__title">{reservation.titulo}</h2>
                <p className="reservation-card__detail">{reservation.detalle}</p>
              </div>
              <Button
                variant="danger-outline"
                size="sm"
                className="reservation-card__cancel"
                onClick={() => cancelReservation(reservation.id)}
                aria-label={`Cancelar reserva de ${reservation.titulo}`}
              >
                Cancelar reserva
              </Button>
            </article>
          ))}
        </div>
      ) : (
        <div className="reservations-empty">
          No tienes reservas activas.
        </div>
      )}
    </>
  )
}