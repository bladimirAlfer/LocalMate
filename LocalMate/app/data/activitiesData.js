// app/data/activitiesData.js

export const getActivitiesData = async () => {
    try {
      const response = await fetch("http://172.20.10.2:5001/entidades/todas"); // Endpoint para actividades
      if (!response.ok) {
        throw new Error("No se pudieron obtener las actividades");
      }
      const activitiesData = await response.json();
  
      // Mapear los datos y agregar atributos para consistencia
      return activitiesData.map((activity) => ({
        id: activity.actividad_id,
        nombre: activity.nombre || "Actividad sin nombre",
        descripcion: activity.descripcion_breve || "Descripción no disponible",
        categorias: activity.categorias || ["Categoría no disponible"],
        latitud: parseFloat(activity.latitud),
        longitud: parseFloat(activity.longitud),
        direccion: activity.direccion || "Dirección no disponible",
        calificaciones: parseFloat(activity.calificaciones) || 0,
        precio: parseInt(activity.precio, 10) || 0,
        fechaInicio: activity.fecha_inicio || "Fecha no especificada",
        fechaFin: activity.fecha_fin || "Fecha no especificada",
        horario: activity.horario_disponible || "Horario no especificado",
        materialIncluido: activity.material_incluido || false,
        targetEtario: activity.target_etario || "No especificado",
        redesSociales: activity.redes_sociales || "No especificado",
        distrito: activity.distrito || "No especificado",
        tags: activity.tags || ["No especificado"],
      }));
    } catch (error) {
      console.error("Error al obtener actividades:", error);
      return [];
    }
  };
  