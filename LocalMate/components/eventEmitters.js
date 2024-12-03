import { EventEmitter } from 'events';

// Emisores de eventos para tiendas
export const tiendaEventEmitterAdd = new EventEmitter(); // Para agregar tiendas
export const tiendaEventEmitterDelete = new EventEmitter(); // Para eliminar tiendas

// Emisores de eventos para eventos
export const eventoEventEmitterAdd = new EventEmitter(); // Para agregar eventos
export const eventoEventEmitterDelete = new EventEmitter(); // Para eliminar eventos

// Emisores de eventos para actividades
export const actividadEventEmitterAdd = new EventEmitter(); // Para agregar actividades
export const actividadEventEmitterDelete = new EventEmitter(); // Para eliminar actividades
