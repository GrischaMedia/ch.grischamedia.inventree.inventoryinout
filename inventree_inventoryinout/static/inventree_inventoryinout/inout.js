(function() {
  var scanInput = document.getElementById('scan-input');
  var scanBtn = document.getElementById('scan-btn');
  var tableBody = document.querySelector('#io-table tbody');
  var bookBtn = document.getElementById('book-btn');
  var clearBtn = document.getElementById('clear-btn');

  // ---- Helpers ----
  function setDisabled(el, v) {
    if (!el) return; el.disabled = !!v; el.classList.toggle('disabled', !!v);
  }

  function normQty(val) {
    if (typeof val === 'string') val = val.replace(',', '.').trim();
    const n = parseFloat(val);
    return (isNaN(n) || n <= 0) ? 0 : n;
  }

  function noteFields(notes) {
    // Some InvenTree endpoints accept "note", others "notes" – send both
    const p = {};
    if (notes !== undefined && notes !== null) {
      p.notes = notes;
      p.note = notes;
    }
    return p;
  }

  function extractErrors(payload) {
    if (!payload) return '';
    // Plain string
    if (typeof payload === 'string') return payload;
    // Common fields
    if (payload.detail || payload.error || payload.message) {
      return String(payload.detail || payload.error || payload.message);
    }
    // DRF-style field errors -> flatten
    try {
      const lines = [];
      const walk = (obj, prefix) => {
        if (Array.isArray(obj)) {
          obj.forEach((v, i) => walk(v, prefix + '[' + i + ']'));
        } else if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach(k => walk(obj[k], prefix ? prefix + '.' + k : k));
        } else if (obj !== undefined && obj !== null) {
          lines.push(prefix + ': ' + String(obj));
        }
      };
      walk(payload, '');
      return lines.join('\n');
    } catch (_) {
      try { return JSON.stringify(payload); } catch (e) { return String(payload); }
    }
  }

  async function fetchJSON(url, options) {
    const resp = await fetch(url, options || {});
    const contentType = resp.headers.get('content-type') || '';

    // Try to parse JSON if available, otherwise build a generic error
    let payload = null;
    if (contentType.includes('application/json')) {
      try { payload = await resp.json(); } catch (_) { payload = null; }
    } else {
      // Fallback to text for debugging
      try { payload = { detail: await resp.text() }; } catch (_) { payload = null; }
    }

    if (!resp.ok) {
      let msg = resp.status + ' ' + resp.statusText;
      const human = extractErrors(payload);
      if (human && human.trim()) {
        msg = human.trim();
      }
      const err = new Error(msg);
      err.status = resp.status;
      err.payload = payload;
      err.url = url;
      throw err;
    }
    return payload;
  }

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

    return fetchJSON(INOUT.endpoints.lookup, {
      method: 'POST',
      headers: { 'X-CSRFToken': INOUT.csrf },
      body: form,
      credentials: 'same-origin'
    });
  }

  function postJSON(url, payload) {
    console.log("POST to", url, "with payload:", payload);
    return fetchJSON(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-CSRFToken': INOUT.csrf
      },
      body: JSON.stringify(payload),
      credentials: 'same-origin'
    });
  }

  // ---- UI Handlers ----
  if (scanBtn) {
    scanBtn.addEventListener('click', async function() {
      var v = (scanInput.value || '').trim();
      if (!v) return;
      setDisabled(scanBtn, true);
      try {
        const resp = await lookupIPN(v);
        if (!resp || resp.ok === false) {
          alert((resp && (resp.error || resp.detail)) || 'Not found');
          return;
        }
        (resp.rows || []).forEach(addRow);
        scanInput.value = '';
        scanInput.focus();
      } catch (e) {
        console.error('Lookup error:', e);
        alert('Fehler beim Lookup: ' + (e.message || e));
      } finally {
        setDisabled(scanBtn, false);
      }
    });
  }

  if (scanInput) {
    scanInput.addEventListener('keydown', function(e){
      if (e.key === 'Enter') {
        e.preventDefault();
        if (scanBtn && !scanBtn.disabled) scanBtn.click();
      }
    });
  }

  if (tableBody) {
    tableBody.addEventListener('click', function(e){
      var btn = e.target.closest('.remove-row');
      if (btn) {
        e.preventDefault();
        btn.closest('tr').remove();
      }
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function(){
      tableBody.innerHTML = '';
      var notesEl = document.getElementById('booking-notes');
      if (notesEl) notesEl.value = '';
    });
  }

  if (bookBtn) {
    bookBtn.addEventListener('click', async function(){
      var notes = (document.getElementById('booking-notes') || {}).value || '';
      var rows = Array.from(tableBody.querySelectorAll('tr'));
      if (!rows.length) { alert('Keine Positionen'); return; }

      var adds = [];
      var removes = [];

      for (const tr of rows) {
        var part = tr.dataset.part;
        var stockitem = tr.dataset.stockitem;
        var location = tr.dataset.location;
        if (part) part = parseInt(part, 10);
        if (stockitem) stockitem = parseInt(stockitem, 10);
        if (location) location = parseInt(location, 10);
        var inVal = normQty(tr.querySelector('.in-field')?.value || '0');
        var outVal = normQty(tr.querySelector('.out-field')?.value || '0');

        if (Number.isNaN(inVal)) inVal = 0;
        if (Number.isNaN(outVal)) outVal = 0;

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
            ...noteFields(notes)
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
            ...noteFields(notes)
          });
        }
      }

      async function postAdd(items, quantity, notes) {
        try {
          return await postJSON(INOUT.endpoints.add, { items: items.map(Number), quantity, ...noteFields(notes) });
        } catch (e1) {
          if (e1.status !== 400) throw e1;
          const shaped = items.map(id => ({ pk: Number(id), quantity }));
          return await postJSON(INOUT.endpoints.add, { items: shaped, ...noteFields(notes) });
        }
      }

      async function postRemove(items, quantity, notes) {
        try {
          return await postJSON(INOUT.endpoints.remove, { items: items.map(Number), quantity, ...noteFields(notes) });
        } catch (e1) {
          if (e1.status !== 400) throw e1;
          const shaped = items.map(id => ({ pk: Number(id), quantity }));
          return await postJSON(INOUT.endpoints.remove, { items: shaped, ...noteFields(notes) });
        }
      }

      async function processAdds() {
        for (let a of adds) {
          if (a.items.length) {
            await postAdd(a.items, a.quantity, a.notes);
          } else {
            await postJSON(INOUT.endpoints.list, {
              part: Number(a.part),
              location: Number(a.location),
              quantity: a.quantity,
              status: 10,
              ...noteFields(a.notes)
            });
          }
        }
      }

      async function processRemoves() {
        for (let r of removes) {
          await postRemove(r.items, r.quantity, r.notes);
        }
      }

      setDisabled(bookBtn, true);
      try {
        await processAdds();
        await processRemoves();
        alert('Buchungen erfolgreich.');
        if (clearBtn) clearBtn.click();
      } catch (e) {
        console.groupCollapsed('Buchen error', e.status || '', e.message || '');
        console.error('URL:', e.url);
        console.error('Status:', e.status);
        console.error('Message:', e.message);
        console.error('Payload (raw):', e.payload);
        console.error('Request Payload (last sent):', { adds, removes });
        if (e.payload && typeof e.payload === 'object') {
          try { console.error('Payload (pretty):', JSON.stringify(e.payload, null, 2)); } catch (_) {}
        }
        console.groupEnd();
        const details = extractErrors(e.payload);
        alert('Fehler beim Buchen: ' + (e.message || e) + (details ? '\nDetails: ' + details : ''));
      } finally {
        setDisabled(bookBtn, false);
      }
    });
  }
})();
