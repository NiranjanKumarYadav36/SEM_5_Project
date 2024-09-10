import sqlite3
import csv

# Connect to the SQLite database (or create it if it doesn't exist)
conn = sqlite3.connect('birds.sqlite')
cursor = conn.cursor()

# Create the table (if it doesn't already exist)
query = """
    CREATE TABLE IF NOT EXISTS bird_sightings(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        common_name TEXT,
        scientific_name TEXT,
        location_name TEXT,
        observed_date TEXT,
        count INTEGER,
        latitude DOUBLE,
        longitude DOUBLE
    )
"""
cursor.execute(query)

# Read the CSV file and insert the data into the database
with open("../Fetching/1.csv", 'r', encoding='utf-8') as file:
    csv_reader = csv.reader(file)

    # Skip the header
    next(csv_reader)

    # Insert each row into the table
    for row in csv_reader:
        if row:
            try:
                common_name = row[0] or '0'  # Handle missing values
                scientific_name = row[1] or '0'
                location_name = row[2] or 'unknown'
                observed_date = row[3] or 'unknown'
                count = row[4] or '1'
                latitude = row[5] or 'unknown'
                longitude = row[6] or 'unknown'

                cursor.execute("""
                    INSERT INTO bird_sightings (common_name, scientific_name, location_name, observed_date, count, latitude, longitude)
                    VALUES (?, ?, ?, ?, ?, ?, ?)
                """, (common_name, scientific_name, location_name, observed_date, count, latitude, longitude))
            except IndexError:
                print("Row is incomplete or out of range:", row)
            except ValueError:
                print("Invalid value in row:", row)


# Commit the changes and close the connection
conn.commit()
conn.close()
