# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from plugin.apps import InvenTreePluginConfig

class InventoryInOutConfig(InvenTreePluginConfig):
    name = "inventree_inventoryinout"
    verbose_name = "Inventar In / Out"

    PLUGIN_NAME = "Inventar In / Out"
    PLUGIN_SLUG = "inventory-in-out"
    PLUGIN_AUTHOR = "GrischaMedia"
    PLUGIN_VERSION = "0.4.7"
    PLUGIN_DESCRIPTION = "Schnelles Massen-Buchen von Beständen per IPN-Scan (IN/OUT)."