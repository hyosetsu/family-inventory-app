from rest_framework import viewsets
from .models import Item, Location, Tag, ItemGroup, ItemImage
from .serializers import (
    LocationSerializer, TagSerializer, ItemGroupSerializer, ItemSerializer
)
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status

class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

class ItemGroupViewSet(viewsets.ModelViewSet):
    queryset = ItemGroup.objects.all()
    serializer_class = ItemGroupSerializer

class ItemImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, item_id):
        item = Item.objects.get(pk=item_id)
        if item.owner != request.user:
            return Response({'detail': '権限がありません'}, status=403)

        image_file = request.FILES.get('image')
        if not image_file:
            return Response({'detail': '画像ファイルが必要です'}, status=400)

        item_image = ItemImage.objects.create(item=item, image=image_file)
        return Response({'id': item_image.id, 'image': item_image.image.url}, status=201)

class ItemViewSet(viewsets.ModelViewSet):
    queryset = Item.objects.all()
    serializer_class = ItemSerializer
    permission_classes = [IsAuthenticated]  # 後でJWT or Session連携

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        serializer.save(owner=self.request.user)
