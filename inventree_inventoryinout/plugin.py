# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from plugin import InvenTreePlugin
from plugin.mixins import UrlsMixin, NavigationMixin
from django.utils.translation import gettext_lazy as _

class InventoryInOutPlugin(UrlsMixin, NavigationMixin, InvenTreePlugin):
    NAME = "Inventar in / Out"
    SLUG = "inventory-in-out"
    TITLE = _("Inventar In / Out")
    DESCRIPTION = _("Schnelles Massen-Buchen von Beständen per IPN-Scan (IN/OUT).")
    AUTHOR = "GrischaMedia"
    VERSION = "0.3.5"
    PUBLIC = True
    NAVIGATION = [
        {
            "name": _("Inventar In / Out"),
            "link": "plugin:inventory-in-out:index", 
            "icon": "fa-upload",
            "roles": ["topbar", "sidebar"],
        }
    ]

    def setup_urls(self):
        from . import urls
        return urls.urlpatterns
