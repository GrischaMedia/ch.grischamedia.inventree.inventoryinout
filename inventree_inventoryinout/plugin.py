# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: MIT

from plugin import InvenTreePlugin
from plugin.mixins import UrlsMixin, NavigationMixin
from django.utils.translation import gettext_lazy as _


class InventoryInOutPlugin(UrlsMixin, NavigationMixin, InvenTreePlugin):
    """Top-level plugin entry for Inventar In / Out."""

    NAME = "Inventar in / Out"
    SLUG = "inventory-in-out"
    TITLE = _("Inventar In / Out")
    DESCRIPTION = _("Schnelles Massen-Buchen von Beständen per IPN-Scan (IN/OUT).")
    AUTHOR = "GrischaMedia"
    VERSION = "0.4.19"
    WEBSITE = "https://grischamedia.ch"
    LICENSE = "MIT"
    PUBLIC = True

    # Eintrag in die Navigation (Topbar + Sidebar)
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