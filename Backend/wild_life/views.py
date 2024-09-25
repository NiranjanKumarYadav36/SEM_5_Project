import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
from .serializers import (UserSerializer, AllSpeciesSerializers, ObserversCountSerializers, SpeciesCountSerializers,
                          HomePageSerializer, IdentifiersSerializer, UserProfileUpdateSerializer)
import datetime, jwt
from rest_framework import status
from django.db.models import Count
from django.core.exceptions import ObjectDoesNotExist
from django.db.models import Sum
from decimal import Decimal

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
        total_species = Protozoa.objects.values('image', 'latitude', 'longitude', 'common_name', 'user_id', 'category')
        
        
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

        models_name = [Amphibia, Plantae, Protozoa, Aves, Actinopterygii, Insecta, Arachnida, Mammalia, Mollusca, Reptilia]
        
        species_count = []

        for model in models_name:
            # Group species by common_name and count the occurrences
            species = model.objects.values('common_name', 'scientific_name', 'image').annotate(observations_count=Count('common_name'))

            for s in species:
                species_count.append({
                    'common_name': s['common_name'],
                    'scientific_name': s['scientific_name'],
                    'image': s['image'],  # Directly access image from values()
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
                
        observations = All_Species.objects.filter(user_id=user.username).count()
        
        date_joined = user.date_joined.date()
        last_active = user.last_login.date()

        identified_count = user.identifications
        
        data = {
            'observations': observations,
            'username': user.username,
            'date_joined': date_joined,
            'last_active': last_active,
            'identifications': identified_count, 
            'bio': user.about
        }

        response = {
            'message': 'User profile details',
            'data': data
        }

        return Response(response, status=status.HTTP_200_OK)


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



class SpeciesDetailsView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        latitude = request.GET.get('latitude')
        longitude = request.GET.get('longitude')
        common_name = request.GET.get('common_name')
        category = request.GET.get('category')

        if not all([latitude, longitude, common_name, category]):
            return Response({'message': 'Missing query parameters'}, status=400)

        species_details = []

        category_model_mapping = {
            'Amphibia': Amphibia,
            'Actinopterygii': Actinopterygii,
            'Aves': Aves,
            'Plantae': Plantae,
            'Mollusca': Mollusca,
            'Mammalia': Mammalia,
            'Protozoa': Protozoa,
            'Insecta': Insecta,
            'Arachnida': Arachnida,
            'Reptilia': Reptilia,
        }


        try:
            latitude = Decimal(latitude)
            longitude = Decimal(longitude)
        except (TypeError, ValueError):
            return Response({'message': 'Invalid latitude or longitude'}, status=400)


        model = category_model_mapping.get(category)
        if not model:
            return Response({'message': 'Invalid category'}, status=400)


        species = model.objects.filter(common_name=common_name, latitude=latitude, longitude=longitude).first()

        if species:
            species_details.append({
                'common_name': species.common_name,
                'scientific_name': species.scientific_name,
                'species_name_guess': species.species_name_guess,
                'image': species.image.url,
                'latitude': species.latitude,
                'longitude': species.longitude,
                'observed_date': species.observed_date,
                'time_of_observation': species.time_observed_at,
                'no_identification_agreement': species.no_identification_agreement,
                'no_identification_disagreement': species.no_identification_disagreement,
                'city': species.city,
                'location': species.location,
                'state': species.state,
                'country': species.country,
                'uploaded_by': species.user.username if species.user else 'Unknown'  # Convert User to string (username)
            })
        else:
            return Response({'message': 'Species not found'}, status=404)

        response = {
            'message': 'Species details fetched successfully',
            'data': species_details,
            'user': user.username,
        }

        return Response(response)
