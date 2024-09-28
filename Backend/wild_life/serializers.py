from rest_framework.exceptions import ValidationError, AuthenticationFailed
from django.core.validators import validate_email
from django.contrib.auth.password_validation import validate_password
from rest_framework import serializers
from .models import *



class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(required=False, allow_blank=True)  # Disable default required validation
    email = serializers.EmailField(required=False, allow_blank=True)
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'last_login', 'about']
        
    def validate_username(self, value):     
        if not value:
            raise ValidationError("Username is required!")  # Custom error message
        if User.objects.filter(username=value).exists():
            raise ValidationError("Username already exists. Please choose a different one.")
        if len(value) < 4:
            raise ValidationError("Username must be at least 4 characters long.")
        return value

    def validate_email(self, value):
        if not value:
            raise ValidationError("Email is required!")
        
        try:
            validate_email(value)
        except ValidationError:
            raise ValidationError("Invalid email format.")
        
        if User.objects.filter(email=value).exists():
            raise ValidationError("Email already registered. Please use a different email address.")
        return value
    
    
    def validate_password(self, value):
        if not value:
            raise ValidationError("Password is required!")
        
        try:
            validate_password(value)
        except ValidationError as e:
            raise ValidationError(e.messages)
        return value
    
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance


class UserProfileUpdateSerializer(serializers.ModelSerializer):
    about = serializers.CharField(required=False, allow_blank=True)
    
    class Meta:
        model = User
        fields = ['about']  # Only include fields you want to update

    def update(self, instance, validated_data):
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    

class HomePageSerializer(serializers.Serializer):
    common_name = serializers.CharField()
    image = serializers.CharField()


class AllSpeciesSerializers(serializers.ModelSerializer):
    image = serializers.URLField()    
    latitude = serializers.DecimalField(max_digits=14, decimal_places=10,  allow_null=True, required=False)
    longitude = serializers.DecimalField(max_digits=14, decimal_places=10,  allow_null=True, required=False)
    
    class Meta:
        model = All_Species
        fields = ['image', 'latitude', 'longitude', 'common_name', 'user_id', 'category']
        
    
    
    def to_representation(self, instance):
        # Use the default serialization
        representation = super().to_representation(instance)

        # Convert latitude and longitude to float
        representation['latitude'] = float(representation['latitude']) if representation['latitude'] is not None else None
        representation['longitude'] = float(representation['longitude']) if representation['longitude'] is not None else None

        return representation
    
    
class ObserversCountSerializers(serializers.Serializer):
    username = serializers.CharField()
    count = serializers.IntegerField()


class SpeciesCountSerializers(serializers.Serializer):
    common_name = serializers.CharField(max_length=255)
    scientific_name = serializers.CharField(max_length=255)
    image = serializers.CharField(required=False)  
    observations_count = serializers.IntegerField()
    
    
class IdentifiersSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'identifications']
        
