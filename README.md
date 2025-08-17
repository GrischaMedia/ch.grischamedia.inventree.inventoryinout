# Inventar In / Out für InvenTree

Dieses Plugin ermöglicht eine schnelle und effiziente Massenbuchung von Lagerbewegungen in InvenTree. Durch das Scannen von Barcodes (IPN) können Teile schnell gefunden und Ein- sowie Ausbuchungen direkt durchgeführt werden. So lassen sich Bestände unkompliziert und zeitsparend verwalten.

Das Plugin unterstützt das Scannen von Teilenummern, zeigt den vollständigen Lagerpfad sowie den aktuellen Bestand an und erlaubt die Eingabe von Mengen für Ein- und Ausbuchungen pro Zeile. Mehrere Buchungen können gesammelt mit einer Notiz versehen und anschließend in der Historie gespeichert werden.

<img width="1126" height="634" alt="image" src="https://github.com/user-attachments/assets/aee89616-09da-4416-82e0-9b62426695f3" />


## Installation

Die Installation kann direkt über GitHub erfolgen. Verwenden Sie dazu den folgenden Befehl:

```bash
pip install --upgrade git+https://github.com/GrischaMedia/ch.grischamedia.inventree.inventoryinout.git
```

Alternativ kann das Plugin auch manuell installiert werden, indem Sie das Repository klonen und lokal installieren:

```bash
git clone https://github.com/GrischaMedia/ch.grischamedia.inventree.inventoryinout.git
cd inventree-inventory-inout
pip install .
```

## Konfiguration

Für den Betrieb des Plugins können folgende Umgebungsvariablen in Ihrer `.env`-Datei gesetzt werden:

- `INVENTREE_PLUGINS_ENABLED`: Aktiviert die Plugin-Unterstützung in InvenTree.
- `INVENTREE_HEADLESS_ONLY`: Bestimmt, ob InvenTree nur im Headless-Modus laufen soll.
- `INVENTREE_FRONTEND_URL_BASE`: Legt die Basis-URL für das Frontend fest.

Passen Sie diese Variablen entsprechend Ihrer Umgebung an, um eine reibungslose Integration zu gewährleisten.

## Aktivierung in InvenTree

Nach der Installation starten Sie InvenTree neu. Anschließend können Sie das Plugin in den Einstellungen unter „Plugins“ aktivieren, indem Sie „Inventar In / Out“ auswählen.

## Nutzungshinweise

Nach der Aktivierung finden Sie das Plugin in der Navigation von InvenTree. Dort können Sie per Barcode-Scan Teile suchen, Mengen für Ein- oder Ausbuchungen eingeben und die Buchungen gesammelt mit einer optionalen Notiz speichern. Die Historie zeigt alle getätigten Buchungen übersichtlich an.

## Für Entwickler

Bei Änderungen an den Übersetzungen können die Sprachdateien mit folgendem Befehl kompiliert werden:

```bash
django-admin compilemessages
```

## Lizenz

Dieses Plugin steht unter der Lizenz GPL-3.0-or-later.
