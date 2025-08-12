# Inventar In / Out (InvenTree 0.18)

Schnelles Massen‑Buchen per IPN‑Scan.

## Features
- IPN scannen → zeigt Teil(e) + Lagerpfad + aktuellen Bestand
- Pro Zeile IN/OUT Menge eingeben
- Sammel‑Buchung erzeugt Add/Remove-Transaktionen (mit Notiz)

## Installation
```bash
pip install .
```
> InvenTree → Einstellungen → Plugins → aktivieren.

## Rechte
Nur Benutzer mit entsprechenden Stock‑Rechten können buchen.

## Übersetzung
Deutsch/Englisch via `locale` (Django i18n).
