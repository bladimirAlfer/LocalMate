from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
from geopy.distance import geodesic
import numpy as np
import os

app = Flask(__name__)

# Cargar los modelos y los datos
df_tiendas = pickle.load(open("backend/tiendas.pkl", "rb"))
cosine_sim = pickle.load(open("backend/tfidf_similarity.pkl", "rb"))

def obtener_recomendaciones_con_distancia(tienda_id, user_location, cosine_sim=cosine_sim, radius_km=1):
    if tienda_id not in df_tiendas['tienda_id'].values:
        return []  # O puedes devolver un mensaje de error adecuado
    
    idx = df_tiendas.index[df_tiendas['tienda_id'] == tienda_id].tolist()[0]
    
    # Prefiltrar tiendas dentro de un cuadrado de lado 2 * radius_km
    lat_min = user_location[0] - radius_km / 111  # Aproximación: 1 grado de latitud ≈ 111 km
    lat_max = user_location[0] + radius_km / 111
    lon_min = user_location[1] - radius_km / (111 * np.cos(np.radians(user_location[0])))
    lon_max = user_location[1] + radius_km / (111 * np.cos(np.radians(user_location[0])))
    
    prefiltered_tiendas = df_tiendas[
        (df_tiendas['latitud'] >= lat_min) & (df_tiendas['latitud'] <= lat_max) &
        (df_tiendas['longitud'] >= lon_min) & (df_tiendas['longitud'] <= lon_max)
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
    sim_scores = sim_scores[:4]  # Obtener los 4 más similares
    tienda_indices = [i[0] for i in sim_scores]
    
    recomendaciones = []
    for i in tienda_indices:
        tienda_location = (df_tiendas.at[i, 'latitud'], df_tiendas.at[i, 'longitud'])
        distance = geodesic(user_location, tienda_location).km
        tienda_info = df_tiendas.iloc[i].to_dict()
        tienda_info['distance'] = round(distance, 2)
        recomendaciones.append(tienda_info)
        print(f"Tienda: {df_tiendas.at[i, 'nombre']}, Distancia: {distance:.2f} km, Similitud: {sim_scores[tienda_indices.index(i)][1]:.2f}")  # Imprimir distancia y similitud
    
    return recomendaciones

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    tienda_id = int(data["tienda_id"])
    user_location = tuple(data["user_location"])
    radius_km = float(data.get("radius_km", 5))
    recomendaciones = obtener_recomendaciones_con_distancia(tienda_id, user_location, radius_km=radius_km)
    return jsonify(recomendaciones)

@app.route("/tiendas", methods=["GET"])
def get_tiendas():
    return jsonify(df_tiendas.to_dict(orient='records'))

@app.route("/tiendas", methods=["POST"])
def add_tienda():
    new_tienda = request.get_json()
    # pasar new_tienda a DataFrame
    new_tienda = pd.DataFrame([new_tienda])
    df_tiendas.append(new_tienda, ignore_index=True)
    df_tiendas.to_pickle("backend/tiendas_agregadas.pkl")
    return jsonify(new_tienda), 201

@app.route("/tiendas/<int:tienda_id>", methods=["PUT"])
def update_tienda(tienda_id):
    updated_tienda = request.get_json()
    idx = df_tiendas.index[df_tiendas['tienda_id'] == tienda_id].tolist()[0]
    for key, value in updated_tienda.items():
        df_tiendas.at[idx, key] = value
    df_tiendas.to_pickle("backend/tiendas_agregadas.pkl")
    return jsonify(df_tiendas.iloc[idx].to_dict())

@app.route("/tiendas/<int:tienda_id>", methods=["DELETE"])
def delete_tienda(tienda_id):
    idx = df_tiendas.index[df_tiendas['tienda_id'] == tienda_id].tolist()[0]
    df_tiendas.drop(idx, inplace=True)
    df_tiendas.to_pickle("backend/tiendas_agregadas.pkl")
    return '', 204

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)