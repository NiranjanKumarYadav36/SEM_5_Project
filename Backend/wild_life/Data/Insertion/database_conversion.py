import sqlite3
import csv

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('amphibions.sqlite')
cursor = conn.cursor()

# # Create the table (if it doesn't already exist)
# query = """
#         CREATE TABLE IF NOT EXISTS amphibions (
#         id BIGINT AUTO_INCREMENT PRIMARY KEY,
#         observed_date DATETIME,
#         created_date DATETIME,
#         updated_date DATETIME,
#         url VARCHAR(200),
#         image_url VARCHAR(200),
#         description TEXT,
#         no_identification_agreement INT DEFAULT 0,
#         no_identification_disagreement INT DEFAULT 0,
#         how_many INT DEFAULT 1 NOT NULL,
#         location VARCHAR(255),
#         town VARCHAR(100),
#         state VARCHAR(100) NOT NULL,
#         country VARCHAR(100) NOT NULL,
#         species_name_guess VARCHAR(255) NOT NULL,
#         common_name VARCHAR(255),
#         scientific_name VARCHAR(255),
#         category VARCHAR(50) DEFAULT 'amphibions',
#         latitude DECIMAL(9, 6),
#         longitude DECIMAL(9, 6),
#         username VARCHAR(100) NOT NULL
#     );
# """
# cursor.execute(query)

# Read the CSV file and insert the data into the database
with open("../Fetching/Amphibions_observations.csv", 'r', encoding='utf-8') as file:
    csv_reader = csv.reader(file)

#   Skip the header
    next(csv_reader)

#     # Insert each row into the table
#     for row in csv_reader:
#         if row:
#             try:
#                 common_name = row[0] or '0'  # Handle missing values
#                 scientific_name = row[1] or '0'
#                 location_name = row[2] or 'unknown'
#                 observed_date = row[3] or 'unknown'
#                 count = row[4] or '1'
#                 latitude = row[5] or 'unknown'
#                 longitude = row[6] or 'unknown'

#                 cursor.execute("""
#                     INSERT INTO bird_sightings (common_name, scientific_name, location_name, observed_date, count, latitude, longitude)
#                     VALUES (?, ?, ?, ?, ?, ?, ?)
#                 """, (common_name, scientific_name, location_name, observed_date, count, latitude, longitude))
#             except IndexError:
#                 print("Row is incomplete or out of range:", row)
#             except ValueError:
#                 print("Invalid value in row:", row)


# # Commit the changes and close the connection
# conn.commit()
# conn.close()
