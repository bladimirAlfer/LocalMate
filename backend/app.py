from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
from geopy.distance import geodesic
import os

app = Flask(__name__)

# Cargar los modelos y los datos
df_tiendas = pickle.load(open("backend/tiendas.pkl", "rb"))
cosine_sim = pickle.load(open("backend/tfidf_similarity.pkl", "rb"))

def obtener_recomendaciones_con_distancia(tienda_id, user_location, cosine_sim=cosine_sim, radius_km=1):
    if tienda_id not in df_tiendas['tienda_id'].values:
        return []  # O puedes devolver un mensaje de error adecuado
    
    idx = df_tiendas.index[df_tiendas['tienda_id'] == tienda_id].tolist()[0]
    sim_scores = list(enumerate(cosine_sim[idx]))
    sim_scores = sorted(sim_scores, key=lambda x: x[1], reverse=True)[1:5]
    tienda_indices = [i[0] for i in sim_scores]
    
    recomendaciones = []
    for i in tienda_indices:
        tienda_location = (df_tiendas.iloc[i]['latitud'], df_tiendas.iloc[i]['longitud'])
        distance = geodesic(user_location, tienda_location).km
        if distance <= radius_km:
            tienda_info = df_tiendas.iloc[i].to_dict()
            tienda_info['distance'] = round(distance, 2)
            recomendaciones.append(tienda_info)
    return recomendaciones

@app.route("/recommend", methods=["POST"])
def recommend():
    data = request.get_json()
    tienda_id = int(data["tienda_id"])
    user_location = tuple(data["user_location"])
    radius_km = float(data.get("radius_km", 5))
    #print(f'Tienda: {tienda_id}, Ubicación: {user_location}, Radio: {radius_km}')
    recomendaciones = obtener_recomendaciones_con_distancia(tienda_id, user_location, radius_km=radius_km)
    #print(recomendaciones)
    return jsonify(recomendaciones)

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)