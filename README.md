# LocalMate


## Introducción
**LocalMate** es una plataforma innovadora diseñada para proporcionar recomendaciones personalizadas de locales, eventos y actividades cercanas a los usuarios, utilizando modelos de Machine Learning y técnicas híbridas de recomendación. La aplicación ofrece una experiencia personalizada basada en la ubicación del usuario, sus preferencias y el historial de interacciones.

---

## Funcionalidades Clave
1. **Recomendaciones basadas en la ubicación**:
   - Locales, eventos y actividades cercanas al usuario.
   - Filtro por preferencias específicas.
2. **Interfaz intuitiva**:
   - Diseño accesible y fácil de navegar.
   - Optimización para dispositivos móviles.
3. **Técnicas avanzadas de recomendación**:
   - Modelos híbridos que combinan filtrado colaborativo y basado en contenido.
   - Integración de distancias geográficas para mejorar la precisión.
4. **Gestión de usuarios y seguridad**:
   - Registro y autenticación mediante Firebase.
   - Almacenamiento seguro de datos en Firestore y JSON.



---

## Enlaces Importantes
- **Presentación de producto**: [Ver presentación](https://www.canva.com/design/DAGYQFNIP28/5udydXIMcq1JKJbUMoPkqw/edit?utm_content=DAGYQFNIP28&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- **Presentación técnica**: [Ver presentación técnica](https://www.canva.com/design/DAGYQ4f00RE/enDtaug7xe_sVq54RQ_h6w/edit?utm_content=DAGYQ4f00RE&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)
- **Prototipo funcional**: [Presentacion al prototipo](https://docs.google.com/presentation/d/1VbpWmlBRahr0UROZsJx-NYN4omwHokD4Pi_vBhdJzkw/edit?usp=sharing)
- **Modelos aplicados**: [Modelos en Google Drive](https://drive.google.com/drive/folders/1acMW_nd3Nn0tQxG1rZKrjm-3VSTyAFzl)

---

## Términos y Condiciones de Uso de LocalMate

### 1. Aceptación de los Términos
Al utilizar LocalMate, el usuario acepta cumplir con los términos y condiciones aquí establecidos. Si no está de acuerdo con alguno de estos términos, por favor, absténgase de usar el servicio.

### 2. Uso de Datos Personales
LocalMate recopila datos personales como ubicación, interacciones con locales, eventos y actividades, con el propósito de personalizar recomendaciones. Estos datos serán tratados con confidencialidad y no se compartirán con terceros sin el consentimiento explícito del usuario.

### 3. Propósito de la Recopilación de Datos
- Mejorar la experiencia del usuario con recomendaciones personalizadas.
- Facilitar la localización de eventos, actividades y locales cercanos.
- Optimizar la interfaz y funcionalidades de la aplicación.

### 4. Protección de Datos Personales
LocalMate implementa medidas de seguridad para proteger la información personal contra accesos no autorizados. Los datos recopilados se almacenan de manera segura y solo son accesibles por personal autorizado.

### 5. Derechos del Usuario
Los usuarios pueden:
- Acceder, rectificar y eliminar sus datos personales.
- Solicitar la restricción del procesamiento de sus datos en ciertas circunstancias.

---

## Política de Privacidad de LocalMate

### Introducción
En LocalMate valoramos y respetamos la privacidad de nuestros usuarios. Esta política explica cómo recopilamos, almacenamos y protegemos la información.

### Información Recopilada
- **Ubicación del Usuario**: Para recomendaciones geolocalizadas.
- **Interacciones**: Tipo de contenido visitado, eventos y actividades seleccionadas.
- **Preferencias de Usuario**: Categorías de interés como restaurantes, tecnología, salud, entre otras.

### Uso de la Información
- Recomendaciones personalizadas.
- Creación de reportes estadísticos para mejorar el servicio.

---

## Descripción Técnica

### Backend

#### API Flask
LocalMate utiliza un servidor Flask para procesar las solicitudes de los usuarios y generar recomendaciones personalizadas. A continuación, se describen las rutas principales y se incluyen ejemplos de implementación.

---

### Rutas Principales

#### `/recommend`
- Genera recomendaciones personalizadas basadas en la ubicación, categoría y preferencias del usuario.

**Código de la ruta `/recommend`:**
```python
@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    entity_id = data.get("id_df")
    user_location = data.get("user_location")
    radius_km = float(data.get("radius_km", 1))

    if not entity_id or not user_location:
        return jsonify({"error": "Faltan campos obligatorios"}), 400

    df = df_tiendas  # Puedes ajustar según la entidad
    cosine_sim = cosine_sim_tiendas  # Similitud coseno para tiendas
    
    recomendaciones = obtener_recomendaciones_con_distancia(
        entity_id, df, "local_id", user_location, cosine_sim, radius_km
    )
    return jsonify(recomendaciones)
```

Ejemplo de solicitud:
```json
{
    "id_df": "local_id",
    "user_location": [12.123, -77.456],
    "radius_km": 2
}
```
Ejemplo de respuesta:
```json
[
    {
        "nombre": "Restaurante A",
        "distancia": 0.5,
        "descripcion": "Comida peruana",
        "precio_unificado": "$$"
    },
    {
        "nombre": "Restaurante B",
        "distancia": 1.2,
        "descripcion": "Comida rápida",
        "precio_unificado": "$"
    }
]

```

#### `/nearby_entities`
   - Retorna locales, eventos y actividades cercanas según un radio definido.

**Código de la ruta `/recommend`:**
```python
@app.route("/nearby_entities", methods=["POST"])
def get_nearby_entities():
    data = request.get_json()
    user_location = tuple(data.get("user_location"))
    radius_km = float(data.get("radius_km", 0.5))
    entity_types = data.get("entity_types", ["local", "evento", "actividad"])

    results = []
    for entity_type in entity_types:
        if entity_type == "local":
            results.extend(recommend_nearby_stores(user_location, df_tiendas, radius_km))
        elif entity_type == "evento":
            results.extend(recommend_nearby_stores(user_location, df_eventos, radius_km))
        elif entity_type == "actividad":
            results.extend(recommend_nearby_stores(user_location, df_actividades, radius_km))

    results = sorted(results, key=lambda x: x["distance"])
    return jsonify(results)

```
Ejemplo de solicitud:
```json
{
    "user_location": [12.345, -77.678],
    "radius_km": 1.5,
    "entity_types": ["local", "actividad"]
}
```

Ejemplo de respuesta:
```json
[
    {
        "nombre": "Tienda A",
        "distancia": 0.4,
        "descripcion": "Supermercado",
        "categorias": ["Retail"]
    },
    {
        "nombre": "Clases de Yoga",
        "distancia": 1.2,
        "descripcion": "Clases para principiantes",
        "categorias": ["Actividad Física"]
    }
]

```
#### `/guardar_interaccion`
   - Registra las interacciones del usuario con la plataforma.

**Código de la ruta `/guardar_interaccion`:**
```python
@app.route('/guardar_interaccion', methods=['POST'])
def guardar_interaccion():
    nueva_interaccion = request.get_json()
    required_fields = ['user_id', 'contenido_id', 'tipo_interaccion', 'fecha_interaccion', 'ubicacion_usuario']
    
    if not all(field in nueva_interaccion for field in required_fields):
        return jsonify({"error": "Datos incompletos"}), 400

    interacciones = load_interacciones()
    interacciones.append(nueva_interaccion)
    save_interacciones(interacciones)

    return jsonify({"message": "Interacción registrada exitosamente"}), 201
```

**Ejemplo de solicitud:**
```json
{
    "user_id": "123",
    "contenido_id": "tienda_001",
    "tipo_interaccion": "click",
    "fecha_interaccion": "2023-12-01",
    "hora_interaccion": "10:30:00",
    "ubicacion_usuario": [12.123, -77.456]
}

```

Ejemplo de respuesta:
```json
{
    "message": "Interacción registrada exitosamente"
}

```

---

## Endpoint adicionales
#### `/guardar_interaccion`
- Filtra entidades según su proximidad geográfica y calcula la similitud coseno para generar recomendaciones.

#### Código de la función:
```python
def obtener_recomendaciones_con_distancia(id, df, id_df, user_location, cosine_sim, radius_km=1):
    idx = df.index[df[id_df] == id].tolist()[0]

    prefiltered_tiendas = df[
        (df['latitud'] >= user_location[0] - radius_km / 111) &
        (df['latitud'] <= user_location[0] + radius_km / 111) &
        (df['longitud'] >= user_location[1] - radius_km / (111 * np.cos(np.radians(user_location[0])))) &
        (df['longitud'] <= user_location[1] + radius_km / (111 * np.cos(np.radians(user_location[0]))))
    ]

    tiendas_dentro_radio = []
    for i in prefiltered_tiendas.index:
        tienda_location = (prefiltered_tiendas.at[i, 'latitud'], prefiltered_tiendas.at[i, 'longitud'])
        distance = geodesic(user_location, tienda_location).km
        if distance <= radius_km:
            tiendas_dentro_radio.append((i, distance))

    sim_scores = [(i, cosine_sim[idx][i]) for i, _ in tiendas_dentro_radio]
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[:5]
    
    recomendaciones = []
    for i, sim_score in sim_scores:
        tienda_info = df.iloc[i].to_dict()
        tienda_info['distance'] = tiendas_dentro_radio[i][1]
        tienda_info['sim_score'] = sim_score
        recomendaciones.append(tienda_info)
    
    return recomendaciones

```
- Esta función toma como entrada el id del usuario, un dataframe con información de tiendas, el id de la tienda, la ubicación del usuario, la matriz de similitud coseno y un radio en kilómetros. 

- Luego, filtra las tiendas dentro del radio especificado y calcula las similitudes coseno con la tienda del usuario. Finalmente, retorna las 5 tiendas más similares con sus distancias y similitudes.

---

#### Modelos Utilizados
- **Filtrado Colaborativo**: Basado en matrices latentes para sugerencias según el comportamiento de usuarios similares.
- **Filtrado Basado en Contenido**: Sugerencias según características similares entre locales, eventos o actividades.
- **Híbrido**: Combina colaborativo, contenido y proximidad geográfica.

## Modelos Aplicados
Los modelos de recomendación están alojados en Google Drive. Estos incluyen:
1. Matrices de interacción para locales, eventos y actividades.
2. Modelos basados en similitud de coseno y latentes.

Enlace: [Modelos en Drive](https://drive.google.com/drive/folders/1acMW_nd3Nn0tQxG1rZKrjm-3VSTyAFzl)

---

## Flujo de Trabajo
1. **Registro e inicio de sesión**:
   - Implementado con Firebase Auth.
2. **Recomendaciones**:
   - Algoritmos híbridos que combinan datos de interacción y similitud.
3. **Visualización**:
   - Resultados mostrados en una lista interactiva con filtros.

---

## Instalación
### Requisitos
- Python 3.8+
- Node.js
- Firebase CLI

### Pasos
1. Clonar el repositorio:
```bash
git clone https://github.com/bladimirAlfer/LocalMate.git
```
2. Instalar dependencias:
```bash
pip install -r requirements.txt
```
3. Instalar dependencias frontend:
```bash
npm install
```
4. Iniciar el servidor Flask:
```bash
python app.py
```
5. Iniciar el servidor frontend
```bash
npm start
```


#### Almacenamiento
- Datos de locales, eventos y actividades almacenados en formatos `.pkl` y `.json` para rápida recuperación.
- Uso de geopy para cálculos de distancia geográfica.

### Frontend

#### Tecnologías Utilizadas
- React Native para una experiencia multiplataforma.
- Expo para un desarrollo rápido y eficiente.

#### Funcionalidades Principales
- **Mapa Interactivo**: Muestra locales, eventos y actividades recomendadas.
- **Búsquedas**: Permite filtrar por categorías e intereses.
- **Registro de Actividad**: Almacena las interacciones del usuario para personalización.

#### Navegación (`/MainNavigator.tsx`)
- **Inicio**: Página principal con recomendaciones y mapa interactivo.

```tsx
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeScreen from '../screens/Home/HomeScreen';

const Stack = createStackNavigator();

const MainNavigator = () => (
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={LoginScreen} />
    <Stack.Screen name="Home" component={HomeScreen} />
  </Stack.Navigator>
);

export default MainNavigator;
```
#### Firebase Configuración (`/firebase.js`)
```js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCwb...",
  authDomain: "localmate.firebaseapp.com",
  projectId: "localmate",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
```

---

## Infraestructura y Recursos

### Infraestructura Existente
- **Backend**: Flask, Geopy, y Pickle.
- **Frontend**: React Native y Expo.
- **Bases de Datos**: Archivos JSON para entidades y Firebase para almacenamiento en tiempo real.

### Recursos Necesarios
- **Equipo de Desarrollo**: Data Engineers, Científicos de Datos, y MLOps.
- **Inversión Aproximada**:
  - **Infraestructura en la nube**: $1,000 mensuales.
  - **Desarrollo de modelos adicionales**: $5,000 en investigación inicial.

---

## Ejemplo de Uso

1. **Búsqueda Personalizada**:
   - Solicitud:
     ```json
     {
       "user_location": [12.123, -77.123],
       "radius_km": 2,
       "user_preference": "restaurantes"
     }
     ```
   - Respuesta:
     ```json
     [
       {
         "nombre": "Tienda A",
         "distancia": 0.5,
         "descripcion": "Restaurante especializado en comida local.",
         "categorias": ["Restaurantes"],
         "precio": "$$"
       }
     ]
     ```

2. **Recomendaciones Híbridas**:
   - Solicitud:
     ```json
     {
       "user_id": "1234",
       "user_location": [12.123, -77.123],
       "user_preference": "salud",
       "id_df": ["local_id", "evento_id"],
       "radius_km": 1
     }
     ```

   - Respuesta:
     ```json
     [
       {
         "nombre": "Clínica B",
         "categorias": ["Salud"],
         "distancia": 0.8,
         "precio": "$$$"
       }
     ]
     ```

---

## Contribuciones
Si deseas contribuir, envía un pull request a nuestro repositorio oficial en GitHub: [LocalMate Repository](https://github.com/bladimirAlfer/LocalMate).

---
## Conclusion
LocalMate ofrece un enfoque único para mejorar la experiencia del usuario en la búsqueda de locales y actividades personalizadas. La integración de modelos avanzados y una interfaz amigable posiciona esta solución como un referente en su categoría.

## Contacto
Para consultas o soporte, contáctanos en: **support@localmate.com**

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.
