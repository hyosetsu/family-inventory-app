from rest_framework import viewsets
from .models import Item, Location, Tag, ItemGroup, ItemImage
from .serializers import (
    LocationSerializer, TagSerializer, ItemGroupSerializer, ItemSerializer
)
from rest_framework.permissions import IsAuthenticated

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ItemGroupViewSet(viewsets.ModelViewSet):
    queryset = ItemGroup.objects.all()
    serializer_class = ItemGroupSerializer

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    # permission_classes = [IsAuthenticated]  # 後でJWT or Session連携
