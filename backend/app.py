from flask import Flask, request, jsonify, render_template
import pandas as pd
import pickle
from geopy.distance import geodesic
import os

app = Flask(__name__)

# Cargar los modelos y los datos
df_tiendas = pickle.load(open("./tiendas.pkl", "rb"))
cosine_sim = pickle.load(open("./tfidf_similarity-001.pkl", "rb"))

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
    print("Datos recibidos en el servidor:", data)  # Agrega esto para ver los datos en la consola

    try:
        tienda_id = int(data["tienda_id"])
        user_location = tuple(data["user_location"])
        radius_km = float(data.get("radius_km", 5))
    except KeyError as e:
        print("Falta una clave en los datos:", e)
        return jsonify({"error": f"Falta una clave en los datos: {e}"}), 400

    recomendaciones = obtener_recomendaciones_con_distancia(tienda_id, user_location, radius_km=radius_km)
    return jsonify(recomendaciones)

@app.route("/")
def index():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
