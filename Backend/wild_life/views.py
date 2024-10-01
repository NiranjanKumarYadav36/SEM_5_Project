import random
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import *
from .serializers import (UserSerializer, AllSpeciesSerializers, ObserversCountSerializers, SpeciesCountSerializers,
                          HomePageSerializer, IdentifiersSerializer, UserProfileUpdateSerializer, SpeciesIdentifications, 
                          SpeciesDetailsSerializer, get_species_serializer)
import datetime, jwt
from rest_framework import status
from django.db.models import Count, Subquery, OuterRef, F
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


class DashboardView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        response = {
            "message": "Dashboard details",
            "username": user.username,
        }
        
        return Response(response)


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
        total_species = Protozoa.objects.values('image', 'latitude', 'longitude', 'common_name', 'id')
        
        
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


class SpeciesCountView(BaseProtectedview):
    def get(self, request):
        # Get the user from the request token
        user = self.get_user_from_token()

        # List of models to query
        models_name = [
            Amphibia, Plantae, Protozoa, Aves, Actinopterygii, 
            Insecta, Arachnida, Mammalia, Mollusca, Reptilia
        ]
        
        # Dictionary to store unique species by common name
        unique_species = {}

        # Iterate through each model to get species count grouped by common name
        for model in models_name:
            # Group species by common_name and count the occurrences in the current model
            species = model.objects.values('common_name', 'scientific_name', 'image').annotate(observations_count=Count('common_name'))

            # Iterate through the grouped species
            for s in species:
                common_name = s['common_name']
                
                # If the species is already in the dictionary, update the count
                if common_name in unique_species:
                    unique_species[common_name]['observations_count'] += s['observations_count']
                else:
                    # Add new species entry with the first occurrence of image and other details
                    unique_species[common_name] = {
                        'common_name': common_name,
                        'scientific_name': s['scientific_name'],
                        'image': s['image'],  # Store the first image found for this species
                        'observations_count': s['observations_count'],
                    }

        # Convert the dictionary to a list for serialization
        species_count = list(unique_species.values())

        # Create an instance of the custom paginator
        paginator = CustomPagination()
        
        # Paginate the results using the custom paginator
        paginated_species = paginator.paginate_queryset(species_count, request)

        # Use the serializer to serialize the paginated data
        serializer = SpeciesCountSerializers(paginated_species, many=True)

        # Return paginated response using the custom paginator's get_paginated_response method
        return paginator.get_paginated_response(serializer.data)


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
        
        date_joined = None
        last_active = None

        if hasattr(user, 'date_joined'):
            date_joined = user.date_joined.date() if user.date_joined else None
        
        if hasattr(user, 'last_login'):
            last_active = user.last_login.date() if user.last_login else None

        identified_count = getattr(user, 'identifications', 0)  # Default to 0 if not present
        
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

        species_id = request.GET.get('id')

        if not species_id:
            return Response({'message': 'Missing query parameters'}, status=status.HTTP_400_BAD_REQUEST)


        species = All_Species.objects.filter(id=species_id).first()
        
        
        if not species:
            return Response({'message': 'Species not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = SpeicesDetailsSerializer(species, many=False)
    
        response = {
            'message': 'Species details fetched successfully',
            'data': serializer.data,
            'user': user.username,
        }

        return Response(response)

 
class CoummnityPeopleView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        observations_count = (
            All_Species.objects
            .select_related('user')  
            .values('user_id')
            .annotate(
                observations_count=Count('id'),
                identifications=F('user__identifications'),
                last_login=F('user__last_login')
            )
            .order_by('-identifications', '-last_login', '-observations_count')[:10]  
        )

        observations_list = [
            {
                'username': item['user_id'],
                'identifications': item['identifications'],
                'observations_count': item['observations_count'],
                'last_active': item['last_login'].date() if item['last_login'] else None
            }
            for item in observations_count
        ]

        return Response({'observations': observations_list})


class SpeciesIdentificationListView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        species_details = All_Species.objects.values('image', 'common_name', 'scientific_name', 'no_identification_agreement', 'no_identification_disagreement', 'user_id')
        
        paginator = CustomPagination()
        paginated_data = paginator.paginate_queryset(species_details, request)
        
        serializer = SpeciesIdentifications(paginated_data, many=True)
        
        return Response(serializer.data)

    def post(self, request):
        user = self.get_user_from_token()
        
        user_id = request.data.get('user')
        image =  request.data.get('image')
        scientific_name = request.data.get('scientific_name')
        option = request.data.get('option')
        
         # Check if all necessary fields are provided
        if not all([user_id, image, scientific_name, option]):
            return Response({"message": "Missing data"}, status=400)

        species = All_Species.objects.filter(user_id=user_id, image=image, scientific_name=scientific_name).first()
            
        if species:
            user.identifications += 1
            if option == 'yes':
                species.no_identification_agreement += 1
            elif option == 'no':
                species.no_identification_disagreement += 1

            species.save()
            user.save()
            
            response = {
                'message': "identifed sucssfully"
            }
        
            return Response(response)
        
        return Response({"message": "Species not found"}, status=404) 


class SpeciesDetailsView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()

        species_id = request.GET.get('id')

        if not species_id:
            return Response({'message': 'Missing query parameters'}, status=status.HTTP_400_BAD_REQUEST)

        species = All_Species.objects.filter(id=species_id).first()

        if not species:
            return Response({'message': 'Species not found'}, status=status.HTTP_404_NOT_FOUND)

        serializer = SpeciesDetailsSerializer(species)

        response = {
            'message': 'Species details fetched successfully',
            'data': serializer.data,
            'user': user.username,
        }

        return Response(response, status=status.HTTP_200_OK)




class FilteredView(BaseProtectedview):
    def get(self, request):
        user = self.get_user_from_token()
        
        category = request.query_params.get('category')
        state = request.query_params.get('location')
        username = request.query_params.get('username')
        
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
        

        filter_criteria = {}
        if state:
            filter_criteria['state'] = state
        if username:
            filter_criteria['user_id__username'] = username  
        
                    
        # Determine the queryset to be used based on the category
        if category and category in category_model_mapping:
            model = category_model_mapping[category]
            query_set = model.objects.filter(**filter_criteria)
        else:
            model = All_Species
            query_set = model.objects.filter(**filter_criteria)
            
        # Serialize the queryset
        # serializer = BaseSpeciesSerializer(query_set, many=True)
        
         # Use the dynamic serializer based on the model
        serializer_class = get_species_serializer(model)
        serializer = serializer_class(query_set, many=True)
        
        return Response(serializer.data)

     