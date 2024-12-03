// app/data/storesData.js
// app/data/storesData.js
export const getStoresData = async () => {
  try {
    const response = await fetch('http://172.20.10.2:5001/entidades/todas'); // Este endpoint lee de df_tiendas.json
    if (!response.ok) {
      throw new Error('No se pudieron obtener las tiendas');
    }
    const storesData = await response.json();

    // Mapear los datos y agregar campo `imageUrl` desde la columna `imagenes`
    return storesData.map(store => ({
      id: store.local_id,
      nombre: store.nombre || 'Tienda sin nombre',
      descripcion: store.descripcion || 'Descripción no disponible',
      categorias: store.categorias || ['Categoría no disponible'],
      latitud: parseFloat(store.latitud),
      longitud: parseFloat(store.longitud),
      direccion: store.direccion || 'Dirección no disponible',
      calificaciones: parseFloat(store.calificaciones) || 0,
      rangoPrecios: store.rango_precios || 'No especificado',
      metodosPago: store.metodos_pago || 'No especificado',
      wifi: store.wifi || false,
      estacionamiento: store.estacionamiento || false,
      accesibilidad: store.accesibilidad || false,
      targetEtario: store.target_etario || 'No especificado',
      especialidades: store.especialidades || ['No especificado'],
      interaccionesAcumuladas: store.interacciones_acumuladas || 0,
      visitasHistoricas: store.visitas_historicas || 0,
      zona: store.zona || 'No especificado',
      mejorHora: store.mejor_hora || 'No especificado',
      redesSociales: store.redes_sociales || 'No especificado',
      tags: store.tags || ['No especificado'],
      combinedFeatures: store.combined_features || null,
      userId: store.user_id || null,
      // Usar el valor de `imagenes` para `imageUrl`
      imageUrl: store.imagenes || 'https://www.shutterstock.com/image-vector/default-ui-image-placeholder-wireframes-600nw-1037719192.jpg',
    }));
  } catch (error) {
    console.error('Error al obtener tiendas:', error);
    return [];
  }
};
