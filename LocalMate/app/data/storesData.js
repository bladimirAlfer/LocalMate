// LocalMate/app/data/storesData.js

import storesData from './df_tiendas.json';

export const getStoresData = () => {
  return storesData.map(store => ({
    id: store.tienda_id,
    nombre: store.nombre,
    categoria: store.categorias,
    latitud: parseFloat(store.latitud),
    longitud: parseFloat(store.longitud),
    direccion: store.direccion,
    calificaciones: parseFloat(store.calificaciones),
    rangoPrecios: store.rango_precios,
    metodosPago: store.metodos_pago,
    tamanoTienda: store.tamano_tienda,
    estacionamiento: store.estacionamiento,
    horarioApertura: store.horario_apertura,
    distrito: store.distrito,
    zona: store.zona,
  }));
};
