from django.db import models
from django.contrib.auth.models import AbstractUser
from datetime import datetime
from django.utils.translation import gettext as _

class User(AbstractUser):
    username = models.CharField(max_length=100, unique=True, primary_key=True)
    email = models.EmailField(max_length=255, unique=True)
    password = models.CharField(max_length=255, )

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
    

class All_Species(models.Model):
    observed_date = models.DateField(null=False)
    time_observed_at = models.TimeField(null=False)
    
    created_date = models.DateTimeField()
    updated_date = models.DateTimeField()
    
    image = models.ImageField(null=True)
    
    description = models.TextField(max_length=10000, null=True)
    
    no_identification_agreement = models.BigIntegerField(default=0)
    no_identification_disagreement = models.BigIntegerField(default=0)
    
    
    location = models.CharField(max_length=1000, null=True)
    city = models.CharField(max_length=100, null=False)
    state = models.CharField(max_length=100, null=False)
    country = models.CharField(max_length=100, null=True)
    
    species_name_guess = models.CharField(max_length=1000, null=True)
    common_name = models.CharField(max_length=1000, null=False)
    scientific_name = models.CharField(max_length=1000, null=True)
    
    category = models.CharField(max_length=50,null=False)
    
    latitude = models.DecimalField(max_digits=14, decimal_places=10, null=True)
    longitude = models.DecimalField(max_digits=14, decimal_places=10, null=True)
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="species")

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"


class Amphibians(models.Model):
    observed_date = models.CharField(_('Observed Date'), max_length=1000,  null=False)
    time_observed_at = models.TimeField(_('Time Observed At'), null=False)
    
    created_date = models.DateTimeField(_('Created At'), auto_now_add=True)
    updated_date = models.DateTimeField(_('Updated At'), auto_now=True)
    
    image = models.ImageField(_('Image URL'), null=True)
    
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
    
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="amphibians", verbose_name=_('User Name'))

    def __str__(self):
        return f"{self.species_name_guess} observed by {self.user}"
