from django.urls import path
from .views import (RegisterView, LoginView, ExplorePageView , Logout, ProtectedView, HomePageView, ObserversCountView, SpeciesCountView, IdentifiersView, UserProfileView, ProfileUpdateView)

urlpatterns = [
    path('verify-token', ProtectedView.as_view(), name='verify-token'),
    path('register', RegisterView.as_view(), name='register'),
    path('login', LoginView.as_view(), name='login'),
    path('logout', Logout.as_view(), name='logout'),
    
    path('home_page', HomePageView.as_view(), name='home_page'),
    
    path('explore', ExplorePageView.as_view(), name='explore'),
    path('total-observers', ObserversCountView.as_view(), name='total-observers'),
    path('species-count', SpeciesCountView.as_view(), name='species-count'),
    path('identifiers', IdentifiersView.as_view(), name='identifiers'),
    
    path('user_profile', UserProfileView.as_view(), name='user_prfile'),
    path('profile_update', ProfileUpdateView.as_view(), name='profile_update'),
    
]




