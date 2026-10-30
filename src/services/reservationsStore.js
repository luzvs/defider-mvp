import { useSyncExternalStore } from 'react'

const STORAGE_KEY = 'defider-usm-reservas'
const listeners = new Set()

const sampleReservations = [
  {
    id: 'sample-court-1',
    clave: 'court|multicancha7x7|0|0|0',
    tipo: 'Cancha',
    recinto: 'multicancha7x7',
    titulo: 'Multicancha 7x7',
    detalle: 'Semana 1 · 26/10 al 31/10 · Lunes · 09:40 - 10:50',
  },
  {
    id: 'sample-court-2',
    clave: 'court|multicancha7x7|0|0|2',
    tipo: 'Cancha',
    recinto: 'multicancha7x7',
    titulo: 'Multicancha 7x7',
    detalle: 'Semana 1 · 26/10 al 31/10 · Lunes · 12:30 - 13:40',
  },
]

let snapshot

function readReservations() {
  if (snapshot) return snapshot

  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored !== null) {
    try {
      snapshot = JSON.parse(stored)
    } catch {
      snapshot = []
    }
  } else {
    snapshot = sampleReservations.map((reservation) => ({ ...reservation }))
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot))
  }
  return snapshot
}

function emit(next) {
  snapshot = next
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

export function useReservations() {
  const reservations = useSyncExternalStore(subscribe, readReservations, readReservations)

  const addReservations = (newReservations) => {
    const withIds = newReservations.map((reservation, index) => ({
      ...reservation,
      id: reservation.id || `${Date.now()}-${index}-${Math.random().toString(36).slice(2, 7)}`,
    }))
    emit([...readReservations(), ...withIds])
  }

  const addReservation = (reservation) => addReservations([reservation])
  const cancelReservation = (id) => emit(readReservations().filter((reservation) => reservation.id !== id))
  const cancelByClave = (clave) => emit(readReservations().filter((reservation) => reservation.clave !== clave))

  return { reservations, addReservation, addReservations, cancelReservation, cancelByClave }
}
