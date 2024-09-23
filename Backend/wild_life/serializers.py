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
        fields = ['username', 'email', 'password']
        
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
            raise AuthenticationFailed("Email already registered. Please use a different email address.")
        return value
    
    
    def validate_password(self, value):
        if not value:
            raise AuthenticationFailed("Password is required!")
        
        try:
            validate_password(value)
        except AuthenticationFailed as e:
            raise AuthenticationFailed(e.messages)
        return value
    
    
    def create(self, validated_data):
        password = validated_data.pop('password', None)
        instance = self.Meta.model(**validated_data)
        if password is not None:
            instance.set_password(password)
        instance.save()
        return instance



class HomePageSerializer(serializers.Serializer):
    common_name = serializers.CharField()
    image = serializers.CharField()




class AllSpeciesSerializers(serializers.ModelSerializer):
    class Meta:
        model = All_Species
        fields = '__all__'


class ObserversCountSerializers(serializers.Serializer):
    username = serializers.CharField()
    count = serializers.IntegerField()


class SpeciesCountSerializers(serializers.Serializer):
    common_name = serializers.CharField(max_length=255)
    scientific_name = serializers.CharField(max_length=255)
    image = serializers.CharField(required=False)  
    observations_count = serializers.IntegerField()


