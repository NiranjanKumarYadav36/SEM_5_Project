import pandas as pd

df = pd.read_csv('filtered_amphibians_observations.csv')

# Specify the column order
cols = list(df.columns)  # Get a list of all column names
cols.remove('longitude')  # Remove 'username' from the current position
cols.insert(17, 'longitude')  # Insert 'username' at index 2

# Reorder dataframe
df = df[cols]

# Remove the headers (column names)
# df.columns = [None] * len(df.columns)

# Insert a new 'id' column starting from 0
# df.insert(0, 'id', range(len(df)))
#
#
# # Change the data type of all columns to string
# df = df.astype(str)
# print(df.dtypes)

df = df.to_csv('../filtered_data/filtered_amphibians_observations.csv', index=False,)
