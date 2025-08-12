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
    PUBLISH_DATE = "2025-08-12"
    VERSION = "0.3.1"
    WEBSITE = "https://grischamedia.ch"
    LICENSE = "MIT"
    PUBLIC = True

    NAVIGATION = [
        {
            "name": _("Inventar In / Out"),
            "link": "plugin:inventoryinout-index",
            "icon": "fa-upload",
        }
    ]

    def setup_urls(self):
        from . import urls
        return urls.urlpatterns
