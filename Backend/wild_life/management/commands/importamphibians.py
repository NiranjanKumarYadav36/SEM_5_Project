import pandas as pd
from django.core.management.base import BaseCommand
from wild_life.models import *
import os
from django.conf import settings
import random
from django.db import transaction


# class Command(BaseCommand):
#     help = "Getting state name from All_Species model"
    
#     def handle(self, *args,  **kwargs):

#         data_dir = os.path.join(settings.BASE_DIR, 'data')
#         csv_file_path = os.path.join(data_dir, 'wild_life_all_species.csv')

#         df = pd.read_csv(csv_file_path)
        
#         uniue_state_value = df['state'].unique()

#         print(sorted(uniue_state_value))

        
#         unique_state_df = pd.DataFrame(uniue_state_value, columns=['state'])
#         output_file_path = os.path.join(data_dir, 'state_list.csv')
#         unique_state_df.to_csv(output_file_path, index=False, header=False)        



class Command(BaseCommand):
    help = "Import data from CSV file and create Amphibians entries"

    def handle(self, *args, **kwargs):
        # Total sum you want
        target_sum = 178278

        @transaction.atomic  # Ensure the operation is atomic
        def assign_random_identifications():
            users = User.objects.all()
            user_count = users.count()

            if user_count == 0:
                self.stdout.write(self.style.WARNING("No users found."))
                return
            
            # Step 1: Generate random numbers for all but the last user
            random_identifications = [random.randint(0, target_sum // user_count) for _ in range(user_count - 1)]
            
            # Step 2: Calculate the current sum and determine the last identification
            current_sum = sum(random_identifications)
            last_identification = target_sum - current_sum
            
            # Step 3: Ensure the last identification is non-negative
            if last_identification < 0:
                # Adjust the random_identifications to ensure the last one is non-negative
                adjustment = abs(last_identification)
                for i in range(user_count - 1):
                    if random_identifications[i] >= adjustment:
                        random_identifications[i] -= adjustment
                        break
                else:
                    # If all identifications are too small, just set them to zero
                    random_identifications = [0] * (user_count - 1)
                    last_identification = target_sum  # All goes to the last user

            # Add the last identification
            random_identifications.append(last_identification)

            # Step 4: Shuffle the identifications for randomness
            random.shuffle(random_identifications)

            # Step 5: Assign the values to the users
            for idx, user in enumerate(users):
                user.identifications = random_identifications[idx]
                user.save()

        # Call the function
        assign_random_identifications()


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
