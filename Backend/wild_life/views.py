from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.exceptions import AuthenticationFailed
from .models import User
from .serializers import UserSerializer
import jwt, datetime


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

        user = User.objects.get(username=username).first()

        if user is None:
            raise AuthenticationFailed('User not found')
        if not user.check_password(password):
            raise AuthenticationFailed('Incorrect Password')

        # JWT payload
        payload = {
            'id': user.id,
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


class UserView(APIView):
    def get(self, request):
        token = request.COOKIES.get('jwt')

        if not token:
            raise AuthenticationFailed('Unauthenticated')

        try:
            payload = jwt.decode(token, 'secret', algorithms=['HS256'])
        except jwt.ExpiredSignatureError:
            raise AuthenticationFailed('Token has expired')
        except jwt.InvalidTokenError:
            raise AuthenticationFailed('Invalid token')

        # Retrieve user from the payload id
        user = User.objects.get(id=payload['id'])
        serializer = UserSerializer(user)

        return Response(serializer.data)


class Logout(APIView):
    def post(self, request):
        response = Response()
        response.delete_cookie('jwt')  # Clear the JWT token cookie
        response.data = {
            'message': 'success'
        }
        return response

