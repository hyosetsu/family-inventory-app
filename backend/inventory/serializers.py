from rest_framework import serializers
from .models import Item, Location, Tag, ItemGroup, ItemImage

class ItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Item
        fields = '__all__'