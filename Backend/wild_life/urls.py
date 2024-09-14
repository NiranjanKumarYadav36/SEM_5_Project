from django.urls import path
from .views import RegisterView, LoginView, UserView, Logout, ProtectedView

urlpatterns = [
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('user_view', UserView.as_view(), name='user_view'),
    path('logout', Logout.as_view(), name='logout'),
    path('verify-token', ProtectedView.as_view(), name='verify-token'),
]

