import pandas as pd
from faker import Faker

# Step 1: Getting unique usernames

# List of CSV file paths
csv_files = ["filtered_amphibians_observations.csv", "filtered_aves_observations.csv", "filtered_fish_observations.csv",
             "filtered_insects_jan_observations.csv", "filtered_mammals_observations.csv",
             "filtered_spiders_observations.csv"]

# Initialize an empty set to store unique usernames
unique_usernames = set()

# Loop through each file and extract usernames
for file in csv_files:
    df = pd.read_csv(file)  # Read CSV file
    unique_usernames.update(df['user_name'].unique())  # Add unique usernames to the set

# Convert the set to a DataFrame
unique_usernames_df = pd.DataFrame(list(unique_usernames), columns=['username'])

# Initialize Faker
fake = Faker()


# Generate fake emails for each username
def generate_fake_email(username):
    return fake.email()


unique_usernames_df['email'] = unique_usernames_df['username'].apply(generate_fake_email)

# Save unique usernames and their fake emails to a new CSV file
unique_usernames_df.to_csv("unique_usernames_with_emails.csv", index=False)

print("Unique usernames and their fake emails have been saved to unique_usernames_with_emails.csv")
