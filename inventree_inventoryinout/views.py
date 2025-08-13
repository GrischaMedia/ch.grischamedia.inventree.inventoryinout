# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from django.views.generic import TemplateView
from django.contrib.auth.mixins import LoginRequiredMixin
from django.utils.translation import gettext as _
from django.http import JsonResponse, HttpResponseBadRequest
from django.middleware.csrf import get_token

from .forms import ScanForm

from part.models import Part
from stock.models import StockItem, StockLocation

def location_path(loc: StockLocation) -> str:
    parts = []
    node = loc
    while node is not None:
        parts.append(node.name)
        node = node.parent
    return " / ".join(reversed(parts))

class InventoryInOutView(LoginRequiredMixin, TemplateView):
    template_name = "inventree_inventoryinout/index.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["form"] = ScanForm()
        ctx["csrf_token"] = get_token(self.request)
        return ctx

    def post(self, request, *args, **kwargs):
        action = request.POST.get("action")
        if action == "lookup_ipn":
            ipn = (request.POST.get("ipn") or "").strip()
            if not ipn:
                return HttpResponseBadRequest("Missing IPN")

            part = Part.objects.filter(IPN=ipn).first()
            if not part:
                return JsonResponse({"ok": False, "error": _("Kein Teil mit dieser IPN gefunden.")})

            items = []
            qs = StockItem.objects.filter(part=part)
            for si in qs.select_related("location"):
                items.append({
                    "stockitem": si.pk,
                    "part": part.pk,
                    "ipn": part.IPN,
                    "name": part.name,
                    "location": location_path(si.location) if si.location else _("(Kein Lagerort)"),
                    "location_id": si.location_id,
                    "quantity": float(si.quantity),
                    "units": getattr(part, "units", "") or "",
                })

            if not items:
                default_loc = part.default_location
                items.append({
                    "stockitem": None,
                    "part": part.pk,
                    "ipn": part.IPN,
                    "name": part.name,
                    "location": location_path(default_loc) if default_loc else _("(Kein Standard-Lagerort)"),
                    "location_id": default_loc.pk if default_loc else None,
                    "quantity": 0,
                    "units": getattr(part, "units", "") or "",
                })

            return JsonResponse({"ok": True, "rows": items})

        return HttpResponseBadRequest("Unknown action")
