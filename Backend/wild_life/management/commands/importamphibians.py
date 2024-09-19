import pandas as pd
from django.core.management.base import BaseCommand
from wild_life.models import Amphibians, User
import os
from django.conf import settings


class Command(BaseCommand):
    help = "Import student from csv file"

    def handle(self, *args, **kwargs):

        data_dir = os.path.join(settings.BASE_DIR, 'data')

        csv_file_path = os.path.join(data_dir, 'filtered_amphibians_observations.csv')

        try:
            df = pd.read_csv(csv_file_path)
        except FileNotFoundError:
            self.stdout.write(self.style.ERROR('CSV file not found'))
            return

        for _, row in df.iterrows():
            try:
                # Fetch the User instance based on the username from CSV
                user = User.objects.get(username=row['user_name'])
            except User.DoesNotExist:
                self.stdout.write(self.style.ERROR(f"User '{row['user_name']}' does not exist. Skipping row."))
                continue
        #     Amphibians.objects.create(
        #         observed_date = row['observed_on'],
        #         time_observed_at = row['time_observed_at'],
        #         created_date = row['created_at'],
        #         updated_date = row['updated_at'],
        #         image = row['image_url'],
        #         description = row['description'],
        #         no_identification_agreement = row['num_identification_agreements'],
        #         no_identification_disagreement = row['num_identification_disagreements'],
        #         location = row['place_guess'],
        #         city = row['place_county_name'],
        #         state = row['place_state_name'],
        #         country = row['place_country_name'],
        #         species_name_guess = row['species_guess'],
        #         scientific_name = row['scientific_name'],
        #         common_name = row['common_name'],
        #         category = row['iconic_taxon_name'],
        #         latitude=row['latitude'],
        #         longitude=row['longitude'],
        #         user=row['user_name'],
        #     )
        # self.stdout.write(self.style.SUCCESS('Success'))
