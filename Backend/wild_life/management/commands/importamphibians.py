import pandas as pd
from django.core.management.base import BaseCommand
from wild_life.models import *
import os
from django.conf import settings


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



class Command(BaseCommand):
    help = "Import filtered data from CSV file"

    def handle(self, *args, **kwargs):
        data_dir = os.path.join(settings.BASE_DIR, 'data')
        csv_file_path = os.path.join(data_dir, 'filtered_spiders_observations.csv')

        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('CSV file not found'))
            return

        for _, row in df.iterrows():
            # Skip the row if the user_name is missing (NaN) or empty
            if pd.isna(row['user_name']) or row['user_name'].strip() == "":
                self.stdout.write(self.style.ERROR("User name is missing. Skipping row."))
                continue

            try:
                # Fetch the User instance based on the username from CSV
                user = User.objects.get(username=row['user_name'])

                # Check if any required fields are missing or NaN before creating the record
                required_fields = [
                    'observed_on', 'time_observed_at', 'created_at', 'updated_at',
                    'image_url', 'description', 'num_identification_agreements',
                    'num_identification_disagreements', 'place_guess', 'place_county_name',
                    'place_state_name', 'place_country_name', 'species_guess',
                    'scientific_name', 'common_name', 'iconic_taxon_name',
                    'latitude', 'longitude'
                ]

                # If any of the required fields are NaN, skip the row
                if any(pd.isna(row[field]) for field in required_fields):
                    self.stdout.write(self.style.ERROR(f"Required field is missing in row with user '{row['user_name']}'. Skipping row."))
                    continue

                # Create the Protozoa object if all checks pass
                All_Species.objects.create(
                    observed_date=row['observed_on'],
                    time_observed_at=row['time_observed_at'],
                    created_date=row['created_at'],
                    updated_date=row['updated_at'],
                    image=row['image_url'],
                    description=row['description'],
                    no_identification_agreement=row['num_identification_agreements'],
                    no_identification_disagreement=row['num_identification_disagreements'],
                    location=row['place_guess'],
                    city=row['place_county_name'],
                    state=row['place_state_name'],
                    country=row['place_country_name'],
                    species_name_guess=row['species_guess'],
                    scientific_name=row['scientific_name'],
                    common_name=row['common_name'],
                    category=row['iconic_taxon_name'],
                    latitude=row['latitude'],
                    longitude=row['longitude'],
                    user=user,
                )
                Arachnida.objects.create(
                    observed_date=row['observed_on'],
                    time_observed_at=row['time_observed_at'],
                    created_date=row['created_at'],
                    updated_date=row['updated_at'],
                    image=row['image_url'],
                    description=row['description'],
                    no_identification_agreement=row['num_identification_agreements'],
                    no_identification_disagreement=row['num_identification_disagreements'],
                    location=row['place_guess'],
                    city=row['place_county_name'],
                    state=row['place_state_name'],
                    country=row['place_country_name'],
                    species_name_guess=row['species_guess'],
                    scientific_name=row['scientific_name'],
                    common_name=row['common_name'],
                    category=row['iconic_taxon_name'],
                    latitude=row['latitude'],
                    longitude=row['longitude'],
                    user=user,
                )

                self.stdout.write(self.style.SUCCESS(f"Record successfully added for user '{row['user_name']}'"))

            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"User '{row['user_name']}' does not exist. Skipping row."))
