(function() {
  var scanInput = document.getElementById('scan-input');
  var scanBtn = document.getElementById('scan-btn');
  var tableBody = document.querySelector('#io-table tbody');
  var bookBtn = document.getElementById('book-btn');
  var clearBtn = document.getElementById('clear-btn');

  function addRow(row) {
    var tr = document.createElement('tr');
    tr.dataset.part = row.part;
    tr.dataset.stockitem = row.stockitem || '';
    tr.dataset.location = row.location_id || '';

    tr.innerHTML = [
      '<td>' + (row.ipn || '') + '</td>',
      '<td>' + (row.name || '') + '</td>',
      '<td>' + (row.location || '') + '</td>',
      '<td class="text-right">' + (row.quantity || 0) + ' ' + (row.units || '') + '</td>',
      '<td><input type="number" step="any" min="0" class="form-control input-sm in-field" placeholder="0"></td>',
      '<td><input type="number" step="any" min="0" class="form-control input-sm out-field" placeholder="0"></td>',
      '<td><button class="btn btn-xs btn-link remove-row" title="Remove"><i class="fa fa-trash"></i></button></td>'
    ].join('');

    tableBody.prepend(tr);
  }

  function lookupIPN(ipn) {
    var form = new FormData();
    form.append('action', 'lookup_ipn');
    form.append('ipn', ipn);

    return fetch(INOUT.endpoints.lookup, {
      method: 'POST',
      headers: { 'X-CSRFToken': INOUT.csrf },
      body: form,
      credentials: 'same-origin'
    }).then(r => r.json());
  }

  function postJSON(url, payload) {
    return fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': INOUT.csrf
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    }).then(r => r.json());
  }

  scanBtn.addEventListener('click', function() {
    var v = (scanInput.value || '').trim();
    if (!v) return;
    lookupIPN(v).then(resp => {
      if (!resp.ok) {
        alert(resp.error || 'Not found');
        return;
      }
      (resp.rows || []).forEach(addRow);
      scanInput.value = '';
      scanInput.focus();
    });
  });

  scanInput.addEventListener('keydown', function(e){
    if (e.key === 'Enter') {
      e.preventDefault();
      scanBtn.click();
    }
  });

  tableBody.addEventListener('click', function(e){
    if (e.target.closest('.remove-row')) {
      e.preventDefault();
      e.target.closest('tr').remove();
    }
  });

  clearBtn.addEventListener('click', function(){
    tableBody.innerHTML = '';
    document.getElementById('booking-notes').value = '';
  });

  bookBtn.addEventListener('click', async function(){
    var notes = document.getElementById('booking-notes').value || '';

    var rows = Array.from(tableBody.querySelectorAll('tr'));
    if (!rows.length) { alert('Keine Positionen'); return; }

    var adds = [];
    var removes = [];

    rows.forEach(function(tr){
      var part = tr.dataset.part;
      var stockitem = tr.dataset.stockitem;
      var location = tr.dataset.location;
      var inVal = parseFloat(tr.querySelector('.in-field').value || '0');
      var outVal = parseFloat(tr.querySelector('.out-field').value || '0');

      if (inVal > 0) {
        if (!stockitem && !location) {
          alert('Kein Lagerort bekannt (Part ohne Bestand & ohne Default-Lagerort). Bitte im Teil einen Default-Lagerort setzen.');
          return;
        }
        adds.push({
          items: stockitem ? [stockitem] : [],
          part: part,
          location: location || null,
          quantity: inVal,
          notes: notes
        });
      }
      if (outVal > 0) {
        if (!stockitem) {
          alert('OUT nur für existierende StockItems möglich.');
          return;
        }
        removes.push({
          items: [stockitem],
          quantity: outVal,
          notes: notes
        });
      }
    });

    async function processAdds() {
      for (let a of adds) {
        if (a.items.length) {
          await postJSON(INOUT.endpoints.add, {
            items: a.items,
            quantity: a.quantity,
            notes: a.notes
          });
        } else {
          await postJSON(INOUT.endpoints.list, {
            part: a.part,
            location: a.location,
            quantity: a.quantity,
            notes: a.notes
          });
        }
      }
    }

    async function processRemoves() {
      for (let r of removes) {
        await postJSON(INOUT.endpoints.remove, {
          items: r.items,
          quantity: r.quantity,
          notes: r.notes
        });
      }
    }

    try {
      await processAdds();
      await processRemoves();
      alert('Buchungen erfolgreich.');
      clearBtn.click();
    } catch (e) {
      console.error(e);
      alert('Fehler beim Buchen: ' + e);
    }
  });
})();
