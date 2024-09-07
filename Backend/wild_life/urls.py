from django.urls import path
from .views import *

urlpatterns = [
    path('', ItemList.as_view(), name='item-list'),
]

