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
from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator

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
            num = random.randint(1, 520000)
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
        total_species = All_Species.objects.values('image', 'latitude', 'longitude', 'common_name', 'user_id', 'category')[:40000:4]
        
        
        # Serialize the data
        serializer = AllSpeciesSerializers(total_species, many=True) # many required when serializing multiple reocrds
        
        # Return the serialized data in the response
        response = {
            'mesaage': 'Explore page content',
            'data': serializer.data,
            'user': user.username,
        }
        
        return Response(response)


class CustomPagination(PageNumberPagination):
    page_size_query_param = 'page_size'
    max_page_size = 100  
    
    def get_paginated_response(self, data):
        return Response({
            'count': self.page.paginator.count,
            'total_pages': self.page.paginator.num_pages,
            'current_page': self.page.number,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'results': data
        })

    
    
class ObserversCountView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        observations_count = (
            All_Species.objects
            .values('user_id')                           
            .annotate(observation_count=Count('id'))     
            .order_by('-observation_count')                         
        )

        observations_list = [
            {'username': item['user_id'], 'count': item['observation_count']}
            for item in observations_count
        ]


        # Apply pagination to the results
        paginator = CustomPagination()
        paginated_data = paginator.paginate_queryset(observations_list, request)


        serializer = ObserversCountSerializers(paginated_data, many=True)

        return paginator.get_paginated_response(serializer.data)


# class SpeciesCountView(BaseProtectedview):
#     def get(self, request):
#         user = self.get_user_from_token()

#         models_name = [Amphibia, Plantae, Protozoa, Aves, Actinopterygii, Insecta, Arachnida, Mammalia, Mollusca, Reptilia]
        
#         species_count = []

#         for model in models_name:
#             # Group species by common_name and count the occurrences
#             species = model.objects.values('common_name', 'scientific_name', 'image').annotate(observations_count=Count('common_name'))

#             for s in species:
#                 species_count.append({
#                     'common_name': s['common_name'],
#                     'scientific_name': s['scientific_name'],
#                     'image': s['image'],  # Directly access image from values()
#                     'observations_count': s['observations_count'],  # Attach count of occurrences
#                 })

#         # Use the serializer to serialize the response data
#         serializer = SpeciesCountSerializers(species_count, many=True)

#         # Paginate the results
#         paginator = CustomPagination()
#         paginated_species = paginator.paginate_queryset(serializer.data, request)
        
        
#         return paginator.get_paginated_response(paginated_species)


class IdentifiersView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        identifiers = User.objects.all().values('username', 'identifications').order_by('-identifications')

        paginator = CustomPagination()
        paginated_data = paginator.paginate_queryset(identifiers, request)

        
        serializer = IdentifiersSerializer(paginated_data, many=True)


        return paginator.get_paginated_response(serializer.data)


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
                'uploaded_by': species.user.username if species.user else 'Unknown'  
            })
        else:
            return Response({'message': 'Species not found'}, status=404)

        response = {
            'message': 'Species details fetched successfully',
            'data': species_details,
            'user': user.username,
        }

        return Response(response)
    
    
    











