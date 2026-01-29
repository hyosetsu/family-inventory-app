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
    # 🔽 書き込み用（ID）
    location = serializers.PrimaryKeyRelatedField(
        queryset=Location.objects.all(), allow_null=True, required=False
    )
    group = serializers.PrimaryKeyRelatedField(
        queryset=ItemGroup.objects.all(), allow_null=True, required=False
    )
    tags = serializers.PrimaryKeyRelatedField(
        queryset=Tag.objects.all(), many=True, required=False
    )

    # 🔽 読み取り用（object）
    location_detail = LocationSerializer(source="location", read_only=True)
    group_detail = ItemGroupSerializer(source="group", read_only=True)
    tags_detail = TagSerializer(source="tags", many=True, read_only=True)
    
    class Meta:
        model = Item
        fields = [
            "id",
            "name",
            "description",
            "location",
            "group",
            "tags",
            "location_detail",
            "group_detail",
            "tags_detail",
            "owner",
            "images",
            "created_at",
        ]
        read_only_fields = ["owner"]

    def update(self, instance, validated_data):
        tags = validated_data.pop("tags", None)

        # 通常フィールド更新
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        # ManyToMany は明示的に set()
        if tags is not None:
            instance.tags.set(tags)

        return instance