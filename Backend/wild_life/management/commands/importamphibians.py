import pandas as pd
from django.core.management.base import BaseCommand
from wild_life.models import *
import os
from django.conf import settings
import random
from django.db import transaction
import csv
import random
from datetime import datetime, timedelta
from django.core.management.base import BaseCommand

# Function to generate a random datetime within the last two months
# def generate_random_datetime_last_two_months():
#     today = datetime.today()
#     two_months_ago = today - timedelta(days=60)
    
#     # Generate a random number of days between 0 and 60 (to get a date within the last two months)
#     random_days = random.randint(0, 60)
#     # Generate a random number of seconds within a day (86400 seconds = 24 hours)
#     random_seconds = random.randint(0, 86400)
    
#     # Calculate the random datetime
#     random_datetime = two_months_ago + timedelta(days=random_days, seconds=random_seconds)
#     return random_datetime


# class Command(BaseCommand):
#     help = "Generate random datetimes (including time) within the last two months and store them in a CSV file."
    
#     def handle(self, *args, **kwargs):
#         # Generate 15,221 random datetimes
#         random_datetimes = [generate_random_datetime_last_two_months() for _ in range(15221)]

#         # Define the CSV file path
#         csv_file_path = "random_datetimes.csv"

#         # Write the datetimes to the CSV file
#         with open(csv_file_path, mode='w', newline='') as file:
#             writer = csv.writer(file)
#             writer.writerow(["Random Datetime"])  # Header
#             for date in random_datetimes:
#                 writer.writerow([date.strftime('%Y-%m-%d %H:%M:%S')])  # Format the datetime

#         self.stdout.write(f"Successfully generated 15,221 random datetimes and stored them in {csv_file_path}")
   


class Command(BaseCommand):
    help = "Update the 'last_login' field of User table using data from a CSV file."

    def handle(self, *args, **kwargs):
        # Define the path to the CSV file
        data_dir = os.path.join(settings.BASE_DIR, 'data')  # Adjust if your data directory is different
        csv_file_path = os.path.join(data_dir, 'random_datetimes.csv')
        
        # Read the CSV file
        df = pd.read_csv(csv_file_path)

        # Check if the 'Random Datetime' column exists in the CSV
        if 'Random Datetime' not in df.columns:
            self.stdout.write(self.style.ERROR("CSV file does not contain a 'Random Datetime' column."))
            return

        # Ensure the column data is treated as datetime objects
        df['Random Datetime'] = pd.to_datetime(df['Random Datetime'], format='%Y-%m-%d %H:%M:%S')

        # Get the list of all users
        users = User.objects.all()

        # Check if the number of users matches the number of rows in the CSV file
        if len(users) != len(df):
            self.stdout.write(self.style.ERROR(f"The number of users ({len(users)}) does not match the number of rows in the CSV ({len(df)})."))
            return

        # Update each user's `last_login` field with the corresponding datetime value
        for user, random_datetime in zip(users, df['Random Datetime']):
            user.last_login = random_datetime
            user.save()  # Save the changes to the database

        self.stdout.write(self.style.SUCCESS(f"Successfully updated 'last_login' for {len(users)} users using the data from {csv_file_path}."))

        



# class Command(BaseCommand):
#     help = "Import data from CSV file and create Amphibians entries"

#     def handle(self, *args, **kwargs):
#         # Total sum you want
#         target_sum = 178278

#         @transaction.atomic  # Ensure the operation is atomic
#         def assign_random_identifications():
#             users = User.objects.all()
#             user_count = users.count()

#             if user_count == 0:
#                 self.stdout.write(self.style.WARNING("No users found."))
#                 return
            
#             # Step 1: Generate random numbers for all but the last user
#             random_identifications = [random.randint(0, target_sum // user_count) for _ in range(user_count - 1)]
            
#             # Step 2: Calculate the current sum and determine the last identification
#             current_sum = sum(random_identifications)
#             last_identification = target_sum - current_sum
            
#             # Step 3: Ensure the last identification is non-negative
#             if last_identification < 0:
#                 # Adjust the random_identifications to ensure the last one is non-negative
#                 adjustment = abs(last_identification)
#                 for i in range(user_count - 1):
#                     if random_identifications[i] >= adjustment:
#                         random_identifications[i] -= adjustment
#                         break
#                 else:
#                     # If all identifications are too small, just set them to zero
#                     random_identifications = [0] * (user_count - 1)
#                     last_identification = target_sum  # All goes to the last user

#             # Add the last identification
#             random_identifications.append(last_identification)

#             # Step 4: Shuffle the identifications for randomness
#             random.shuffle(random_identifications)

#             # Step 5: Assign the values to the users
#             for idx, user in enumerate(users):
#                 user.identifications = random_identifications[idx]
#                 user.save()

#         # Call the function
#         assign_random_identifications()


# class Command(BaseCommand):
#     help = "Import data from CSV file and create Amphibians entries"

#     def handle(self, *args, **kwargs):

#         data_dir = os.path.join(settings.BASE_DIR, 'data')
#         csv_file_path = os.path.join(data_dir, 'unique_usernames_with_emails.csv')

#         try:
#             df = pd.read_csv(csv_file_path)
#         except FileNotFoundError:
#             self.stdout.write(self.style.ERROR('CSV file not found'))
#             return

#         for _, row in df.iterrows():
#             try:
#                 # Use get_or_create to either get the user or create one if they don't exist
#                 user, created = User.objects.get_or_create(
#                     username=row['username'],
#                     defaults={
#                         'email': row['email'],  # Assuming CSV has 'email' column
#                         'password': row['password'],  # Store hashed password using Django's set_password
#                     }
#                 )

#                 # If the user was created, hash the password
#                 if created:
#                     user.set_password(row['password'])  # Hash the password
#                     user.save()   
#                 self.stdout.write(self.style.SUCCESS(f"{row['username']}"))

#             except Exception as e:
#                 self.stdout.write(self.style.ERROR(f"Error processing row for user '{row['username']}': {str(e)}"))



# class Command(BaseCommand):
#     help = "Import filtered data from CSV file"

#     def handle(self, *args, **kwargs):
#         data_dir = os.path.join(settings.BASE_DIR, 'data')
#         csv_file_path = os.path.join(data_dir, 'filtered_spiders_observations.csv')

#         try:
#             df = pd.read_csv(csv_file_path)
#         except FileNotFoundError:
#             self.stdout.write(self.style.ERROR('CSV file not found'))
#             return

#         for _, row in df.iterrows():
#             # Skip the row if the user_name is missing (NaN) or empty
#             if pd.isna(row['user_name']) or row['user_name'].strip() == "":
#                 self.stdout.write(self.style.ERROR("User name is missing. Skipping row."))
#                 continue

#             try:
#                 # Fetch the User instance based on the username from CSV
#                 user = User.objects.get(username=row['user_name'])

#                 # Check if any required fields are missing or NaN before creating the record
#                 required_fields = [
#                     'observed_on', 'time_observed_at', 'created_at', 'updated_at',
#                     'image_url', 'description', 'num_identification_agreements',
#                     'num_identification_disagreements', 'place_guess', 'place_county_name',
#                     'place_state_name', 'place_country_name', 'species_guess',
#                     'scientific_name', 'common_name', 'iconic_taxon_name',
#                     'latitude', 'longitude'
#                 ]

#                 # If any of the required fields are NaN, skip the row
#                 if any(pd.isna(row[field]) for field in required_fields):
#                     self.stdout.write(self.style.ERROR(f"Required field is missing in row with user '{row['user_name']}'. Skipping row."))
#                     continue

#                 # Create the Protozoa object if all checks pass
#                 All_Species.objects.create(
#                     observed_date=row['observed_on'],
#                     time_observed_at=row['time_observed_at'],
#                     created_date=row['created_at'],
#                     updated_date=row['updated_at'],
#                     image=row['image_url'],
#                     description=row['description'],
#                     no_identification_agreement=row['num_identification_agreements'],
#                     no_identification_disagreement=row['num_identification_disagreements'],
#                     location=row['place_guess'],
#                     city=row['place_county_name'],
#                     state=row['place_state_name'],
#                     country=row['place_country_name'],
#                     species_name_guess=row['species_guess'],
#                     scientific_name=row['scientific_name'],
#                     common_name=row['common_name'],
#                     category=row['iconic_taxon_name'],
#                     latitude=row['latitude'],
#                     longitude=row['longitude'],
#                     user=user,
#                 )
#                 Arachnida.objects.create(
#                     observed_date=row['observed_on'],
#                     time_observed_at=row['time_observed_at'],
#                     created_date=row['created_at'],
#                     updated_date=row['updated_at'],
#                     image=row['image_url'],
#                     description=row['description'],
#                     no_identification_agreement=row['num_identification_agreements'],
#                     no_identification_disagreement=row['num_identification_disagreements'],
#                     location=row['place_guess'],
#                     city=row['place_county_name'],
#                     state=row['place_state_name'],
#                     country=row['place_country_name'],
#                     species_name_guess=row['species_guess'],
#                     scientific_name=row['scientific_name'],
#                     common_name=row['common_name'],
#                     category=row['iconic_taxon_name'],
#                     latitude=row['latitude'],
#                     longitude=row['longitude'],
#                     user=user,
#                 )

#                 self.stdout.write(self.style.SUCCESS(f"Record successfully added for user '{row['user_name']}'"))

#             except User.DoesNotExist:
#                 self.stdout.write(self.style.ERROR(f"User '{row['user_name']}' does not exist. Skipping row."))
