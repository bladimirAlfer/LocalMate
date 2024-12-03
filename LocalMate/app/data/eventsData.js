// app/data/eventsData.js

export const getEventsData = async () => {
    try {
      const response = await fetch("http://172.20.10.2:5001/entidades/todas"); // Endpoint para eventos
      if (!response.ok) {
        throw new Error("No se pudieron obtener los eventos");
      }
      const eventsData = await response.json();
  
      // Mapear los datos y agregar atributos para consistencia
      return eventsData.map((event) => ({
        id: event.evento_id,
        nombre: event.nombre || "Evento sin nombre",
        descripcion: event.descripcion_breve || "Descripción no disponible",
        categorias: event.categorias || ["Categoría no disponible"],
        latitud: parseFloat(event.latitud),
        longitud: parseFloat(event.longitud),
        direccion: event.direccion || "Dirección no disponible",
        calificaciones: parseFloat(event.calificaciones) || 0,
        fechaInicio: event.fecha_inicio || "Fecha no especificada",
        fechaFin: event.fecha_fin || "Fecha no especificada",
        horaInicio: event.hora_inicio || "Hora no especificada",
        horaFin: event.hora_fin || "Hora no especificada",
        precio: parseInt(event.precio, 10) || 0,
        redesSociales: event.redes_sociales || "No especificado",
        targetEtario: event.target_etario || "No especificado",
        estacionamiento: event.estacionamiento || false,
        wifi: event.wifi || false,
        distrito: event.distrito || "No especificado",
        tags: event.tags || ["No especificado"],
      }));
    } catch (error) {
      console.error("Error al obtener eventos:", error);
      return [];
    }
  };
  