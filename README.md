# Inventar In / Out (InvenTree 0.18)

Schnelles Massen-Buchen per IPN-Scan (DE/EN).

## Funktionen
- IPN scannen → zeigt Teil(e), kompletter Lagerpfad, aktueller Bestand
- Pro Zeile IN/OUT-Mengen eingeben
- Sammel-Buchung (IN/OUT) inkl. Notiz → landet in der History

## Installation (GitHub direkt)
```bash
pip install --upgrade git+https://github.com/DEINUSERNAME/inventree-inventory-inout.git
```

## Manuell (lokales Repo)
```bash
git clone https://github.com/DEINUSERNAME/inventree-inventory-inout.git
cd inventree-inventory-inout
pip install .
```

## Aktivieren in InvenTree
- InvenTree neu starten
- Einstellungen → Plugins → „Inventar In / Out“ aktivieren

## Entwicklung / Übersetzung
Optional Sprachen kompilieren:
```bash
django-admin compilemessages
```

## Lizenz
MIT
