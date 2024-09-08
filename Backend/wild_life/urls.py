from django.urls import path
from .views import *

urlpatterns = [
    path('', ItemListCreateView.as_view(), name='item-list'),
]

