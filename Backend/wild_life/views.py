import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
from .serializers import (UserSerializer, AllSpeciesSerializers, ObserversCountSerializers, SpeciesCountSerializers, HomePageSerializer, IdentifiersSerializer, UserProfileUpdateSerializer)
import datetime, jwt
from django.views.decorators.http import require_GET
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from django.conf import settings
from django.http import JsonResponse
from functools import wraps
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from django.utils import timezone

class BaseProtectedview(APIView):
    def get_user_from_token(self):
        token = self.request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated!')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
            return User.objects.get(username=payload['username'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
        

class ProtectedView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        return Response({
            'message': 'Protected content',
            'user': user.username
        })
        
        
class RegisterView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
        return Response(serializer.data)


class LoginView(APIView):
    def post(self, request):
        username = request.data['username']
        password = request.data['password']

        if not username or not password:
            raise AuthenticationFailed('Username and password are required')
        
        try:
            user = User.objects.get(username=username)
        except User.DoesNotExist:
            raise AuthenticationFailed('User not found')
        
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')
        
        
         # Update last_login field
        user.last_login = datetime.datetime.today().date() # Update last_login to current time
        user.save()  # Save the user instance to persist the change
        

        # JWT payload
        payload = {
            'username': user.username,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(minutes=60),  # Set token expiration time
            'iat': datetime.datetime.utcnow()  # Issued at time
        }

        # Encode JWT
        token = jwt.encode(payload, 'secret', algorithm='HS256')

        response = Response()
        # Set token in cookie (httpOnly)
        response.set_cookie(key='jwt', value=token, httponly=True)

        response.data = {
            'jwt': token
        }

        return response


class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')  # Clear the JWT token cookie
        response.data = {
            'message': 'success'
        }
        return response


class HomePageView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        num_list = []
        for i in range(5):
            num = random.randint(1, 1000)
            num_list.append(num)
        
        print(num_list)
        
        speices_image = []
        
        for i in num_list:
            try:
                speices = All_Species.objects.get(id=i)
                
                if speices.image and speices.common_name:
                    speices_image.append({
                        'common_name': speices.common_name if speices.common_name != 'Not provided' else "",
                        'image': speices.image,
                    })
            except ObjectDoesNotExist:
                continue

        serializer = HomePageSerializer(speices_image, many=True)
        
        response = {
                'message': 'Random five images',
                'data': serializer.data,
                'user': user.username
            }
        
        return Response(response)
        

class ExplorePageView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
         # Fetch all species from the database
        total_species = Protozoa.objects.values('image','latitude','longitude','user_id')
        
        
        # Serialize the data
        serializer = AllSpeciesSerializers(total_species, many=True) # many required when serializing multiple reocrds
        
        # Return the serialized data in the response
        response = {
            'mesaage': 'Explore page content',
            'data': serializer.data,
            'user': user.username,
        }
        
        return Response(response)


class ObserversCountView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        all_users = User.objects.all()
        observations_count = []

        for u in all_users:
            count = All_Species.objects.filter(user_id=u.username).count()
            observations_count.append({
                'username': u.username,
                'count': count,
            })  
        
        
        # Pass the observations_count to the serializer
        serializer = ObserversCountSerializers(data=observations_count, many=True)
        
        
        if serializer.is_valid():
            response = {
                'message': 'Observers and their count',
                'data': serializer.data,
                'length': len(observations_count),
                'user': user.username,
            }
            return Response(response)
        
        return Response(serializer.errors, status=400)
    

class SpeciesCountView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        models_name = [Amphibia, Plantae, Protozoa, Aves, Actinopterygii, Insecta]
        
        species_count = []
    
        for i in models_name:
            # Group species by common_name and count the occurrences
            species = i.objects.values('common_name', 'scientific_name').annotate(observations_count=Count('common_name'))

            
            for s in species:
                # Fetch species details including the image based on common_name
                species_details = i.objects.filter(common_name=s['common_name']).first()  # Get the first instance for the common_name
                
                species_count.append({
                    'common_name': s['common_name'],
                    'scientific_name': s['scientific_name'],
                    'image': species_details.image,  # Pass image as a URL
                    'observations_count': s['observations_count'],  # Attach count of occurrences
                })

        # Use the serializer to serialize the response data
        serializer = SpeciesCountSerializers(species_count, many=True)

        response = {
            'message': 'Species and their count',
            'data': serializer.data,  # Serializer data contains the species count details
            'length': len(species_count),
            'user': user.username,
        }
        
        return Response(response)


class IdentifiersView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        identifiers = User.objects.all().values('username', 'identifications').order_by('-identifications')

        total_identifications = User.objects.aggregate(total=Sum('identifications'))['total'] or 0

        serializer = IdentifiersSerializer(identifiers, many=True)

        response = {
            'message': 'Users and their identifiers count',
            'data': serializer.data,
            'total_identifications': total_identifications,
            'user': user.username
        }

        return Response(response)


class UserProfileView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        # User.objects.datetimes
        
        observations = All_Species.objects.filter(user_id=user.username).count()
        
        # Format dates to remove "T"
        date_joined = user.date_joined.date().isoformat().replace('T', ' ')
        last_active = user.last_login.date().isoformat().replace('T', ' ')

        data = {
            'observations': observations,
            'username': user.username,
            'date_joined': date_joined,
            'last_active': last_active,
            'identified': user.identifications,
        }
        
        response = {
            'message': 'user profile details',
            'data': data
        }
        
        return Response(response)



class ProfileUpdateView(BaseProtectedview):
    def post(self, request):
        # Get the user from the token
        user = self.get_user_from_token()
        
        
        about = request.data.get('about', None)  

        if about is None:
            return Response({"error": "The 'about' field is required."}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user.about = about
            user.save()

            serializer = UserProfileUpdateSerializer(user)
            
            return Response({
                "success": "Profile updated successfully.",
                "user": serializer.data  
            }, status=status.HTTP_200_OK)

        except Exception as e:
            # Handle any unexpected errors during the save process
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)



# class SpeciesDetailsView(BaseProtectedview):
#     def get(self, request):
#         user = self.get_user_from_token()
        
        