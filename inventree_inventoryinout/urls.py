from django.urls import path
from . import views

app_name = "inventoryinout"

urlpatterns = [
    path("", views.InventoryInOutView.as_view(), name="index"),
]
