# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from django.views.generic import TemplateView

class InventoryInOutView(TemplateView):
    template_name = "inventree_inventoryinout/index.html"