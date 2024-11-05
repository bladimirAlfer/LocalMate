import pandas as pd

df = pd.read_csv('df_tiendas.csv')
df.to_json('df_tiendas.json', orient='records')
