#import pandas as pd
#from faker import Faker

# List of CSV file paths
# csv_files = [
#     "filtered_amphibians_observations.csv", "filtered_aves_observations.csv", "filtered_fish_observations.csv",
#     "filtered_insects_jan_observations.csv", "filtered_mammals_observations.csv", "filtered_mollusca_observations.csv",
#     "filtered_plants_observations.csv", "filtered_protozoa_observations.csv", "filtered_reptiles_observations.csv",
#     "filtered_spiders_observations.csv"
# ]

# # Initialize sets to store unique usernames and emails
# unique_usernames = set()
# unique_emails = set()

# # Initialize Faker
# fake = Faker()

# # Function to generate a unique fake email
# def generate_unique_fake_email():
#     while True:
#         email = fake.email()
#         if email not in unique_emails:
#             unique_emails.add(email)
#             return email

# # Loop through each file and extract usernames
# for file in csv_files:
#     df = pd.read_csv(file)  # Read CSV file
#     for username in df['user_name'].unique():  # Loop through unique usernames in the file
#         if username not in unique_usernames:  # Check if the username is unique
#             unique_usernames.add(username)  # Add the unique username to the set

# # Convert the set of usernames to a DataFrame
# unique_usernames_df = pd.DataFrame(list(unique_usernames), columns=['username'])

# # Generate unique fake emails for each unique username
# unique_usernames_df['email'] = unique_usernames_df['username'].apply(lambda x: generate_unique_fake_email())

# # Save unique usernames and their fake emails to a new CSV file
# unique_usernames_df.to_csv("unique_usernames_with_emails.csv", index=False)

# print("Unique usernames and their unique fake emails have been saved to unique_usernames_with_emails.csv.")
















# # Load the CSV file into a pandas DataFrame
# df = pd.read_csv('unique_usernames_with_emails.csv')

# # Check for duplicate usernames
# duplicate_usernames = df[df.duplicated('username', keep=False)]

# # Check for duplicate emails
# duplicate_emails = df[df.duplicated('email', keep=False)]

# # Display results
# if duplicate_usernames.empty and duplicate_emails.empty:
#     print("All usernames and emails are unique.")
# else:
#     if not duplicate_usernames.empty:
#         print("Duplicate usernames found:")
#         print(duplicate_usernames)
#     if not duplicate_emails.empty:
#         print("Duplicate emails found:")
#         print(duplicate_emails)
        
# df = pd.read_csv('unique_usernames_with_emails.csv')
# df.insert(2, 'password', value='Wild@050')
# df.to_csv("unique_usernames_with_emails.csv", index=False)