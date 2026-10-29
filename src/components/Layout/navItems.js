export const NAV_ITEMS = [
  { to: '/',             label: 'Inicio',       icon: 'home',     end: true },
  { to: '/gimnasio',     label: 'Gimnasio',     icon: 'gym' },
  { to: '/equipamiento', label: 'Equipamiento', icon: 'ball' },
  { to: '/canchas',      label: 'Canchas',      icon: 'court' },
  { to: '/talleres',     label: 'Talleres',     icon: 'calendar' },
  { to: '/mis-reservas', label: 'Mis reservas', icon: 'list' },
  { to: '/perfil',       label: 'Perfil',       icon: 'user' }
]

// En móvil solo caben 5 pestañas: las de reserva. Talleres y Perfil se alcanzan desde Inicio y la barra superior.
export const BOTTOM_PATHS = ['/', '/gimnasio', '/equipamiento', '/canchas', '/mis-reservas']