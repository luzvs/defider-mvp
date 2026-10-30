import React, { useState } from 'react';
import { PageHeader } from '../../components/ui/index.js';

export default function Talleres() {
  const [mensaje, setMensaje] = useState("");

  const talleres = [
    { id: 1, nombre: "Yoga Funcional", horario: "Lunes y Miércoles 10:00 - 11:30", cupos: 5 },
    { id: 2, nombre: "CrossFit Universitario", horario: "Martes y Jueves 17:00 - 18:30", cupos: 2 },
    { id: 3, nombre: "Spinning", horario: "Viernes 15:00 - 16:00", cupos: 0 }
  ];

  const handleReserva = (nombre, cupos) => {
    if (cupos > 0) {
      setMensaje(`¡Inscripción confirmada para el taller de ${nombre}! Revisa tu correo institucional.`);
    } else {
      setMensaje(`Lo sentimos, no hay cupos para ${nombre}.`);
    }
  };

  return (
    <div>
      <PageHeader title="Talleres" description="Inscripción a talleres deportivos." />
      
      <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
        {mensaje && (
          <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', marginBottom: '15px', borderRadius: '5px', border: '1px solid #c3e6cb' }}>
            {mensaje}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          {talleres.map(taller => (
            <div key={taller.id} style={{ border: '1px solid #ccc', padding: '15px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: '0 0 10px 0' }}>{taller.nombre}</h3>
                <p style={{ margin: '0 0 5px 0' }}><strong>Horario:</strong> {taller.horario}</p>
                <p style={{ margin: 0, color: taller.cupos > 0 ? '#28a745' : '#dc3545', fontWeight: 'bold' }}>
                  {taller.cupos > 0 ? `${taller.cupos} cupos disponibles` : 'Sin cupos'}
                </p>
              </div>
              <button 
                onClick={() => handleReserva(taller.nombre, taller.cupos)}
                disabled={taller.cupos === 0}
                style={{ 
                  padding: '10px 20px', 
                  backgroundColor: taller.cupos > 0 ? '#007bff' : '#6c757d', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '5px', 
                  cursor: taller.cupos > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 'bold'
                }}
              >
                {taller.cupos > 0 ? 'Inscribirse' : 'Agotado'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}