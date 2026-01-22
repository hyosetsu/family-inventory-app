from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import (
    ItemViewSet, LocationViewSet, TagViewSet, ItemGroupViewSet,
    ItemImageUploadView, CurrentUserView
)

router = DefaultRouter()
router.register(r'items', ItemViewSet)
router.register(r'locations', LocationViewSet)
router.register(r'tags', TagViewSet)
router.register(r'groups', ItemGroupViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('items/<int:item_id>/upload_image/', ItemImageUploadView.as_view()),
    path('users/me/', CurrentUserView.as_view(), name='current_user'),
]