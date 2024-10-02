from django.urls import path
from .views import (RegisterView, LoginView, ExplorePageView , Logout, ProtectedView, 
                    HomePageView, ObserversCountView, SpeciesCountView, IdentifiersView, 
                    UserProfileView, ProfileUpdateView, SpeciesDetailsView, DashboardView,
                    CoummnityPeopleView, SpeciesIdentificationListView, FilteredView,
                    ReviewedListView, UserObseravtionView, AddObservationView)

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
    
    path('species_details', SpeciesDetailsView.as_view(), name='species_details'),
    
    
    path('user_profile', UserProfileView.as_view(), name='user_prfile'),
    path('user_profile/update', ProfileUpdateView.as_view(), name='profile_update'),
    
    path('user_dashboard', DashboardView.as_view(), name="user_dashboard"),
        
    path('community/people', CoummnityPeopleView.as_view(), name='community/people'),
    
    
    path('species_identifications/', SpeciesIdentificationListView.as_view(), name='species_identifications'),
    path('reviewed', ReviewedListView.as_view(), name='reviewed'),
    
    
    
    path('explore/filter', FilteredView.as_view(), name='filtered_view'),
    

    path('your_observation', UserObseravtionView.as_view(), name='your_observation'),
    path('add_observation', AddObservationView.as_view(), name='add_observation'),
        
]




