📦 InvenTree Plugin: Inventory In/Out

Dieses Repository enthält ein InvenTree-Plugin, das eine benutzerfreundliche Oberfläche zum Buchen von Lagerbewegungen (Warenein- und -ausgänge) bereitstellt. Ziel ist es, die Inventarverwaltung in InvenTree zu vereinfachen, indem Barcodes / IPNs gescannt und direkt Bestände gebucht werden können.

⸻

✨ Features
	•	📥 Einfache Wareneingänge und -ausgänge über ein zentrales Formular
	•	📷 Barcode-/IPN-Scan zur schnellen Produktsuche
	•	🏷️ Anzeige von Produktinformationen (IPN, Name, Lagerpfad, aktueller Bestand)
	•	➕➖ Mengenbuchungen für IN / OUT
	•	📝 Freitextfeld für Buchungsnotizen (z. B. Wareneingang 123)
	•	✅ Integration in das InvenTree-Frontend (Navigation, Styles, Breadcrumbs)
	•	🔄 Rücksetzen-Funktion zum schnellen Leeren der Tabelle

⸻

📂 Projektstruktur

inventree_inventoryinout/
├── __init__.py
├── plugin.py              # Plugin-Definition (Integration in InvenTree)
├── urls.py                # URL-Routing des Plugins
├── views.py               # Views & Logik
├── templates/
│   └── inventree_inventoryinout/
│       └── index.html     # Frontend-Template
├── static/
│   └── inventree_inventoryinout/
│       ├── inout.js       # JavaScript-Logik (API-Aufrufe, UI)
│       └── inout.css      # Optional: eigene Styles


⸻

⚙️ Installation

1. Plugin in das Plugin-Verzeichnis kopieren

Das Verzeichnis inventree_inventoryinout in den InvenTree-Plugin-Ordner legen:

/home/inventree/plugins/

Alternativ über Git klonen:

cd /home/inventree/plugins
git clone https://github.com/GrischaMedia/ch.grischamedia.inventree.inventoryinout.git

2. Plugin aktivieren

Im InvenTree-Backend anmelden und das Plugin in den Einstellungen → Plugins aktivieren.

3. Statische Dateien sammeln

Nach der Installation ausführen:

cd /home/inventree/src/backend/InvenTree
python manage.py collectstatic --noinput

4. Server neu starten

Damit alle Änderungen aktiv werden:

docker restart inventree-server


⸻

🚀 Nutzung
	•	Navigation: Über das Menü unter Inventar → In/Out erreichbar
	•	Scan-Feld: Barcode oder IPN eingeben → Produkt wird geladen
	•	Mengen eintragen für IN oder OUT
	•	Optional: Notiz hinzufügen
	•	Mit Buchen bestätigen → Bestände werden über die API (/api/stock/add & /api/stock/remove) angepasst

⸻

🛠️ Entwicklung

Lokale Anpassungen
	•	Templates liegen unter templates/inventree_inventoryinout/
	•	JavaScript unter static/inventree_inventoryinout/inout.js
	•	API-Calls gehen gegen InvenTree-Stock-Endpunkte

Debugging
	•	Browser-Konsole (F12 → Console) für API-Fehler prüfen
	•	Netzwerk-Tab (F12 → Network) zeigt Requests & Payloads
	•	InvenTree-Logs im Container prüfen:

docker logs -f inventree-server


⸻

📜 Lizenz

Dieses Projekt steht unter der GPL-3.0

⸻

👤 Autor

GrischaMedia | Sandro Geyer
https://grischamedia.ch