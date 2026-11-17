import { useEffect, useState } from 'react'
import { PageHeader, Button } from '../../components/ui/index.js'
import { useReservations } from '../../services/reservationsStore.js'
import './MisReservas.css'

export default function MisReservas() {
  const { reservations, cancelReservation } = useReservations()
  const [pendingCancel, setPendingCancel] = useState(null) // reserva a confirmar
  const [notice, setNotice] = useState(null) // mensaje de cancelación

  // Cerrar el diálogo con Escape
  useEffect(() => {
    if (!pendingCancel) return undefined
    const onKeyDown = (event) => {
      if (event.key === 'Escape') setPendingCancel(null)
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [pendingCancel])

  // Ocultar el aviso automáticamente
  useEffect(() => {
    if (!notice) return undefined
    const timer = setTimeout(() => setNotice(null), 5000)
    return () => clearTimeout(timer)
  }, [notice])

  const confirmCancel = () => {
    cancelReservation(pendingCancel.id)
    setNotice(`Se canceló tu reserva de ${pendingCancel.titulo}.`)
    setPendingCancel(null)
  }

  return (
    <>
      <PageHeader
        title="Mis reservas"
        description="Puedes cancelar cualquier reserva activa."
      />

      {notice && (
        <div className="reservations-notice" role="status">
          <span className="reservations-notice__text">{notice}</span>
          <button
            type="button"
            className="reservations-notice__close"
            onClick={() => setNotice(null)}
            aria-label="Cerrar aviso"
          >
            ×
          </button>
        </div>
      )}

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
                onClick={() => setPendingCancel(reservation)}
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

      {pendingCancel && (
        <div
          className="confirm-overlay"
          onClick={() => setPendingCancel(null)}
        >
          <div
            className="confirm-dialog"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-desc"
            onClick={(event) => event.stopPropagation()}
          >
            <h2 id="confirm-title" className="confirm-dialog__title">
              ¿Cancelar esta reserva?
            </h2>
            <p id="confirm-desc" className="confirm-dialog__text">
              Vas a cancelar <strong>{pendingCancel.titulo}</strong>
              {pendingCancel.detalle ? ` (${pendingCancel.detalle})` : ''}.
              Esta acción no se puede deshacer.
            </p>
            <div className="confirm-dialog__actions">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setPendingCancel(null)}
                autoFocus
              >
                No, mantener
              </Button>
              <Button
                variant="danger-outline"
                size="sm"
                onClick={confirmCancel}
              >
                Sí, cancelar reserva
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}