# Generated by Django 4.1.13 on 2024-09-25 06:56

from django.conf import settings
import django.contrib.auth.models
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0012_alter_user_first_name_max_length'),
    ]

    operations = [
        migrations.CreateModel(
            name='User',
            fields=[
                ('is_superuser', models.BooleanField(default=False, help_text='Designates that this user has all permissions without explicitly assigning them.', verbose_name='superuser status')),
                ('first_name', models.CharField(blank=True, max_length=150, verbose_name='first name')),
                ('last_name', models.CharField(blank=True, max_length=150, verbose_name='last name')),
                ('is_staff', models.BooleanField(default=False, help_text='Designates whether the user can log into this admin site.', verbose_name='staff status')),
                ('is_active', models.BooleanField(default=True, help_text='Designates whether this user should be treated as active. Unselect this instead of deleting accounts.', verbose_name='active')),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now, verbose_name='date joined')),
                ('last_login', models.DateTimeField(blank=True, default=None, null=True)),
                ('username', models.CharField(max_length=100, primary_key=True, serialize=False, unique=True)),
                ('email', models.EmailField(max_length=255, unique=True)),
                ('password', models.CharField(max_length=255)),
                ('identifications', models.BigIntegerField(default=0)),
                ('about', models.TextField(blank=True, max_length=1000, null=True)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.permission', verbose_name='user permissions')),
            ],
            options={
                'verbose_name': 'user',
                'verbose_name_plural': 'users',
                'abstract': False,
            },
            managers=[
                ('objects', django.contrib.auth.models.UserManager()),
            ],
        ),
        migrations.CreateModel(
            name='Reptilia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Protozoa',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField(verbose_name='Created At')),
                ('updated_date', models.DateTimeField(verbose_name='Updated At')),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Plantae',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Mollusca',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Mammalia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Insecta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Aves',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Arachnida',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Amphibia',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='All_Species',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
        migrations.CreateModel(
            name='Actinopterygii',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('observed_date', models.DateField(verbose_name='Observed Date')),
                ('time_observed_at', models.TimeField(verbose_name='Time Observed At')),
                ('created_date', models.DateTimeField()),
                ('updated_date', models.DateTimeField()),
                ('image', models.ImageField(null=True, upload_to='', verbose_name='Image URL')),
                ('description', models.TextField(max_length=10000, null=True, verbose_name='Description')),
                ('no_identification_agreement', models.BigIntegerField(default=0, verbose_name='Identification Agreements')),
                ('no_identification_disagreement', models.BigIntegerField(default=0, verbose_name='Identification Disagreements')),
                ('location', models.CharField(max_length=1000, null=True, verbose_name='Location')),
                ('city', models.CharField(max_length=100, verbose_name='City')),
                ('state', models.CharField(max_length=100, verbose_name='State')),
                ('country', models.CharField(max_length=100, null=True, verbose_name='Country')),
                ('species_name_guess', models.CharField(max_length=1000, null=True, verbose_name='Species Guess')),
                ('scientific_name', models.CharField(max_length=1000, null=True, verbose_name='Scientific Name')),
                ('common_name', models.CharField(max_length=1000, verbose_name='Common Name')),
                ('category', models.CharField(max_length=50, verbose_name='Category')),
                ('latitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Latitude')),
                ('longitude', models.DecimalField(decimal_places=10, max_digits=14, null=True, verbose_name='Longitude')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL, verbose_name='User Name')),
            ],
        ),
    ]
