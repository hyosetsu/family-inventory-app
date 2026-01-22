from rest_framework import serializers
from .models import Item, Location, Tag, ItemGroup, ItemImage

class LocationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Location
        fields = '__all__'

class TagSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tag
        fields = '__all__'

class ItemGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemGroup
        fields = '__all__'

class ItemImageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemImage
        fields = ['id', 'image', 'uploaded_at']

class ItemSerializer(serializers.ModelSerializer):
    images = ItemImageSerializer(many=True, read_only=True)
    location = LocationSerializer() 
    group = ItemGroupSerializer()   
    tags = TagSerializer(many=True) 
    
    class Meta:
        model = Item
        fields = "__all__"
        read_only_fields = ["owner"]
    
    def get_images(self, obj):
        return [img.image.url for img in obj.images.all()]