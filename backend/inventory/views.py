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
from django.db.models import Q
from django.contrib.auth.models import User

class CurrentUserView(APIView):
    permission_classes = [IsAuthenticated]  

    def get(self, request):
        user = request.user
        return Response({
            'id': user.id,
            'username': user.username,
            'email': user.email
        })

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
        # アイテムを作成する際に、ユーザーを所有者として設定
        serializer.save(owner=self.request.user)

    def perform_update(self, serializer):
        # アイテムを更新する際に、ユーザーが所有者か確認
        item = self.get_object()
        if item.owner != self.request.user:
            return Response({'detail': 'このアイテムの編集権限がありません。'}, status=status.HTTP_403_FORBIDDEN)
        serializer.save(owner=self.request.user)

    def perform_destroy(self, instance):
        # アイテムを削除する際にもユーザーが所有者か確認
        if instance.owner != self.request.user:
            return Response({'detail': 'このアイテムの削除権限がありません。'}, status=status.HTTP_403_FORBIDDEN)
        instance.delete()

    def get_queryset(self):
        queryset = Item.objects.all()
        
        # フィルターパラメータを取得
        location = self.request.query_params.get('location', None)
        tag = self.request.query_params.get('tag', None)
        group = self.request.query_params.get('group', None)

        if location:
            queryset = queryset.filter(location=location)
        if tag:
            queryset = queryset.filter(tags__id=tag)
        if group:
            queryset = queryset.filter(group=group)

        return queryset