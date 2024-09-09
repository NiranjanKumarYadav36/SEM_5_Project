from rest_framework.views import APIView
from rest_framework.response import Response
from .models import * # ()
from .serializers import *



class ItemListCreateView(APIView):
    # Handle GET requests (list items)
    def get(self, request):
        items = Item.objects.all()
        serializer = ItemSerializers(items, many=True)
        return Response(serializer.data)
