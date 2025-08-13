# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from django.urls import path
from . import views

app_name = "inventoryinout"

urlpatterns = [
    path("", views.InventoryInOutView.as_view(), name="index"),
]