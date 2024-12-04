from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
from geopy.distance import geodesic
from difflib import get_close_matches
import numpy as np
import os
from flask_cors import CORS
import json
from geopy.distance import geodesic


app = Flask(__name__)
CORS(app)

# Cargar los modelos y los datos
df_tiendas = pickle.load(open("./df_tiendas.pkl", "rb"))
df_eventos = pickle.load(open("./df_eventos.pkl", "rb"))
df_actividades = pd.read_pickle("./df_actividades.pkl")
cosine_sim_tiendas = pickle.load(open("./cos_sim_tiendas.pkl", "rb"))
cosine_sim_eventos = pickle.load(open("./cos_sim_eventos.pkl", "rb"))
cosine_sim_actividades = pickle.load(open("./cos_sim_actividades.pkl", "rb"))

df_interacciones = pd.read_pickle("./df_interacciones.pkl")

df_interacciones_locales = pd.read_pickle("./df_interacciones_local.pkl")
df_interacciones_eventos = pd.read_pickle("./df_interacciones_eventos.pkl")
df_interacciones_actividades = pd.read_pickle("./df_interacciones_actividades.pkl")

interaction_matrix_locales = pd.read_pickle("./TIENDA_interaction_matrix.pkl")
interaction_matrix_eventos = pd.read_pickle("./EVENTO_interaction_matrix.pkl")
interaction_matrix_actividades = pd.read_pickle("./ACTIVIDAD_interaction_matrix.pkl")

latent_matrix_locales = pd.read_pickle("./TIENDA_latent_matrix.pkl")
latent_matrix_eventos = pd.read_pickle("./EVENTO_latent_matrix.pkl")
latent_matrix_actividades = pd.read_pickle("./ACTIVIDAD_latent_matrix.pkl")

latent_matrix_locales_df = pd.read_pickle("./TIENDA_latent_matrix_df.pkl")
latent_matrix_eventos_df = pd.read_pickle("./EVENTO_latent_matrix_df.pkl")
latent_matrix_actividades_df = pd.read_pickle("./ACTIVIDAD_latent_matrix_df.pkl")

item_features_encoded_locales = pd.read_pickle("./TIENDA_item_features_encoded.pkl")
item_features_encoded_eventos = pd.read_pickle("./EVENTO_item_features_encoded.pkl")
item_features_encoded_actividades = pd.read_pickle("./ACTIVIDAD_item_features_encoded.pkl")

item_similarity_locales = np.load("./TIENDA_item_similarity.npy")
item_similarity_eventos = np.load("./EVENTO_item_similarity.npy")
item_similarity_actividades = np.load("./ACTIVIDAD_item_similarity.npy")

motor_search = pickle.load(open("./tfidf_motor_search.pkl", "rb"))
motor_search_matrix = pickle.load(open("./tfidf_motor_search_matrix.pkl", "rb"))
motor_search_eventos = pickle.load(open("./tfidf_motor_search_eventos.pkl", "rb"))
motor_search_matrix_eventos = pickle.load(open("./tfidf_motor_search_matrix_eventos.pkl", "rb"))
motor_search_actividades = pickle.load(open("./tfidf_motor_search_actividades.pkl", "rb"))
motor_search_matrix_actividades = pickle.load(open("./tfidf_motor_search_matrix_actividades.pkl", "rb"))

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Ruta al archivo JSON de tiendas
JSON_PATH = os.path.join(BASE_DIR, '../LocalMate/app/data/df_tiendas.json')
CATEGORY_FILE = os.path.join(BASE_DIR, 'categorias.json')
INTERACCIONES_JSON_PATH = os.path.join(BASE_DIR, 'interacciones.json')
PICKLE_PATH = os.path.join(BASE_DIR, "df_tiendas.pkl")
EVENTS_JSON_PATH = os.path.join(BASE_DIR, '../LocalMate/app/data/df_eventos.json')
ACTIVITIES_JSON_PATH = os.path.join(BASE_DIR, '../LocalMate/app/data/df_actividades.json')

preference_mapping = {
    "Restaurantes": "restaurant",
    "Electricista": "electrician",
    "Salud": "health",
    "Tecnología": "technology",
    # Agrega más categorías según sea necesario
}


# Función para cargar y guardar datos en JSON
def load_json_data():
    with open(JSON_PATH, "r") as f:
        return pd.DataFrame(json.load(f))
    
def load_events_json():
    with open(EVENTS_JSON_PATH, "r") as f:
        return pd.DataFrame(json.load(f))

def load_activities_json():
    with open(ACTIVITIES_JSON_PATH, "r") as f:
        return pd.DataFrame(json.load(f))

def save_json_data(df):
    with open(JSON_PATH, "w") as f:
        json.dump(df.to_dict(orient="records"), f, indent=4)


def obtener_recomendaciones_con_distancia(id, df, id_df, user_location, cosine_sim, radius_km=1):
    if id not in df[id_df].values:
        return []  # O puedes devolver un mensaje de error adecuado

    idx = df.index[df[id_df] == id].tolist()[0]

    # Prefiltrar tiendas dentro de un cuadrado de lado 2 * radius_km
    lat_min = user_location[0] - radius_km / 111  # Aproximación: 1 grado de latitud ≈ 111 km
    lat_max = user_location[0] + radius_km / 111
    lon_min = user_location[1] - radius_km / (111 * np.cos(np.radians(user_location[0])))
    lon_max = user_location[1] + radius_km / (111 * np.cos(np.radians(user_location[0])))

    prefiltered_tiendas = df[
        (df['latitud'] >= lat_min) & (df['latitud'] <= lat_max) &
        (df['longitud'] >= lon_min) & (df['longitud'] <= lon_max)
    ]

    # Calcular distancias geodésicas solo para las tiendas prefiltradas
    tiendas_dentro_radio = []
    for i in prefiltered_tiendas.index:
        tienda_location = (prefiltered_tiendas.at[i, 'latitud'], prefiltered_tiendas.at[i, 'longitud'])
        distance = geodesic(user_location, tienda_location).km
        if distance <= radius_km:
            tiendas_dentro_radio.append((i, distance))

    if not tiendas_dentro_radio:
        return []  # No hay tiendas dentro del radio especificado

    # Calcular similitud del coseno solo para las tiendas dentro del radio
    sim_scores = [(i, cosine_sim[idx][i]) for i, _ in tiendas_dentro_radio]
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)
    sim_scores = sim_scores[1:11]  # Obtener los 4 más similares
    tienda_indices = [i[0] for i in sim_scores]

    recomendaciones = []
    for i in tienda_indices:
        tienda_location = (df.at[i, 'latitud'], df.at[i, 'longitud'])
        distance = geodesic(user_location, tienda_location).km
        tienda_info = df.iloc[i].to_dict()
        
        # Agregar datos enriquecidos
        tienda_info['distance'] = round(distance, 2)
        tienda_info['descripcion_unificada'] = tienda_info.get('descripcion') or tienda_info.get('descripcion_breve', 'Descripción no disponible')
        tienda_info['precio_unificado'] = tienda_info.get('rango_precios') or tienda_info.get('precio', 'Precio no especificado')
        tienda_info['categorias'] = tienda_info.get('categorias', ['Categoría no disponible'])

        recomendaciones.append(tienda_info)
        print(f"Tienda: {df.at[i, 'nombre']}, Distancia: {distance:.2f} km, Similitud: {sim_scores[tienda_indices.index(i)][1]:.2f}")

    return recomendaciones

def hybrid_recommendation_with_location_and_preference(
    user_id, user_location, user_preference, df, id, 
    interaction_matrix, latent_matrix, latent_matrix_df, item_similarity, item_features_encoded, 
    top_n=4, radius_km=10):
    # Filter stores within the specified radius
    stores_within_radius = []
    for i, row in df.iterrows():
        store_location = (row['latitud'], row['longitud'])
        distance = geodesic(user_location, store_location).km
        if distance <= radius_km:
            stores_within_radius.append((i, distance))  # Store index and distance

    # Filter stores based on user preference matching store categories
    filtered_stores_df = df.loc[[i for i, _ in stores_within_radius]]
    filtered_stores_df = filtered_stores_df[
        filtered_stores_df['categorias'].apply(
            lambda categorias: any(
                preference.lower() in categorias.lower() 
                for preference in user_preference
            ) if isinstance(categorias, str) else False
        )
    ]

    # Si no encuentra la categoria, buscar por el nombre más cercano y aplicar modelo basado en contenido
    if filtered_stores_df.empty:
        print("No stores match the user preference within the specified radius.")
        
        # Combinar las preferencias en una cadena para buscar coincidencias
        store_names = df['nombre'].str.lower().unique()
        store_name = " ".join(user_preference).lower()
        
        print(f"Searching for close matches to '{store_name}'...")

        matches = get_close_matches(store_name, store_names, n=1, cutoff=0.6)
        if matches:
            matched_store = df[df['nombre'].str.lower() == matches[0]].iloc[0]
            return obtener_recomendaciones_con_distancia(
                id=matched_store[id],
                df=df,
                id_df=id,
                user_location=user_location,
                cosine_sim=item_similarity,
                radius_km=radius_km  # Asegúrate de pasar también el radio
            )
        else:
            print("No close matches found.")
            return []

    # Collaborative Filtering Scores
    if user_id not in latent_matrix_df.index:
        # If the user is new, recommend based on the most popular items in the filtered set
        popular_items = filtered_stores_df[id].value_counts().index[:top_n]
        recommended_stores = filtered_stores_df[filtered_stores_df[id].isin(popular_items)]
        
        # Convert each row to a full dictionary to include all store information
        recommendations_json = recommended_stores.apply(lambda row: row.to_dict(), axis=1).tolist()
        return recommendations_json

    # Get the user's latent vector from collaborative filtering
    user_latent_vector = latent_matrix_df.loc[user_id].values.reshape(1, -1)
    cf_scores = np.dot(user_latent_vector, latent_matrix.T).flatten()

    # Content-Based Scores
    user_interactions = df_interacciones[df_interacciones['user_id'] == user_id]['contenido_id']
    if user_interactions.empty:
        # If the user has no interactions, use only content-based scores
        cb_scores = item_similarity.mean(axis=0)
    else:
        # Map user_interactions to item_similarity indices
        user_interaction_indices = [
            item_features_encoded.index.get_loc(tienda_id) 
            for tienda_id in user_interactions if tienda_id in item_features_encoded.index
        ]
        cb_scores = item_similarity[user_interaction_indices].mean(axis=0)

    # Combine CF and CB scores for the filtered set of stores, checking bounds
    hybrid_scores = []
    for tienda_id, distance in stores_within_radius:
        if tienda_id in filtered_stores_df[id].values:
            try:
                idx = interaction_matrix.columns.get_loc(tienda_id)
                # Ensure the index is within bounds for both cf_scores and cb_scores
                if idx < len(cf_scores) and idx < len(cb_scores):
                    score = 0.7 * cf_scores[idx] + 0.3 * cb_scores[idx]
                elif idx < len(cf_scores):
                    score = cf_scores[idx]
                else:
                    score = 0  # Default score if no valid index found
                hybrid_scores.append((tienda_id, score, distance))
            except KeyError:
                continue

    # Sort by hybrid score and select top N
    top_recommendations = sorted(hybrid_scores, key=lambda x: x[1], reverse=True)[:top_n]
    recommended_store_ids = [item[0] for item in top_recommendations]

    # Preparar el JSON para cada recomendación
    recommendations_json = []
    for store_id, score, distance in top_recommendations:
        store_info = df[df[id] == store_id].iloc[0].to_dict()

        # Agrega campos faltantes como descripción y precio si no están
        store_info['descripcion'] = store_info.get('descripcion') or store_info.get('descripcion_breve', 'Descripción no disponible')
        store_info['precio'] = store_info.get('precio') or store_info.get('rango_precios', 'Precio no especificado')

        recommendations_json.append(store_info)

    # Retornar el JSON enriquecido
    return recommendations_json


def recommend_nearby_stores(user_location, entities_df, radius_km=1):
    entities_within_radius = []

    # Calcular la distancia de cada entidad al usuario
    for _, row in entities_df.iterrows():
        entity_location = (row['latitud'], row['longitud'])
        distance = geodesic(user_location, entity_location).km
        
        # Si la entidad está dentro del radio, agregarla a la lista
        if distance <= radius_km:
            entity_info = row.to_dict()
            entity_info['distance'] = round(distance, 2)  # Añadir distancia redondeada
            entities_within_radius.append(entity_info)

    # Ordenar las entidades por distancia ascendente
    return sorted(entities_within_radius, key=lambda x: x['distance'])

@app.route("/nearby_entities", methods=["POST"])
def get_nearby_entities():
    data = request.get_json()
    print(f"Datos recibidos en /nearby_entities: {data}")  # Debug
    user_location = tuple(data.get("user_location"))
    radius_km = float(data.get("radius_km", 0.5))
    entity_types = data.get("entity_types", ["local", "evento", "actividad"])

    try:
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
    except Exception as e:
        print(f"Error en /nearby_entities: {e}")
        return jsonify({"error": "No se pudieron obtener entidades cercanas"}), 500

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    print(data)

    # Validar campos obligatorios en la solicitud
    id_df = data.get("id_df")
    if not id_df:
        return jsonify({"error": "Missing id_df parameter"}), 400
    entity_id = data.get(id_df)  # Obtén el ID correspondiente basado en id_df
    user_location = data.get("user_location")  # Ubicación del usuario
    radius_km = float(data.get("radius_km", 1))  # Radio de búsqueda

    if not id_df or not entity_id or not user_location:
        return jsonify({"error": "Faltan campos obligatorios en la solicitud"}), 400

    # Seleccionar el DataFrame y la matriz de similitud adecuados
    if id_df == "local_id":
        df = df_tiendas
        cosine_sim = cosine_sim_tiendas
    elif id_df == "evento_id":
        df = df_eventos
        cosine_sim = cosine_sim_eventos
    elif id_df == "actividad_id":
        df = df_actividades
        cosine_sim = cosine_sim_actividades
    else:
        return jsonify({"error": "Valor inválido para id_df"}), 400

    recomendaciones = obtener_recomendaciones_con_distancia(
        entity_id, df, id_df, user_location, cosine_sim, radius_km
    )
    return jsonify(recomendaciones)


@app.route("/recommend_hybrid", methods=["POST"])
def recommend_api():
    data = request.get_json()
    print(f"Received input for /recommend_hybrid: {data}")  # Imprimir los datos recibidos

    try:
        # Validar que 'id_df' esté presente y sea una lista
        id_df_list = data.get("id_df")
        if not id_df_list or not isinstance(id_df_list, list):
            return jsonify({"error": "'id_df' parameter must be a non-empty list"}), 400

        user_id = data.get("user_id")
        user_location = tuple(data["user_location"])
        user_preference = data.get("user_preference", [])
        if not isinstance(user_preference, list):
            return jsonify({"error": "'user_preference' must be a list"}), 400
        radius_km = float(data.get("radius_km", 1))

        # Diccionario para mapear configuraciones por tipo
        entity_configs = {
            "local_id": {
                "df": df_tiendas,
                "interaction_matrix": interaction_matrix_locales,
                "latent_matrix": latent_matrix_locales,
                "latent_matrix_df": latent_matrix_locales_df,
                "item_similarity": item_similarity_locales,
                "item_features_encoded": item_features_encoded_locales,
            },
            "evento_id": {
                "df": df_eventos,
                "interaction_matrix": interaction_matrix_eventos,
                "latent_matrix": latent_matrix_eventos,
                "latent_matrix_df": latent_matrix_eventos_df,
                "item_similarity": item_similarity_eventos,
                "item_features_encoded": item_features_encoded_eventos,
            },
            "actividad_id": {
                "df": df_actividades,
                "interaction_matrix": interaction_matrix_actividades,
                "latent_matrix": latent_matrix_actividades,
                "latent_matrix_df": latent_matrix_actividades_df,
                "item_similarity": item_similarity_actividades,
                "item_features_encoded": item_features_encoded_actividades,
            },
        }

        # Lista para acumular todas las recomendaciones
        combined_recommendations = []

        for id_df in id_df_list:
            if id_df not in entity_configs:
                print(f"Invalid id_df value: {id_df}")
                continue  # Saltar al siguiente tipo si no es válido

            config = entity_configs[id_df]
            recommendations = hybrid_recommendation_with_location_and_preference(
                user_id=user_id,
                user_location=user_location,
                user_preference=user_preference,
                df=config["df"],
                id=id_df,
                interaction_matrix=config["interaction_matrix"],
                latent_matrix=config["latent_matrix"],
                latent_matrix_df=config["latent_matrix_df"],
                item_similarity=config["item_similarity"],
                item_features_encoded=config["item_features_encoded"],
                top_n=10,
                radius_km=radius_km,
            )
            combined_recommendations.extend(recommendations)

        # Devolver todas las recomendaciones combinadas
        return jsonify(combined_recommendations)

    except Exception as e:
        print(f"Error in /recommend_hybrid: {e}")
        return jsonify({"error": str(e)}), 400


# Rutas CRUD usando JSON
@app.route("/tiendas", methods=["POST"])
def add_tienda():
    df_tiendas_json = load_json_data()
    new_tienda = request.get_json()

    # Calcular el nuevo `local_id`
    if not df_tiendas_json.empty and "local_id" in df_tiendas_json.columns:
        new_tienda["local_id"] = int(df_tiendas_json["local_id"].max() + 1)
    else:
        new_tienda["local_id"] = 1  # Si está vacío, empieza desde 1

    # Validar campos obligatorios
    if 'user_id' not in new_tienda or not new_tienda['user_id']:
        return jsonify({"error": "user_id es obligatorio"}), 400
    if 'nombre' not in new_tienda or not new_tienda['nombre']:
        return jsonify({"error": "El campo nombre es obligatorio"}), 400
    if 'descripcion' not in new_tienda or not new_tienda['descripcion']:
        return jsonify({"error": "El campo descripcion es obligatorio"}), 400

    # Agregar la nueva tienda
    new_tienda_df = pd.DataFrame([new_tienda])
    df_tiendas_json = pd.concat([df_tiendas_json, new_tienda_df], ignore_index=True)
    save_json_data(df_tiendas_json)

    print(f"Tienda agregada: {new_tienda}")
    return jsonify(new_tienda), 201


@app.route("/entidades/todas", methods=["GET"])
def get_all_entities():
    try:
        # Cargar datos de las tiendas
        df_tiendas_json = load_json_data()
        tiendas_json = df_tiendas_json.fillna('').to_dict(orient='records')
        for tienda in tiendas_json:
            tienda['type'] = 'local'  # Añade el tipo

        # Cargar datos de los eventos
        df_eventos_json = load_events_json()
        eventos_json = df_eventos_json.fillna('').to_dict(orient='records')
        for evento in eventos_json:
            evento['type'] = 'evento'  # Añade el tipo

        # Cargar datos de las actividades
        df_actividades_json = load_activities_json()
        actividades_json = df_actividades_json.fillna('').to_dict(orient='records')
        for actividad in actividades_json:
            actividad['type'] = 'actividad'  # Añade el tipo

        # Combinar todas las entidades
        all_entities = tiendas_json + eventos_json + actividades_json
        return jsonify(all_entities)
    except Exception as e:
        print(f"Error al obtener todas las entidades: {e}")
        return jsonify({"error": "Error al obtener todas las entidades"}), 500

@app.route("/tiendas", methods=["GET"])
def get_tiendas():
    user_id = request.args.get("user_id")
    print(f"User ID recibido: {user_id}")
    
    if not user_id:
        return jsonify({"error": "Se requiere el user_id"}), 400
    
    try:
        df_tiendas_json = load_json_data()
        tiendas_usuario = df_tiendas_json[df_tiendas_json["user_id"] == user_id]
        
        if tiendas_usuario.empty:
            return jsonify({"message": "No hay tiendas registradas para este usuario"}), 200
        
        tiendas_json = tiendas_usuario.fillna('').to_dict(orient='records')
        return jsonify(tiendas_json)
    except Exception as e:
        print(f"Error al obtener tiendas: {e}")
        return jsonify({"error": "Error al obtener tiendas"}), 500

@app.route("/tiendas/<int:local_id>", methods=["PUT"])
def update_tienda(local_id):
    updated_tienda = request.get_json()
    df_tiendas_json = load_json_data()

    # Buscar por `local_id`
    idx = df_tiendas_json.index[df_tiendas_json['local_id'] == local_id].tolist()
    if not idx:
        return jsonify({"error": "Tienda no encontrada"}), 404

    idx = idx[0]
    for key, value in updated_tienda.items():
        df_tiendas_json.at[idx, key] = value
    save_json_data(df_tiendas_json)

    return jsonify(df_tiendas_json.iloc[idx].to_dict())


@app.route("/tiendas/<int:local_id>", methods=["DELETE"])
def delete_tienda(local_id):
    print(f"ID de tienda recibido para eliminar: {local_id}")
    df_tiendas_json = load_json_data()

    if local_id not in df_tiendas_json['local_id'].values:
        return jsonify({"error": "Tienda no encontrada"}), 404

    try:
        idx = df_tiendas_json.index[df_tiendas_json['local_id'] == local_id].tolist()[0]
        df_tiendas_json.drop(idx, inplace=True)
        save_json_data(df_tiendas_json)
        return '', 204
    except Exception as e:
        print(f"Error al eliminar tienda: {e}")
        return jsonify({"error": "No se pudo eliminar la tienda"}), 500


# Cargar categorías desde el archivo JSON
def load_categories():
    if os.path.exists(CATEGORY_FILE):
        with open(CATEGORY_FILE, 'r') as f:
            return json.load(f)
    return []

# Función para guardar categorías en el archivo JSON
def save_categories(categories):
    with open(CATEGORY_FILE, 'w') as f:
        json.dump(categories, f, indent=4)

# Ruta para obtener categorías
@app.route('/categorias', methods=['GET'])
def get_categories():
    categories = load_categories()
    return jsonify(categories)

# Ruta para añadir una nueva categoría
@app.route('/add_categorias', methods=['POST'])
def add_category():
    data = request.get_json()
    print("Datos recibidos en /add_categorias:", data)  # Log para depurar
    new_category = data.get('category')
    categories = load_categories()
    
    if new_category and new_category not in categories:
        categories.append(new_category)
        save_categories(categories)
        return jsonify({"message": "Categoría añadida correctamente"}), 201
    return jsonify({"message": "La categoría ya existe o está vacía"}), 400


# Función para cargar datos del archivo JSON
def load_interacciones():
    if not os.path.exists(INTERACCIONES_JSON_PATH):
        # Si el archivo no existe, crearlo con una lista vacía
        with open(INTERACCIONES_JSON_PATH, 'w') as f:
            json.dump([], f)
    with open(INTERACCIONES_JSON_PATH, 'r') as f:
        return json.load(f)

# Función para guardar datos en el archivo JSON
def save_interacciones(data):
    with open(INTERACCIONES_JSON_PATH, 'w') as f:
        json.dump(data, f, indent=4)

# Ruta para registrar una interacción
@app.route('/guardar_interaccion', methods=['POST'])
def guardar_interaccion():
    try:
        # Cargar datos enviados desde el frontend
        nueva_interaccion = request.get_json()

        # Validar los datos requeridos
        required_fields = ['user_id', 'contenido_id', 'tipo_interaccion', 'fecha_interaccion', 'hora_interaccion', 'ubicacion_usuario']
        if not all(field in nueva_interaccion for field in required_fields):
            return jsonify({"error": "Datos incompletos"}), 400

        # Cargar interacciones existentes
        interacciones = load_interacciones()

        # Agregar la nueva interacción
        interacciones.append(nueva_interaccion)

        # Guardar las interacciones actualizadas en el archivo JSON
        save_interacciones(interacciones)

        return jsonify({"message": "Interacción registrada exitosamente"}), 201

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5001)