import pandas as pd
import pickle   
import os 

#df = pd.read_csv('df_tiendas.csv')
df = pickle.load(open("backend/tiendas.pkl", "rb"))
df.to_json('LocalMate/app/data/df_tiendas.json', orient='records')