from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.utils.translation import gettext as _

class User(AbstractUser):
    last_login = models.DateTimeField(null=True, blank=True, default=None)
    username = models.CharField(max_length=100, unique=True, primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255, )
    identifications = models.BigIntegerField(default=0)
    about = models.TextField(max_length=1000, null=True, blank=True)
    agreed_species = models.ManyToManyField('All_Species', related_name='agrred_users')

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    
    
class All_Species(models.Model):
    observed_date = models.DateField(_('Observed Date'), null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True) # Automatically set to now when the object is created
    updated_date = models.DateTimeField(auto_now=True) # Automatically set to now every time the object is updated
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Amphibians
class Amphibia(models.Model):
    observed_date = models.DateField(_('Observed Date'), null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Birds
class Aves(models.Model):  
    observed_date = models.DateField(_('Observed Date'), null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Fish
class Actinopterygii(models.Model):
    observed_date = models.DateField(_('Observed Date'),  null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Insects
class Insecta(models.Model):
    observed_date = models.DateField(_('Observed Date'), null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Mammals
class Mammalia(models.Model):
    observed_date = models.DateField(_('Observed Date'),   null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Moullusca
class Mollusca(models.Model):
    observed_date = models.DateField(_('Observed Date'),  null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Plants
class Plantae(models.Model):
    observed_date = models.DateField(_('Observed Date'),  null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Protozoa
class Protozoa(models.Model):
    observed_date = models.DateField(_('Observed Date'),   null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_date = models.DateTimeField(_('Updated At'), auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Reptiles
class Reptilia(models.Model):
    observed_date = models.DateField(_('Observed Date'),  null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"

# Spiders
class Arachnida(models.Model):
    observed_date = models.DateField(_('Observed Date'), null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True, upload_to='species')
    
    description = models.TextField(_('Description'), max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(_('Identification Agreements'), default=0)
    no_identification_disagreement = models.BigIntegerField(_('Identification Disagreements'), default=0)

    location = models.CharField(_('Location'), max_length=1000, null=True)
    city = models.CharField(_('City'), max_length=100, null=False)
    state = models.CharField(_('State'), max_length=100, null=False)
    country = models.CharField(_('Country'), max_length=100, null=True)
    
    species_name_guess = models.CharField(_('Species Guess'), max_length=1000, null=True)
    scientific_name = models.CharField(_('Scientific Name'), max_length=1000, null=True)
    common_name = models.CharField(_('Common Name'), max_length=1000, null=False)

    category = models.CharField(_('Category'), max_length=50, null=False)
    
    latitude = models.DecimalField(_('Latitude'), max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(_('Longitude'), max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE,  verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"



    