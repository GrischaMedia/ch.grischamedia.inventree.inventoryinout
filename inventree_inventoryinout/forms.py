# Copyright (C) 2025 GrischaMedia.ch
# Author: Sandro Geyer
# SPDX-License-Identifier: GPL-3.0-or-later

from django import forms
from django.utils.translation import gettext_lazy as _

class ScanForm(forms.Form):
    scan = forms.CharField(
        label=_("IPN scannen"),
        help_text=_("Gib eine IPN ein oder scanne sie mit dem Handscanner."),
        required=False,
        widget=forms.TextInput(attrs={
            "class": "form-control",
            "placeholder": _("IPN einscannen…"),
            "autocomplete": "off",
        }),
    )
