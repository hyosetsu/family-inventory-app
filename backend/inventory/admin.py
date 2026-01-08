from django.contrib import admin
from .models import Location, Tag, Item, ItemImage, ItemGroup

admin.site.register(Location)
admin.site.register(Tag)
admin.site.register(Item)
admin.site.register(ItemImage)
admin.site.register(ItemGroup)